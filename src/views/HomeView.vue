<template>
  <div id="homeView">
    <BreadcrumbComponent :items="items" />
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
]);
</script>

<style scoped>
#homeView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
