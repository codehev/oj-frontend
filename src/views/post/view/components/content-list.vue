<template>
  <!--  帖子列表-->
  <a-card style="border-radius: 10px">
    <a-list
      v-if="postVOList.length > 0"
      class="content-list"
      :max-height="600"
      :data="postVOList"
      :bordered="false"
      @reach-bottom="handleLoadPost"
    >
      <template #item="{ item, index }">
        <a-list-item
          :key="index"
          class="content-list-item"
          action-layout="vertical"
          @click="handleClickItem(item)"
        >
          <template #actions>
            <a-space>
              <div>
                <a-space size="mini">
                  <icon-eye />
                  <span style="font-size: 12px">
                    {{ item.viewNum }}
                  </span>
                </a-space>
              </div>
              <div>
                <a-space size="mini">
                  <icon-thumb-up />
                  <span style="font-size: 12px">
                    {{ item.thumbNum }}
                  </span>
                </a-space>
              </div>
              <div>
                <a-space size="mini">
                  <icon-star />
                  <span style="font-size: 12px">
                    {{ item.favourNum }}
                  </span>
                </a-space>
              </div>
            </a-space>
          </template>
          <template #extra>
            <span style="font-size: 12px">{{
              dayjs(item.createTime).format("YYYY-MM-DD HH:mm:ss")
            }}</span>
          </template>
          <a-list-item-meta :title="item.title">
            <template #description>
              <a-typography-text ellipsis>
                {{ item.content }}
              </a-typography-text>
            </template>
            <template #avatar>
              <a-popover>
                <template #content>
                  <a-space size="medium">
                    <a-avatar :image-url="item.userAvatar" />
                    <a-space direction="vertical">
                      <a-typography-title bold style="font-size: 17px">
                        {{ item.userName }}
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
                        {{ item.content }}
                      </a-typography-paragraph>
                    </a-space>
                  </a-space>
                </template>
                <a-avatar shape="square" :image-url="item.userAvatar" />
              </a-popover>
            </template>
          </a-list-item-meta>
        </a-list-item>
      </template>
    </a-list>
    <a-skeleton v-else animation>
      <a-space direction="vertical" :style="{ width: '100%' }" size="large">
        <a-skeleton-line
          :rows="5"
          :widths="['40%', '100%', '100%', '100%', '50%']"
        />
      </a-space>
    </a-skeleton>
  </a-card>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, defineProps } from "vue";
import { Message } from "@arco-design/web-vue";
import { IconEye, IconThumbUp, IconStar } from "@arco-design/web-vue/es/icon";
import { useRouter } from "vue-router";
import {
  PostControllerService,
  PostQueryRequest,
  PostVO,
} from "../../../../../generated";
import dayjs from "dayjs";

const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  zone: {
    type: String,
    default: "",
  },
  tag: {
    type: String,
    default: "",
  },
});
const searchParams = ref<PostQueryRequest>({
  title: "",
  zone: "",
  tags: [],
  current: 1,
  pageSize: 10,
});

const postVOList = ref<PostVO[]>([]);
const totalPage = ref();

watch(
  () => props.zone,
  () => {
    if (props.zone) {
      searchParams.value.current = 1;
      searchParams.value.zone = props.zone;
      postVOList.value = [];
      getPostList();
    }
  }
);

const getPostList = async () => {
  const res = await PostControllerService.listPostVoByPageUsingPost({
    ...searchParams.value,
  });
  if (res.code == 0) {
    totalPage.value = res.data.pages;
    postVOList.value.push(...res.data.records);
  } else {
    Message.error("获取帖子失败");
  }
};

onMounted(() => {
  getPostList();
});

const handleLoadPost = () => {
  searchParams.value.current = searchParams.value.current ?? 1;
  if (searchParams.value.current >= totalPage.value) {
    Message.warning("没有更多了");
  } else {
    searchParams.value.current++;
    getPostList();
  }
};

const router = useRouter();
const handleClickItem = (item: PostVO) => {
  router.push({
    path: "/post/detail",
    query: {
      postId: item.id,
    },
  });
};
</script>

<style scoped lang="less">
.content-list {
  background-color: #ffffff;
  border-radius: 10px;

  &-item {
    transition: background-color 0.5s;
  }

  &-item:hover {
    cursor: pointer;
    transition: background-color 0.3s;
    background-color: #f5f5f5;
    color: #333;
  }
}
</style>
