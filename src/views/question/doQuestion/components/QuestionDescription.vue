<template>
  <div class="tab-content" style="flex: 1; overflow-y: auto">
    <a-space wrap>
      <a-tag v-for="(tag, index) in questionVO?.tags" :key="index" color="green"
        >{{ tag }}
      </a-tag>
    </a-space>
    <!--描述，不同窗口大小，动态调整列数-->
    <a-descriptions title="判题条件：" :column="{ xs: 1, md: 2, lg: 3 }">
      <a-descriptions-item label="时间限制">
        {{ questionVO?.judgeConfig?.timeLimit ?? 0 }}ms
      </a-descriptions-item>
      <a-descriptions-item label="内存限制">
        {{ questionVO?.judgeConfig?.memoryLimit ?? 0 }}kb
      </a-descriptions-item>
      <a-descriptions-item label="堆栈限制">
        {{ questionVO?.judgeConfig?.stackLimit ?? 0 }}kb
      </a-descriptions-item>
    </a-descriptions>
    <MdViewer
      :key="questionVO?.id"
      :value="questionVO?.content || ''"
      style="height: 100%; width: 100%"
    />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { QuestionVO } from "../../../../../generated";
import MdViewer from "@/components/markdown/MdViewer.vue";

defineProps({
  questionVO: {
    type: Object as () => QuestionVO | undefined,
    required: true,
  },
});
</script>

<style scoped>
.tab-content {
  height: calc(100% - 48px);
  padding: 20px;
  overflow-y: auto;
  box-sizing: border-box;
}
</style>
