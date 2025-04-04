<template>
  <a-affix :offset-top="200">
    <a-space direction="vertical" size="large">
      <a-badge
        :max-count="999"
        :offset="[-35, 0]"
        :count="Number(post.thumbNum)"
        :dotStyle="{ background: '#E5E6EB', color: '#86909C' }"
      >
        <a-button
          v-if="!post.hasThumb"
          class="affix-button"
          shape="circle"
          @click="handleThumb"
        >
          <icon-thumb-up />
        </a-button>
        <a-button
          v-else
          class="affix-button-thumb"
          shape="circle"
          @click="handleThumb"
        >
          <icon-thumb-up-fill />
        </a-button>
      </a-badge>
      <a-badge
        :max-count="999"
        :offset="[-35, 0]"
        :count="Number(post.favourNum)"
        :dotStyle="{ background: '#E5E6EB', color: '#86909C' }"
      >
        <a-button
          v-if="!post.hasFavour"
          class="affix-button"
          shape="circle"
          @click="handleFavour"
        >
          <icon-star />
        </a-button>
        <a-button
          v-else
          class="affix-button-favour"
          shape="circle"
          @click="handleFavour"
        >
          <icon-star-fill />
        </a-button>
      </a-badge>
      <a-badge
        :offset="[-35, 0]"
        :max-count="999"
        :count="Number(commentNum)"
        :dotStyle="{ background: '#E5E6EB', color: '#86909C' }"
      >
        <a-button class="affix-button" shape="circle" @click="scrollToComment">
          <icon-message />
        </a-button>
      </a-badge>
      <a-button class="affix-button" shape="circle" @click="router.back()">
        <icon-reply />
      </a-button>
      <a-button class="affix-button" shape="circle">
        <icon-exclamation-circle-fill />
      </a-button>
    </a-space>
  </a-affix>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, defineProps, defineEmits } from "vue";
import { Message } from "@arco-design/web-vue";
import {
  IconThumbUp,
  IconThumbUpFill,
  IconStar,
  IconStarFill,
  IconMessage,
  IconReply,
  IconExclamationCircleFill,
} from "@arco-design/web-vue/es/icon";
import { useRoute } from "vue-router";
import {
  PostFavourControllerService,
  PostThumbControllerService,
  PostVO,
} from "../../../../../generated";
import { useRouter } from "vue-router";

const router = useRouter();
const route = useRoute();

// 发出事件
const emit = defineEmits(["reload-comment-count"]);

const props = defineProps<{
  postInfo: PostVO;
  commentNum?: number; // 接收父组件传来的评论数
}>();

// 帖子信息
const post = ref<PostVO>({
  thumbNum: 0,
  favourNum: 0,
  viewNum: 0,
  hasThumb: false,
  hasFavour: false,
});

// 监听帖子信息
watch(
  () => props.postInfo,
  () => {
    post.value = props.postInfo;
  },
  {
    deep: true,
  }
);

// 滚动到评论区
const scrollToComment = () => {
  const commentSection = document.querySelector(".comment-section");
  if (commentSection) {
    commentSection.scrollIntoView({ behavior: "smooth" });
  }
};

// 点赞
const handleThumb = async () => {
  var res = await PostThumbControllerService.doThumbUsingPost({
    postId: post.value.id as any,
  });
  if (res.code === 0) {
    const thumbChange = res.data;
    const currentThumbNum = Number(post.value.thumbNum);
    if (thumbChange > 0) {
      post.value.hasThumb = true;
      post.value.thumbNum = currentThumbNum + thumbChange;
    } else {
      post.value.hasThumb = false;
      post.value.thumbNum = currentThumbNum + thumbChange;
    }
  } else {
    Message.error("操作失败，" + res.message);
  }
};

// 收藏
const handleFavour = async () => {
  const res = await PostFavourControllerService.doPostFavourUsingPost({
    postId: post.value.id as any,
  });
  if (res.code === 0) {
    const favourChange = res.data;
    const currentFavourNum = Number(post.value.favourNum);
    if (favourChange > 0) {
      post.value.hasFavour = true;
      post.value.favourNum = currentFavourNum + favourChange;
    } else {
      post.value.hasFavour = false;
      post.value.favourNum = currentFavourNum + favourChange;
    }
  } else {
    Message.error("操作失败，" + res.message);
  }
};
</script>

<style scoped lang="less">
.affix-button {
  background-color: white;
  width: 50px;
  height: 50px;
  font-size: 20px;

  &-thumb {
    color: #165dff;
    background-color: white;
    width: 50px;
    height: 50px;
    font-size: 20px;
  }

  &-favour {
    color: #ffb800;
    background-color: white;
    width: 50px;
    height: 50px;
    font-size: 20px;
  }
}
</style>
