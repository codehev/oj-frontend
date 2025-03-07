<template>
  <!--  默认以文件名为组件名，使用ESLint时组件名只能多单词命名-->
  <div id="aboutView">
    <BreadcrumbComponent :items="items" />
  </div>
</template>

<script setup lang="ts">
import BreadcrumbComponent from "@/components/breadcrumb/BreadcrumbComponent.vue";
import { ref } from "vue";
import { BreadcrumbItem } from "@/components/breadcrumb/types";

const items = ref<BreadcrumbItem[]>([
  {
    path: "/about",
    name: "关于",
  },
]);
</script>

<style scoped>
#aboutView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
