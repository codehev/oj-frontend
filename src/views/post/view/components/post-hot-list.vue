<template>
  <!--  热门帖子-->
  <a-card style="border-radius: 10px">
    <template #title>
      <a-space>
        <icon-bookmark style="color: #ff783b" />
        文章榜
      </a-space>
    </template>
    <a-list
      v-if="!loading"
      size="small"
      :bordered="false"
      :split="false"
      hoverable
    >
      <a-list-item
        v-for="(item, index) in hotPostList"
        :key="index"
        class="list-item"
        @click="handleToPostDetail(item)"
      >
        <a-row :gutter="10">
          <a-col :span="2">
            <!--排版==》文本-->
            <a-typography-text bold :type="getType(index + 1)">
              {{ index + 1 }}
            </a-typography-text>
          </a-col>
          <a-col :span="22">
            <!--ellipsis="true" 自动溢出省略-->
            <a-typography-text :ellipsis="true">
              {{ item.title }}
            </a-typography-text>
          </a-col>
        </a-row>
      </a-list-item>
    </a-list>
    <!-- 骨架屏-->
    <a-skeleton v-else animation>
      <a-space direction="vertical" :style="{ width: '100%' }" size="large">
        <a-skeleton-line :rows="5" />
      </a-space>
    </a-skeleton>
  </a-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { PostControllerService, PostSimpleVo } from "../../../../../generated";
import { Message } from "@arco-design/web-vue";
import { IconBookmark } from "@arco-design/web-vue/es/icon";

const hotPostList = ref<PostSimpleVo[]>([]);
const loading = ref(false);

onMounted(async () => {
  loading.value = true;
  const res = await PostControllerService.getHotPostUsingPost();
  if (res.code == 0) {
    hotPostList.value = res.data;
  } else {
    Message.error("获取热门帖子失败");
  }
  loading.value = false;
});
const getType = (index: number) => {
  if (index == 1) {
    return "danger";
  } else if (index == 2) {
    return "warning";
  } else if (index == 3) {
    return "primary";
  } else {
    return "default";
  }
};
const router = useRouter();
const handleToPostDetail = (item: PostSimpleVo) => {
  router.push({
    path: "/post/detail",
    query: {
      postId: item.id,
    },
  });
};
</script>

<style scoped lang="less">
.list-item {
  cursor: pointer;
}
</style>
