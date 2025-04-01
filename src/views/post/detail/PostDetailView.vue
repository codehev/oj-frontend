<template>
  <div ref="postInfoRef" class="container-info">
    <a-row :gutter="10">
      <a-col :span="1">
        <post-actions
          :post-info="postVO"
          :comment-num="Number(commentNum)"
          @reload-comment-count="loadCommentCount"
        />
      </a-col>
      <a-col flex="1">
        <!-- 面包屑 -->
        <BreadcrumbComponent :items="items" />
        <post-detail
          ref="postDetailRef"
          :post-info="postVO"
          @catalog-change="handleGetCatalog"
        />
        <!-- 添加评论区到页面底部 -->
        <div class="comment-section">
          <a-divider>
            <a-space>
              <icon-message />
              评论区
            </a-space>
          </a-divider>
          <post-comment
            :post-id="route.query.postId as string"
            @comment-count-changed="loadCommentCount"
          />
        </div>
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
import PostDetail from "@/views/post/detail/components/post-detail.vue";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import UserInfoCard from "@/views/post/detail/components/user-info-card.vue";
import { HeadList } from "md-editor-v3/lib/types/MdEditor/type";
import { nanoid } from "nanoid";
import PostActions from "@/views/post/detail/components/post-actions.vue";
import PostComment from "@/views/post/detail/components/post-comment.vue";
import BreadcrumbComponent from "@/components/breadcrumb/BreadcrumbComponent.vue";
import {
  PostControllerService,
  PostVO,
  PostCommentControllerService,
} from "../../../../generated";
import { Message } from "@arco-design/web-vue";
import { IconMessage } from "@arco-design/web-vue/es/icon";
import { BreadcrumbItem } from "@/components/breadcrumb/types";
// 帖子信息容器(要滚动的容器)
const postInfoRef = ref<HTMLElement>();
// 帖子信息
const postVO = ref<PostVO>({});
// 帖子详情
const postDetailRef = ref();
// 路由
const route = useRoute();
// 评论数
const commentNum = ref<number>(0);

const items = ref<BreadcrumbItem[]>([
  { path: "/post", name: "帖子" },
  {
    path: "/post/detail",
    name: "详情",
    query: { postId: route.query.postId as string },
  },
]);

/**
 * 加载评论数量
 */
const loadCommentCount = async () => {
  try {
    const res = await PostCommentControllerService.getNumUsingGet(
      route.query.postId as any
    );
    if (res.code === 0) {
      commentNum.value = res.data as number;
    } else {
      console.error("获取评论数失败:", res.message);
    }
  } catch (error) {
    console.error("获取评论数失败:", error);
  }
};

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
  loadCommentCount(); // 初始加载评论数
});
</script>

<style scoped lang="less">
.container-info {
  padding: 0 20px 20px;
}

.comment-section {
  margin-top: 20px;
}
</style>
