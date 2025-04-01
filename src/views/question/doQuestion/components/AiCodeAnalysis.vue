<template>
  <div class="ai-analysis">
    <div class="section-header">
      <h3>AI 分析结果</h3>
      <a-button
        v-if="submissionId"
        type="primary"
        size="small"
        @click="requestAnalysis"
        :loading="loading"
      >
        <template #icon>
          <IconRobot :size="16" :style="{ color: '#fff' }" />
        </template>
        {{ loading ? "分析中..." : "获取分析" }}
      </a-button>
    </div>

    <a-spin :loading="loading">
      <div
        v-if="analysisResult"
        class="analysis-content"
        style="overflow-y: auto; height: 100%"
      >
        <MdViewer :value="analysisResult" />
      </div>
      <div v-else class="empty-analysis">
        <IconRefresh :size="32" />
        <p>点击"获取分析"按钮获取代码分析</p>
      </div>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from "vue";
import { AiControllerService } from "../../../../../generated";
import message from "@arco-design/web-vue/es/message";
import MdViewer from "@/components/markdown/MdViewer.vue";
import { IconRobot, IconRefresh } from "@arco-design/web-vue/es/icon";

const props = defineProps({
  submissionId: {
    type: [String],
    default: "",
  },
  status: {
    type: Number,
    default: 0,
  },
});

const analysisResult = ref("");
const loading = ref(false);

/**
 * 请求AI分析
 */
const requestAnalysis = async () => {
  if (!props.submissionId) {
    message.warning("没有可分析的提交");
    return;
  }

  loading.value = true;
  analysisResult.value = "";

  try {
    // 调用AI分析接口
    const res = await AiControllerService.analysisCodeByAiUsingGet(
      props.submissionId as any
    );

    if (res.code === 0) {
      analysisResult.value = res.data || "AI没有返回分析结果，请稍后再试。";
    } else {
      message.error("AI分析失败：" + res.message);
    }
  } catch (error: any) {
    message.error("AI分析请求失败：" + (error.message || "未知错误"));
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.ai-analysis {
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

.analysis-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: var(--color-fill-2);
  border-radius: 4px;
}

.empty-analysis {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--color-text-3);
  background: var(--color-fill-2);
  border-radius: 4px;
}

.empty-analysis p {
  margin-top: 12px;
}
</style>
