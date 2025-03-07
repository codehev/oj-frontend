<template>
  <div ref="postInfoRef" class="container-info">
    <a-row :gutter="10">
      <a-col :span="1">
        <post-actions :post-info="postVO" />
      </a-col>
      <a-col flex="1">
        <!-- 面包屑 -->
        <BreadcrumbComponent :items="items" />
        <post-detail
          ref="postDetailRef"
          :post-info="postVO"
          @catalog-change="handleGetCatalog"
        />
      </a-col>
      <a-col :span="4">
        <a-space direction="vertical">
          <a-affix :offset-top="100">
            <user-info-card :post-info="postVO" />
          </a-affix>
          <a-affix :offset-top="250">
            <a-card title="目录">
              <!-- 锚点 -->
              <a-anchor
                :scroll-container="postInfoRef"
                smooth
                :change-hash="false"
              >
                <template v-for="(header, index) in headers" :key="index">
                  <a-anchor-link
                    :href="'#' + header.text"
                    :title="header.text"
                  />
                </template>
              </a-anchor>
            </a-card>
          </a-affix>
        </a-space>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import PostDetail from "@/views/post/info/components/post-detail.vue";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import UserInfoCard from "@/views/post/info/components/user-info-card.vue";
import { HeadList } from "md-editor-v3/lib/types/MdEditor/type";
import { nanoid } from "nanoid";
import PostActions from "@/views/post/info/components/post-actions.vue";
import BreadcrumbComponent from "@/components/breadcrumb/BreadcrumbComponent.vue";
import { PostControllerService, PostVO } from "../../../../generated";
import { Message } from "@arco-design/web-vue";
import { BreadcrumbItem } from "@/components/breadcrumb/types";
// 帖子信息容器(要滚动的容器)
const postInfoRef = ref<HTMLElement>();
// 帖子信息
const postVO = ref<PostVO>({});
// 帖子详情
const postDetailRef = ref();
// 路由
const route = useRoute();
// const postId = Number(route.query.postId);

const items = ref<BreadcrumbItem[]>([
  { path: "/post", name: "帖子" },
  {
    path: "/post/detail",
    name: "详情",
    query: { postId: route.query.postId as string },
  },
]);

const getPostInfo = async () => {
  const res = await PostControllerService.getPostVoByIdUsingGet(
    route.query.postId as any
  );
  if (res.code === 0) {
    postVO.value = res.data as PostVO;
  } else {
    Message.error("获取帖子失败");
  }
};

interface Head {
  id: string;
  text: string;
  level: 1 | 2 | 3 | 4 | 5 | 6;
}

const headers = ref<Head[]>([]);
// 获取目录
const handleGetCatalog = (titleList: HeadList[]) => {
  // TODO: 实现子目录
  headers.value = titleList.map((item) => {
    return {
      id: nanoid(),
      text: item.text,
      level: item.level,
    };
  });
};

onMounted(() => {
  getPostInfo();
});
</script>

<style scoped lang="less">
.container-info {
  padding: 0 20px 20px;
}
</style>
