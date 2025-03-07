<template>
  <a-breadcrumb class="container-breadcrumb">
    <a-breadcrumb-item>
      <icon-apps />
    </a-breadcrumb-item>
    <a-breadcrumb-item v-for="item in items" :key="item.path">
      <a-link :href="getFullPath(item)" :disabled="item.disabled ?? false">
        {{ item.name }}
      </a-link>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script lang="ts" setup>
import { PropType, defineProps } from "vue";
import { IconApps } from "@arco-design/web-vue/es/icon";
import { BreadcrumbItem } from "./types";

defineProps({
  items: {
    type: Array as PropType<BreadcrumbItem[]>,
    default() {
      return [];
    },
  },
});

// 获取完整路径
const getFullPath = (item: BreadcrumbItem): string => {
  if (!item.query) return item.path;

  const queryString = Object.entries(item.query)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    )
    .join("&");

  return `${item.path}${queryString ? `?${queryString}` : ""}`;
};
</script>

<style scoped lang="less">
.container-breadcrumb {
  margin: 16px 0;

  :deep(.arco-breadcrumb-item) {
    color: rgb(var(--gray-6));

    &:last-child {
      color: rgb(var(--gray-8));
    }
  }
}
</style>
