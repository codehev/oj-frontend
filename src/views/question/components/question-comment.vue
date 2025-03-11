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
    <!-- 空评论列表 -->
    <a-result
      v-if="!loading && commentList.length === 0"
      status="404"
      subtitle="还没有评论哦~ 点击评论输入第一条评论"
    />

    <!-- 评论列表 -->
    <inner-question-comment
      v-if="!loading && commentList.length > 0"
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
import { onMounted, ref, defineProps, watch } from "vue";
import { IconMessage } from "@arco-design/web-vue/es/icon";
import { Message } from "@arco-design/web-vue";
import InnerQuestionComment from "@/views/question/components/inner-question-comment.vue";
import {
  QuestionCommentControllerService,
  QuestionCommentVO,
} from "../../../../generated";

const props = defineProps<{
  questionId?: string;
}>();

const commentVisible = ref(false);
const commentContent = ref("");
const commentList = ref<QuestionCommentVO[]>([]);
const loading = ref(false);

// 监听 questionId 的变化
watch(
  () => props.questionId,
  (newId) => {
    if (newId) {
      getRootComment();
    }
  }
);

// 提交评论
const submitComment = async () => {
  if (!props.questionId) {
    Message.error("题目ID不存在");
    return;
  }
  const res = await QuestionCommentControllerService.saveUsingPost1({
    content: commentContent.value,
    questionId: props.questionId as any,
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
  if (!props.questionId) {
    Message.error("题目ID不存在");
    return;
  }
  // 找到父评论
  const parentComment = commentList.value.find((c) => c.id === parentId);
  if (parentComment) {
    if (hasChildren !== undefined) {
      // 如果已知是否有子评论，直接更新
      parentComment.expandedFlag = hasChildren;
    } else {
      // 否则查询API确定
      try {
        const res = await QuestionCommentControllerService.listUsingGet1(
          props.questionId as any,
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
  if (!props.questionId) {
    Message.error("题目ID不存在");
    return;
  }
  loading.value = true;
  try {
    const res = await QuestionCommentControllerService.listUsingGet1(
      props.questionId as any
    );
    if (res.code === 0) {
      commentList.value = res.data as QuestionCommentVO[];
    } else {
      Message.error("获取评论失败");
    }
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  if (props.questionId) {
    getRootComment();
  }
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
