<template>
  <a-modal
    :visible="visible"
    @update:visible="updateVisible"
    :title="'提交详情'"
    :footer="false"
    fullscreen
    :mask-style="{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }"
    style="max-width: 100%; max-height: 100%"
  >
    <div
      class="submission-detail"
      style="height: 100%; display: flex; flex-direction: column"
    >
      <!-- 顶部操作栏 -->
      <div class="detail-header">
        <div class="left-section">
          <h2>提交详情 #{{ submission?.id }}</h2>
        </div>
        <div class="right-section">
          <a-button type="primary" @click="closeModal">
            <template #icon>
              <IconClose :size="18" />
            </template>
            关闭
          </a-button>
        </div>
      </div>

      <!-- 提交信息 -->
      <div class="detail-info">
        <div class="info-row">
          <div class="info-item">
            <span class="label">状态:</span>
            <span
              :class="{
                'success-status': submission?.judgeInfo?.message === '答案正确',
                'error-status': submission?.judgeInfo?.message !== '答案正确',
              }"
            >
              {{ submission?.judgeInfo?.message }}
            </span>
          </div>
          <div class="info-item">
            <span class="label">运行时间:</span>
            <span>{{ submission?.judgeInfo?.time || 0 }}ms</span>
          </div>
          <div class="info-item">
            <span class="label">内存消耗:</span>
            <span>{{ submission?.judgeInfo?.memory || 0 }}kb</span>
          </div>
          <div class="info-item">
            <span class="label">编程语言:</span>
            <span>{{ submission?.language }}</span>
          </div>
        </div>
      </div>

      <!-- 代码和分析结果分栏 -->
      <a-split
        :style="{ height: 'calc(100% - 160px)' }"
        :default-size="0.6"
        min="0.3"
        max="0.7"
      >
        <template #first>
          <div class="code-section">
            <div class="section-header">
              <h3>提交的代码</h3>
            </div>
            <div class="code-container">
              <CodeViewer
                :value="submission?.code || ''"
                :language="submission?.language || 'java'"
                :show-line-numbers="true"
                class="code-viewer"
              />
            </div>
          </div>
        </template>
        <template #second>
          <!-- 使用AI分析组件 -->
          <AiCodeAnalysis
            :submissionId="submission?.id?.toString()"
            :status="submission?.status || 0"
          />
        </template>
      </a-split>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from "vue";
import { QuestionSubmitVO } from "../../../../../generated";
import CodeViewer from "@/components/code/CodeViewer.vue";
import AiCodeAnalysis from "./AiCodeAnalysis.vue";
import { IconClose } from "@arco-design/web-vue/es/icon";

const props = defineProps({
  submissionData: {
    type: Object as () => QuestionSubmitVO | undefined,
    default: undefined,
  },
  visible: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:visible"]);

const submission = ref<QuestionSubmitVO | undefined>(undefined);

// 当提交数据或可见性改变时更新本地数据
watch(
  () => [props.submissionData, props.visible],
  ([newSubmission, newVisible]) => {
    if (newVisible && newSubmission) {
      submission.value = newSubmission as QuestionSubmitVO;
    }
  },
  { immediate: true }
);

// 更新可见性
const updateVisible = (val: boolean) => {
  emit("update:visible", val);
};

// 关闭弹窗
const closeModal = () => {
  emit("update:visible", false);
};
</script>

<style scoped>
.submission-detail {
  padding: 20px;
  box-sizing: border-box;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border-2);
}

.left-section h2 {
  margin: 0;
  font-size: 20px;
  color: var(--color-text-1);
}

.detail-info {
  margin-bottom: 24px;
  padding: 16px;
  background-color: var(--color-fill-2);
  border-radius: 4px;
}

.info-row {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.info-item {
  display: flex;
  align-items: center;
}

.label {
  font-weight: 500;
  margin-right: 8px;
  color: var(--color-text-2);
}

.success-status {
  color: rgb(var(--success-6));
  font-weight: 500;
}

.error-status {
  color: rgb(var(--danger-6));
  font-weight: 500;
}

.code-section {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 16px;
  box-sizing: border-box;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h3 {
  margin: 0;
  font-size: 16px;
  color: var(--color-text-1);
}

.code-container {
  flex: 1;
  overflow: auto;
  border-radius: 4px;
  border: 1px solid var(--color-border-2);
}

.code-viewer {
  height: 100%;
  width: 100%;
}
</style>
