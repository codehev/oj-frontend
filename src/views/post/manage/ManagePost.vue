<template>
  <div class="container-post">
    <!-- 面包屑 -->
    <BreadcrumbComponent :items="items" />
    <a-card>
      <post-table />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import PostTable from "@/views/post/manage/components/post-table.vue";
import BreadcrumbComponent from "@/components/breadcrumb/BreadcrumbComponent.vue";
import { BreadcrumbItem } from "@/components/breadcrumb/types";
import { ref } from "vue";
const items = ref<BreadcrumbItem[]>([
  { path: "/manage/post", name: "帖子管理" },
]);
</script>

<style scoped lang="less">
.container-post {
  padding: 0 20px 20px;
}
</style>
