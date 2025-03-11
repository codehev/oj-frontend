<template>
  <a-card>
    <a-space size="medium">
      <a-avatar
        trigger-type="mask"
        :image-url="post?.user?.userAvatar"
        @click="handleToUserInfo"
      >
        <template #trigger-icon>
          <icon-user />
        </template>
      </a-avatar>
      <a-space direction="vertical">
        <a-typography-title bold style="font-size: 17px">
          {{ post?.user?.userName ?? "暂无用户名" }}
        </a-typography-title>
        <a-typography-paragraph
          type="secondary"
          style="font-size: 13px; width: 100px"
          :ellipsis="{
            rows: 1,
            showTooltip: {
              type: 'tooltip',
              props: {
                position: 'bottom',
              },
            },
          }"
        >
          {{ post?.user?.userProfile ?? "暂无简介" }}
        </a-typography-paragraph>
      </a-space>
    </a-space>
  </a-card>
</template>

<script setup lang="ts">
import { ref, watch, defineProps } from "vue";
import { useRouter } from "vue-router";
import { PostVO } from "../../../../../generated";
import { IconUser } from "@arco-design/web-vue/es/icon";

const props = defineProps<{
  postInfo: PostVO;
}>();

const post = ref<PostVO>({
  userId: 0,
  user: {
    id: 0,
    userAvatar: "",
    userName: "",
    userProfile: "",
  },
});

const router = useRouter();
const handleToUserInfo = () => {
  router.push({
    path: "/user/home/" + post.value?.userId,
  });
};

watch(
  () => props.postInfo,
  () => {
    if (props.postInfo) {
      post.value = props.postInfo;
    }
  },
  {
    deep: true,
  }
);
</script>

<style scoped lang="less"></style>
