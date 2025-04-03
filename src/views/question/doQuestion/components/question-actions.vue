<template>
  <div class="action-container">
    <div class="action-wrapper">
      <a-badge :max-count="999" :count="Number(question.thumbNum)">
        <a-button
          v-if="!question.hasThumb"
          class="action-button"
          size="small"
          @click="handleThumb"
        >
          <icon-thumb-up /> 点赞
        </a-button>
        <a-button
          v-else
          class="action-button-thumb"
          size="small"
          @click="handleThumb"
        >
          <icon-thumb-up-fill /> 已赞
        </a-button>
      </a-badge>
      <a-badge :max-count="999" :count="Number(question.favourNum)">
        <a-button
          v-if="!question.hasFavour"
          class="action-button"
          size="small"
          @click="handleFavour"
        >
          <icon-star /> 收藏
        </a-button>
        <a-button
          v-else
          class="action-button-favour"
          size="small"
          @click="handleFavour"
        >
          <icon-star-fill /> 已收藏
        </a-button>
      </a-badge>
      <a-badge :max-count="999" :count="Number(commentNum)">
        <a-button class="action-button" size="small" @click="scrollToComment">
          <icon-message /> 评论
        </a-button>
      </a-badge>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from "vue";
import { Message } from "@arco-design/web-vue";
import {
  IconThumbUp,
  IconThumbUpFill,
  IconStar,
  IconStarFill,
  IconMessage,
} from "@arco-design/web-vue/es/icon";
import {
  QuestionFavourControllerService,
  QuestionThumbControllerService,
  QuestionVO,
} from "../../../../../generated";

// 发出事件
const emit = defineEmits(["reload-comment-count", "switch-tab"]);

const props = defineProps<{
  questionInfo: QuestionVO;
  commentNum?: number; // 接收父组件传来的评论数
}>();

// 问题信息
const question = ref<QuestionVO>({
  thumbNum: 0,
  favourNum: 0,
  hasThumb: false,
  hasFavour: false,
});

// 监听问题信息
watch(
  () => props.questionInfo,
  (newVal) => {
    if (newVal) {
      // console.log("接收到新的问题信息:", newVal);
      // 确保所有需要的字段都有值
      question.value = {
        id: newVal.id,
        thumbNum: newVal.thumbNum || 0,
        favourNum: newVal.favourNum || 0,
        hasThumb: newVal.hasThumb || false,
        hasFavour: newVal.hasFavour || false,
        ...newVal,
      };
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

// 滚动到评论区
const scrollToComment = () => {
  // 向父组件发送切换到评论标签页的事件
  emit("switch-tab", "4");
};

// 点赞
const handleThumb = async () => {
  try {
    // console.log("点赞操作，当前问题ID:", question.value.id);
    if (!question.value.id) {
      Message.error("题目ID不存在，无法点赞");
      return;
    }

    var res = await QuestionThumbControllerService.doThumbUsingPost1({
      questionId: question.value.id,
    });
    // console.log("点赞返回结果:", res);

    if (res.code === 0) {
      const thumbChange = res.data;
      const currentThumbNum = Number(question.value.thumbNum) || 0;
      if (thumbChange > 0) {
        question.value.hasThumb = true;
        question.value.thumbNum = currentThumbNum + thumbChange;
      } else {
        question.value.hasThumb = false;
        question.value.thumbNum = currentThumbNum + thumbChange;
      }
    } else {
      Message.error("点赞失败，" + res.message);
    }
  } catch (error: any) {
    console.error("点赞操作异常:", error);
    Message.error("点赞失败，" + (error.message || "未知错误"));
  }
};

// 收藏
const handleFavour = async () => {
  try {
    // console.log("收藏操作，当前问题ID:", question.value.id);
    if (!question.value.id) {
      Message.error("题目ID不存在，无法收藏");
      return;
    }

    const res = await QuestionFavourControllerService.doQuestionFavourUsingPost(
      {
        questionId: question.value.id,
      }
    );
    // console.log("收藏返回结果:", res);

    if (res.code === 0) {
      const favourChange = res.data;
      const currentFavourNum = Number(question.value.favourNum) || 0;
      if (favourChange > 0) {
        question.value.hasFavour = true;
        question.value.favourNum = currentFavourNum + favourChange;
      } else {
        question.value.hasFavour = false;
        question.value.favourNum = currentFavourNum + favourChange;
      }
    } else {
      Message.error("收藏失败，" + res.message);
    }
  } catch (error: any) {
    console.error("收藏操作异常:", error);
    Message.error("收藏失败，" + (error.message || "未知错误"));
  }
};
</script>

<style scoped lang="less">
.action-container {
  width: 100%;
  background-color: #fff;
  padding: 8px 0;
  margin-top: 8px;
  border-top: 1px solid #e5e6eb;
}

.action-wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  max-width: 100%;
  margin: 0;
  padding-left: 20px;
  gap: 30px;
}

.action-button {
  font-size: 12px;

  &-thumb {
    font-size: 12px;
    color: #165dff;
  }

  &-favour {
    font-size: 12px;
    color: #ffb800;
  }
}
</style>
