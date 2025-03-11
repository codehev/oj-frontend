<template>
  <!-- 评论列表 -->
  <!-- <a-result
    v-if="comments.length === 0"
    status="404"
    subtitle="还没有评论哦~ 点击评论输入第一条评论"
  /> -->
  <a-comment
    v-for="(comment, index) in visibleComments"
    :key="index"
    :author="comment.userName"
    :datetime="dayjs(comment.createTime).format('YYYY-MM-DD HH:mm:ss')"
  >
    <template #avatar>
      <a-avatar
        :image-url="comment.userAvatar"
        trigger-type="mask"
        @click="handleToUserInfo(comment.userId + '')"
      >
        <template #trigger-icon>
          <icon-user />
        </template>
      </a-avatar>
    </template>
    <template #content>
      <MdPreview style="padding: 0; margin: 0" :modelValue="comment.content" />
    </template>
    <template #actions>
      <a-popover
        v-model:popup-visible="replyVisibleMap[comment.id || '']"
        trigger="click"
      >
        <template #content>
          <a-textarea
            v-model="recoverComment.content"
            style="width: 250px; height: 100px"
            placeholder="请友好回复哦~"
          />
          <a-row class="pt-1.5">
            <a-col :flex="1" />
            <a-col :span="5.5">
              <a-space>
                <a-button @click="closeReplyPopover(comment)">取消</a-button>
                <a-button
                  type="primary"
                  style="text-align: right"
                  @click="doRecoverComment(comment)"
                >
                  提交
                </a-button>
              </a-space>
            </a-col>
          </a-row>
        </template>
        <span class="action" @click="handleRecoverComment(comment)">
          <IconMessage />
          回复
        </span>
      </a-popover>
      <!-- 删除评论按钮 - 仅当评论作者是当前登录用户时显示 -->
      <a-popconfirm
        v-if="isCurrentUserComment(comment)"
        content="确定要删除这条评论吗？此操作不可恢复。"
        @ok="handleConfirmDelete(comment)"
        @cancel="handleCancelDelete"
        position="br"
      >
        <span class="action delete-action">
          <IconDelete />
          删除
        </span>
      </a-popconfirm>
      <!-- 只有确认有子评论时才显示展开按钮，使用expandedFlag判断 -->
      <a-link
        v-if="!isCommentExpanded(comment) && comment.expandedFlag"
        class="action"
        @click="expandComment(comment)"
      >
        <IconDown />
        展开
      </a-link>
      <span
        v-if="isCommentExpanded(comment)"
        class="action"
        @click="collapseComment(comment)"
      >
        <IconUp />
        收起
      </span>
    </template>
    <!-- 递归嵌套子评论 -->
    <inner-post-comment
      v-if="isCommentExpanded(comment)"
      :comments="commentChildrenMap[comment.id || ''] || []"
      @comment-deleted="handleChildCommentDeleted"
    />
  </a-comment>
</template>

<script setup lang="ts">
import {
  PropType,
  ref,
  defineProps,
  defineEmits,
  onMounted,
  reactive,
  computed,
} from "vue";
import {
  IconMessage,
  IconUser,
  IconDown,
  IconUp,
  IconDelete,
} from "@arco-design/web-vue/es/icon";
import { MdPreview } from "md-editor-v3";
import { Message } from "@arco-design/web-vue";
import router from "@/router";
import {
  PostCommentRequest,
  PostCommentVO,
  PostCommentControllerService,
} from "../../../../../generated";
import dayjs from "dayjs";
import store from "@/store";

const props = defineProps({
  comments: {
    type: Array as PropType<PostCommentVO[]>,
    default: () => [],
  },
});

// 定义事件
const emit = defineEmits([
  "comment-deleted",
  "update-parent-status", // 添加新事件，用于更新父评论状态
]);

// 本地维护的评论列表，用于处理删除等操作
const localComments = ref<PostCommentVO[]>([]);

// 可见的评论列表，排除已删除的评论
const visibleComments = computed(() => {
  return localComments.value;
});

// 监听props.comments的变化，同步到本地状态
onMounted(() => {
  // 初始化本地评论列表
  localComments.value = [...props.comments];
});

// 评论回复子集映射，key为父评论id，value为子评论数组
const commentChildrenMap = reactive<{ [key: string]: PostCommentVO[] }>({});

// 跟踪哪些评论被展开了，key为评论id，value为是否展开
const expandedCommentsMap = reactive<{ [key: string]: boolean }>({});

// 回复弹出框可见性映射，key为评论id，value为是否显示回复框
const replyVisibleMap = reactive<{ [key: string]: boolean }>({});

// 当前登录用户ID
const currentUserId = ref<number | null>(null);

// 在组件挂载时获取当前用户信息
onMounted(() => {
  try {
    // 尝试从localStorage获取用户信息
    const loginUser = store.state.user.loginUser;
    if (loginUser) {
      currentUserId.value = loginUser.id;
    }
  } catch (error) {
    console.error("获取当前用户信息失败:", error);
  }

  // 初始化评论状态
  localComments.value.forEach((comment) => {
    if (comment.id) {
      // 初始化回复弹出框状态
      replyVisibleMap[comment.id] = false;
      // 初始化展开状态为折叠
      expandedCommentsMap[comment.id] = false;
    }
  });
});

// 判断评论是否被展开
const isCommentExpanded = (comment: PostCommentVO) => {
  return comment.id ? expandedCommentsMap[comment.id] : false;
};

// 判断评论是否是当前登录用户发表的
const isCurrentUserComment = (comment: PostCommentVO) => {
  return currentUserId.value && comment.userId === currentUserId.value;
};

/**
 * 处理子评论删除事件
 * 当子组件删除评论时，捕获并处理该事件
 */
const handleChildCommentDeleted = async (
  commentId: number,
  parentId?: number
) => {
  // 找到这个子评论并处理
  // 在所有的子评论集合中查找
  Object.keys(commentChildrenMap).forEach((pid) => {
    const childComments = commentChildrenMap[pid];
    const index = childComments.findIndex((c) => c.id === commentId);
    if (index !== -1) {
      // 从子评论集合中移除
      childComments.splice(index, 1);

      // 检查删除后是否还有子评论
      if (childComments.length === 0) {
        // 如果没有子评论了，更新父评论的展开状态标记
        // 先在本地找
        const parentComment = localComments.value.find(
          (c) => c.id === Number(pid)
        );
        if (parentComment) {
          // 更新父评论的expandedFlag为false
          parentComment.expandedFlag = false;
          // 确保展开状态也是关闭的
          expandedCommentsMap[pid] = false;
        } else {
          // 如果本地找不到，通过事件通知父组件更新
          emit("update-parent-status", Number(pid), false);
        }
      }
    }
  });

  // 向上级组件传递删除事件，带上父评论ID信息
  emit("comment-deleted", commentId, parentId);
};

/**
 * 处理确认删除评论
 * 当删除一条评论时，不仅需要调用API删除数据库中的记录，
 * 还需要更新本地的评论数据结构
 */
const handleConfirmDelete = async (comment: PostCommentVO) => {
  if (!comment || !comment.id) return;

  try {
    const res = await PostCommentControllerService.removeUsingDelete(
      comment.id + ""
    );

    if (res.code === 0) {
      Message.success("评论删除成功");

      // 从本地评论列表中移除
      const index = localComments.value.findIndex((c) => c.id === comment.id);
      if (index !== -1) {
        localComments.value.splice(index, 1);
      }

      // 通过事件通知父组件删除评论，传递父评论ID
      emit("comment-deleted", comment.id, comment.parentId);

      // 如果删除的评论有子评论，也要清理它们的映射
      if (comment.id && commentChildrenMap[comment.id + ""]) {
        delete commentChildrenMap[comment.id + ""];
      }

      // 如果删除的是子评论，需要检查父评论是否还有其他子评论
      if (comment.parentId) {
        // 需要检查父评论的子评论数量
        await checkParentCommentStatus(comment.parentId);
      }
    } else {
      Message.error("删除失败: " + res.message);
    }
  } catch (error) {
    console.error("删除评论失败:", error);
    Message.error("删除评论失败");
  }
};

/**
 * 检查父评论状态
 * 查询父评论是否还有子评论，并更新状态
 */
const checkParentCommentStatus = async (parentId: number) => {
  if (!parentId) return;

  try {
    // 直接调用API查询子评论数量
    const parentIdStr = parentId + "";
    // 找到合适的postId
    let postId = null;
    if (props.comments.length > 0 && props.comments[0].postId) {
      postId = props.comments[0].postId;
    } else if (recoverComment.value.postId) {
      postId = recoverComment.value.postId;
    }

    if (!postId) return;

    const res = await PostCommentControllerService.listUsingGet(
      Number(postId), // 转换为number类型
      parentId // API期望parentId是number类型
    );

    if (res.code === 0) {
      const hasChildren =
        res.data && Array.isArray(res.data) && res.data.length > 0;

      // 更新父评论的状态
      const parentComment = localComments.value.find((c) => c.id === parentId);
      if (parentComment) {
        parentComment.expandedFlag = hasChildren;
        if (!hasChildren) {
          expandedCommentsMap[parentIdStr] = false;
        }
      } else {
        // 如果本地找不到父评论，通过事件通知父组件更新
        emit("update-parent-status", parentId, hasChildren);
      }
    }
  } catch (error) {
    console.error("检查父评论状态失败:", error);
  }
};

// 处理取消删除
const handleCancelDelete = () => {
  // 取消删除不需要做任何事
};

// 关闭回复弹出框
const closeReplyPopover = (comment: PostCommentVO) => {
  if (comment.id) {
    replyVisibleMap[comment.id] = false;
  }
};

// 点击展开，加载子评论
const expandComment = async (comment: PostCommentVO) => {
  if (comment.id && comment.postId) {
    try {
      // 先加载子评论数据
      await loadChildComments(comment.id + "", comment.postId + "");
      // 加载完成后再设置展开状态，确保有数据后再显示
      expandedCommentsMap[comment.id] = true;
    } catch (error) {
      console.error("展开评论失败:", error);
      Message.error("加载子评论失败");
    }
  }
};

// 折叠子评论
const collapseComment = (comment: PostCommentVO) => {
  if (comment.id) {
    expandedCommentsMap[comment.id] = false;
  }
};

// 加载子评论
const loadChildComments = async (parentId: string, postId: string) => {
  if (!parentId || !postId) return;

  try {
    // 检查是否已经加载过，如果已加载则不重复请求
    if (
      commentChildrenMap[parentId] &&
      commentChildrenMap[parentId].length > 0
    ) {
      return;
    }

    const res = await PostCommentControllerService.listUsingGet(
      postId as any,
      parentId as any
    );
    if (res.code === 0) {
      if (res.data && Array.isArray(res.data)) {
        // 确保响应式更新，使用Vue的方式设置属性
        commentChildrenMap[parentId] = [...res.data];
        // 为子评论初始化状态
        res.data.forEach((child) => {
          if (child.id) {
            replyVisibleMap[child.id] = false;
            expandedCommentsMap[child.id] = false;
          }
        });
      } else {
        commentChildrenMap[parentId] = [];
      }
    } else {
      Message.error("获取子评论失败");
    }
  } catch (error) {
    console.error("加载子评论失败:", error);
    Message.error("加载子评论失败");
  }
};

const recoverComment = ref<PostCommentRequest>({
  content: "",
  postId: 0,
  parentId: 0,
});

const handleRecoverComment = (comment: PostCommentVO) => {
  recoverComment.value.parentId = comment.id;
  recoverComment.value.postId = comment.postId;
  // 显示回复弹出框
  if (comment.id) {
    replyVisibleMap[comment.id] = true;
  }
};

/**
 * 提交回复
 */
const doRecoverComment = async (comment: PostCommentVO) => {
  const res = await PostCommentControllerService.saveUsingPost(
    recoverComment.value
  );
  if (res.code === 0) {
    recoverComment.value.content = "";
    Message.success("回复成功");
    // 关闭回复弹出框
    if (comment.id) {
      replyVisibleMap[comment.id] = false;
    }

    // 标记评论有子评论，但不自动展开
    if (comment.id) {
      comment.expandedFlag = true; // 直接设置有子评论标记

      // 刷新子评论数据
      if (comment.postId) {
        // 刷新前先清除缓存，确保能获取最新数据
        if (commentChildrenMap[comment.id]) {
          delete commentChildrenMap[comment.id];
        }
        await loadChildComments(comment.id + "", comment.postId + "");
      }
    }

    // 回复成功后不自动展开子评论
  } else {
    Message.error("回复失败：" + res.message);
  }
};

const handleToUserInfo = (userId: string) => {
  router.push({
    path: "/user/home/" + userId,
  });
};
</script>

<style scoped lang="less">
.action {
  display: inline-block;
  padding: 0 4px;
  line-height: 24px;
  color: var(--color-text-1);
  cursor: pointer;
  background: transparent;
  border-radius: 2px;
  transition: all 0.1s ease;
}

.action:hover {
  background: var(--color-fill-3);
}

.delete-action {
  color: #f53f3f;

  &:hover {
    background: #ffeded;
  }
}
</style>
