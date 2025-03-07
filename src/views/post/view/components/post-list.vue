<template>
  <a-row :gutter="10">
    <a-col :span="4">
      <a-affix :offsetTop="100">
        <!-- <tab-list @tab-value-change="getTabValue" /> -->
      </a-affix>
    </a-col>
    <a-col :flex="1">
      <BreadcrumbComponent :items="items" />
      <content-list :zone="tabValue" />
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import TabList from "@/views/post/view/components/tab-list.vue";
import ContentList from "@/views/post/view/components/content-list.vue";
import { ref } from "vue";
import BreadcrumbComponent from "@/components/breadcrumb/BreadcrumbComponent.vue";
import { BreadcrumbItem } from "@/components/breadcrumb/types";

const items = ref<BreadcrumbItem[]>([{ path: "/post", name: "帖子" }]);

const tabValue = ref("");
const getTabValue = (value: string) => {
  tabValue.value = value;
};
</script>

<style scoped lang="less"></style>
