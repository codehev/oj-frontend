<template>
  <!-- 评论输入框 -->
  <a-card :bordered="false" class="comment-container">
    <!-- 评论按钮区域，移至最上方 -->
    <div class="comment-header">
      <div class="comment-title">评论区</div>
      <a-button
        v-if="!commentVisible"
        type="primary"
        shape="round"
        @click="commentVisible = !commentVisible"
      >
        <template #icon>
          <IconMessage />
        </template>
        写评论
      </a-button>
    </div>

    <!-- 评论输入框 -->
    <div v-if="commentVisible" class="comment-input-area">
      <a-textarea
        v-model="commentContent"
        placeholder="友好交流哦~"
        style="height: 100px"
      />
      <a-row class="comment-input-actions">
        <a-col :flex="1" />
        <a-col :span="5.5">
          <a-space>
            <a-button @click="commentVisible = !commentVisible">取消</a-button>
            <a-button
              type="primary"
              style="text-align: right"
              @click="submitComment"
            >
              提交
            </a-button>
          </a-space>
        </a-col>
      </a-row>
    </div>

    <!-- 评论列表 -->
    <inner-post-comment
      v-if="!loading"
      :comments="commentList"
      @comment-deleted="handleCommentDeleted"
      @update-parent-status="handleUpdateParentStatus"
    />

    <!-- 骨架屏 -->
    <a-skeleton v-if="loading" animation>
      <a-space direction="vertical" :style="{ width: '100%' }" size="large">
        <a-skeleton-shape />
        <a-skeleton-line :rows="3" :widths="['40%', '100%', '100%']" />
      </a-space>
    </a-skeleton>
  </a-card>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref, defineProps } from "vue";
import { IconMessage } from "@arco-design/web-vue/es/icon";
import { Message } from "@arco-design/web-vue";
import InnerPostComment from "@/views/post/info/components/inner-post-comment.vue";
import {
  PostCommentControllerService,
  PostCommentVO,
} from "../../../../../generated";

const props = defineProps<{
  postId: string;
}>();

const commentVisible = ref(false);
const commentContent = ref("");
const commentList = ref<PostCommentVO[]>([]);
const loading = ref(false);

// 提交评论
const submitComment = async () => {
  const res = await PostCommentControllerService.saveUsingPost({
    content: commentContent.value,
    postId: props.postId as any,
  });
  if (res.code === 0) {
    Message.success("评论成功");
    commentVisible.value = false;
    commentContent.value = "";
    getRootComment();
  } else {
    Message.error("评论失败，" + res.message);
  }
};

/**
 * 处理评论被删除的事件
 */
const handleCommentDeleted = (commentId: number, parentId?: number) => {
  // 从评论列表中移除被删除的评论
  const index = commentList.value.findIndex((c) => c.id === commentId);
  if (index !== -1) {
    commentList.value.splice(index, 1);
  }

  // 如果有父评论ID并且删除的是子评论，检查父评论状态
  if (parentId) {
    handleUpdateParentStatus(parentId);
  }
};

/**
 * 处理更新父评论状态事件
 */
const handleUpdateParentStatus = async (
  parentId: number,
  hasChildren?: boolean
) => {
  // 找到父评论
  const parentComment = commentList.value.find((c) => c.id === parentId);
  if (parentComment) {
    if (hasChildren !== undefined) {
      // 如果已知是否有子评论，直接更新
      parentComment.expandedFlag = hasChildren;
    } else {
      // 否则查询API确定
      try {
        const res = await PostCommentControllerService.listUsingGet(
          Number(props.postId),
          parentId
        );
        if (res.code === 0) {
          const hasChildComments =
            res.data && Array.isArray(res.data) && res.data.length > 0;
          parentComment.expandedFlag = hasChildComments;
        }
      } catch (error) {
        console.error("检查父评论子评论失败:", error);
      }
    }
  }
};

/**
 * 获取根节点评论
 */
const getRootComment = async () => {
  loading.value = true;
  try {
    const res = await PostCommentControllerService.listUsingGet(
      props.postId as any
    );
    if (res.code === 0) {
      commentList.value = res.data as PostCommentVO[];
    } else {
      Message.error("获取评论失败");
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  nextTick(() => {
    getRootComment();
  });
});
</script>

<style scoped lang="less">
.comment-container {
  margin-top: 16px;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.comment-title {
  font-size: 16px;
  font-weight: 500;
}

.comment-input-area {
  margin-bottom: 20px;
}

.comment-input-actions {
  margin-top: 12px;
}
</style>
