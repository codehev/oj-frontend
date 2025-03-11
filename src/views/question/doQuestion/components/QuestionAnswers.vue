<template>
  <div class="tab-content">
    <div v-if="question?.answer">
      <!-- <MdViewer :value="question.answer" /> -->
      <MdPreview :modelValue="question.answer" />
    </div>
    <div v-else>
      <a-result status="404" subtitle="暂无题解"> </a-result>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { Question } from "../../../../../generated";
import { MdPreview } from "md-editor-v3";

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
