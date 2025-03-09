<template>
  <div class="tab-content">
    <div v-if="question?.answer">
      <MdViewer :value="question.answer" />
    </div>
    <div v-else>暂无题解</div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { Question } from "../../../../../generated";
import MdViewer from "@/components/markdown/MdViewer.vue";

defineProps({
  question: {
    type: Object as () => Question | undefined,
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
