<template>
  <!--  默认以文件名为组件名，使用ESLint时组件名只能多单词命名-->
  <div id="noAuthView">
    <BreadcrumbComponent :items="items" />
    <template>
      <a-result status="403" subtitle="无权限访问">
        <template #extra>
          <a-space>
            <a-button type="primary" @click="router.back()">返回</a-button>
          </a-space>
        </template>
      </a-result>
    </template>
  </div>
</template>
<script setup lang="ts">
import BreadcrumbComponent from "@/components/breadcrumb/BreadcrumbComponent.vue";
import { ref } from "vue";
import { BreadcrumbItem } from "@/components/breadcrumb/types";
import router from "@/router";

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
