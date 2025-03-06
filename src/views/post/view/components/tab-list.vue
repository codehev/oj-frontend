<template>
  <!--  帖子分区列表-->
  <a-list class="tab-list">
    <a-list-item
      v-for="(item, index) in items"
      :key="index"
      class="tab-list-item"
      @click="handleItemClick(item.value)"
    >
      <a-space size="medium">
        <component :is="item.icon" />
        {{ item.text }}
      </a-space>
    </a-list-item>
  </a-list>
</template>

<script setup lang="ts">
import {
  IconBook,
  IconCode,
  IconCodeSquare,
  IconFire,
  IconRecord,
} from "@arco-design/web-vue/es/icon";
import { ref, defineEmits, markRaw } from "vue";
//markRaw: 通过使用 markRaw，您可以告诉 Vue 不要将这些图标组件变为响应式对象，从而避免性能开销。
const items = ref([
  { value: "synthesis", icon: markRaw(IconBook), text: "综合" },
  { value: "frontend", icon: markRaw(IconCode), text: "前端" },
  { value: "backend", icon: markRaw(IconCodeSquare), text: "后端" },
  { value: "harmony", icon: markRaw(IconRecord), text: "Harmony OS" },
  { value: "aigc", icon: markRaw(IconFire), text: "AIGC" },
]);

const emits = defineEmits(["tab-value-change"]);

const handleItemClick = (value: string) => {
  emits("tab-value-change", value);
};
</script>

<style scoped lang="less">
.tab-list {
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
