<template>
  <!--  帖子分区列表-->
  <a-list class="tab-list">
    <a-list-item class="tab-list-item" @click="handleItemClick(null)">
      <a-space size="medium">
        <component :is="getIconForZone('综合')" />
        <span>综合</span>
      </a-space>
    </a-list-item>
    <a-list-item
      v-for="(item, index) in zoneItems"
      :key="index"
      class="tab-list-item"
      @click="handleItemClick(item.id)"
    >
      <a-space size="medium">
        <component :is="getIconForZone(item.zoneName)" />
        {{ item.zoneName }}
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
  IconPlus,
} from "@arco-design/web-vue/es/icon";
import { ref, defineEmits, markRaw, onMounted } from "vue";
import { Message } from "@arco-design/web-vue";
import { PostZoneControllerService } from "../../../../../generated";

// 定义默认图标映射
const iconMap: Record<string, any> = {
  综合: markRaw(IconBook),
  前端: markRaw(IconCode),
  后端: markRaw(IconCodeSquare),
  游戏: markRaw(IconRecord),
  AI: markRaw(IconFire),
  default: markRaw(IconPlus),
};

// 为分区获取对应图标
const getIconForZone = (value: string) => {
  // 尝试通过ID或名称获取图标，如果没有则使用默认图标
  return iconMap[value] || iconMap.default;
};

const zoneItems = ref<{ zoneName: string; id: string }[]>([]);

// 加载分区列表
const loadZoneList = async () => {
  try {
    const res = await PostZoneControllerService.listPostZoneUsingGet();
    if (res.code === 0 && res.data) {
      // 转换为列表所需的格式
      zoneItems.value = res.data.map((zone) => ({
        zoneName: zone.zoneName || "",
        id: zone.id?.toString() || "",
      }));
    } else {
      Message.error("获取分区列表失败，" + res.message);
    }
  } catch (error) {
    Message.error("获取分区列表失败");
  }
};

const emits = defineEmits(["tab-value-change"]);

const handleItemClick = (value: string | null) => {
  emits("tab-value-change", value);
};

onMounted(() => {
  loadZoneList();
});
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
