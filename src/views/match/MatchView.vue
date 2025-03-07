<template>
  <div id="matchView">
    <BreadcrumbComponent :items="items" />
  </div>
</template>

<script setup lang="ts">
import BreadcrumbComponent from "@/components/breadcrumb/BreadcrumbComponent.vue";
import { ref } from "vue";
import { BreadcrumbItem } from "@/components/breadcrumb/types";

const items = ref<BreadcrumbItem[]>([
  {
    path: "/match",
    name: "比赛",
  },
]);
</script>

<style scoped>
#matchView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
