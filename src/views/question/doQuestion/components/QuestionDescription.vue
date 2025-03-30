<template>
  <div class="question-desc-container">
    <div class="header-info">
      <div class="tags-container">
        <a-tag
          v-for="(tag, index) in questionVO?.tags"
          :key="index"
          color="green"
          size="small"
          >{{ tag }}</a-tag
        >
      </div>
      <div class="judge-conditions">
        <span class="condition-label">判题条件：</span>
        <span class="condition-item"
          >时间限制: {{ questionVO?.judgeConfig?.timeLimit ?? 0 }}ms</span
        >
        <span class="condition-item"
          >内存限制: {{ questionVO?.judgeConfig?.memoryLimit ?? 0 }}kb</span
        >
        <span class="condition-item"
          >堆栈限制: {{ questionVO?.judgeConfig?.stackLimit ?? 0 }}kb</span
        >
      </div>
    </div>
    <div class="md-content-wrapper">
      <MdPreview
        v-if="questionVO?.content !== ''"
        :modelValue="questionVO?.content"
      />
      <a-result v-else status="404" subtitle="暂无题目描述"> </a-result>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps } from "vue";
import { QuestionVO } from "../../../../../generated";
import { MdPreview } from "md-editor-v3";

defineProps({
  questionVO: {
    type: Object as () => QuestionVO | undefined,
    required: true,
  },
});
</script>

<style>
/* 使用全局样式确保可以影响到md-editor-v3内部组件 */
/* 注意：移除scoped属性，以便样式可以渗透到组件内部 */
.question-desc-container {
  height: calc(100vh - 190px); /* 减小高度留出操作栏空间 */
  padding: 5px 20px 0 20px; /* 移除底部内边距 */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin-top: 0; /* 确保容器顶部没有外边距 */
}

.header-info {
  border-bottom: 1px solid #e6e6eb;
  padding-bottom: 6px;
  margin-bottom: 6px;
}

.tags-container {
  margin-bottom: 4px;
}

.judge-conditions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #666;
  background-color: #f9f9f9;
  padding: 4px 8px;
  border-radius: 4px;
}

.condition-label {
  font-weight: bold;
}

.condition-item {
  white-space: nowrap;
}

.md-content-wrapper {
  flex: 1;
  margin-top: 4px; /* 减小内容区域顶部的边距 */
  overflow: auto;
  position: relative;
  height: 100%;
}

/* 确保MdPreview内部滚动容器具有正确的高度 */
.md-content-wrapper .md-editor-preview-wrapper {
  height: 100% !important;
  overflow-y: auto !important;
}

/* 调整Markdown内容区域样式 */
.md-content-wrapper .md-editor-preview {
  height: 100%;
  overflow: auto !important;
  padding: 10px;
  padding-bottom: 10px; /* 减小底部间距 */
  border: 1px solid #e6e6e6;
  border-radius: 4px;
}

/* 确保内容区域底部有足够空间 */
.md-content-wrapper .md-editor-preview > div:last-child {
  margin-bottom: 10px; /* 减小底部边距 */
}

/* 自定义滚动条样式 */
.md-content-wrapper::-webkit-scrollbar,
.md-editor-preview::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.md-content-wrapper::-webkit-scrollbar-thumb,
.md-editor-preview::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 4px;
}

.md-content-wrapper::-webkit-scrollbar-thumb:hover,
.md-editor-preview::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}

.md-content-wrapper::-webkit-scrollbar-track,
.md-editor-preview::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}
</style>
