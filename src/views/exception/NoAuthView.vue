<template>
  <!--  默认以文件名为组件名，使用ESLint时组件名只能多单词命名-->
  <div id="noAuthView">
    <BreadcrumbComponent :items="items" />
    <span>没有权限</span>
  </div>
</template>
<script setup lang="ts">
import BreadcrumbComponent from "@/components/breadcrumb/BreadcrumbComponent.vue";
import { ref } from "vue";
import { BreadcrumbItem } from "@/components/breadcrumb/types";

const items = ref<BreadcrumbItem[]>([
  {
    path: "/",
    name: "首页",
  },
  {
    path: "/noAuth",
    name: "无权限",
  },
]);
</script>
<style scoped>
#noAuthView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
