<template>
  <a-row :gutter="10">
    <a-col :span="4">
      <a-affix :offsetTop="100">
        <div class="tab-list-wrapper">
          <tab-list @tab-value-change="getTabValue" />
        </div>
      </a-affix>
    </a-col>
    <a-col :flex="1">
      <!-- 面包屑、搜索框和发布按钮放在同一行 -->
      <a-row class="header-row" align="center">
        <a-col :span="6">
          <BreadcrumbComponent :items="items" />
        </a-col>
        <a-col :span="12" style="text-align: center">
          <a-input-search
            v-model="searchKeyword"
            placeholder="搜索帖子标题或内容"
            search-button
            style="width: 80%"
            @keyup.enter="enterSearch"
            @search="handleSearch"
          >
            <template #prefix>
              <icon-search />
            </template>
          </a-input-search>
        </a-col>
        <a-col :span="6" style="text-align: right">
          <a-button type="primary" @click="handlePublishPost">
            <template #icon>
              <icon-edit />
            </template>
            发布帖子
          </a-button>
        </a-col>
      </a-row>

      <content-list ref="contentListRef" :zoneId="tabValue" />
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import TabList from "@/views/post/view/components/tab-list.vue";
import ContentList from "@/views/post/view/components/content-list.vue";
import { ref } from "vue";
import BreadcrumbComponent from "@/components/breadcrumb/BreadcrumbComponent.vue";
import { BreadcrumbItem } from "@/components/breadcrumb/types";
import { useRouter } from "vue-router";
import { IconSearch, IconEdit } from "@arco-design/web-vue/es/icon";

const router = useRouter();
const items = ref<BreadcrumbItem[]>([{ path: "/post", name: "帖子" }]);
const contentListRef = ref();
const searchKeyword = ref("");

const tabValue = ref<string | undefined>("");
const getTabValue = (value: string | null) => {
  tabValue.value = value || undefined;
};

// 搜索帖子
const enterSearch = () => {
  if (contentListRef.value) {
    contentListRef.value.searchByKeyword(searchKeyword);
  }
};
const handleSearch = (keyword: string) => {
  if (contentListRef.value) {
    contentListRef.value.searchByKeyword(keyword);
  }
};

// 发布帖子
const handlePublishPost = () => {
  router.push("/add/post");
};
</script>

<style scoped lang="less">
.tab-list-wrapper {
  width: 100%;
}

.header-row {
  margin-bottom: 16px;
}
</style>
