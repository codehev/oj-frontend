<template>
  <div class="question-desc-container">
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
    <!-- <MdViewer
      :key="questionVO?.id"
      :value="questionVO?.content || ''"
      style="height: 100%; width: 100%"
    /> -->
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
  height: calc(100vh - 110px);
  padding: 5px 20px 20px 20px; /* 减小顶部内边距 */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  margin-top: 0; /* 确保容器顶部没有外边距 */
}

.md-content-wrapper {
  flex: 1;
  margin-top: 10px; /* 减小内容区域顶部的边距 */
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
  padding-bottom: 30px; /* 增加底部间距防止内容被遮挡 */
  border: 1px solid #e6e6e6;
  border-radius: 4px;
}

/* 确保内容区域底部有足够空间 */
.md-content-wrapper .md-editor-preview > div:last-child {
  margin-bottom: 20px;
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
