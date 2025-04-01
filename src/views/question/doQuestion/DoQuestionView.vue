<template>
  <!-- 查看题目页面 -->
  <div id="doQuestionView">
    <a-split
      :default-size="0.5"
      :min="0.01"
      :max="0.99"
      :style="{
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
      }"
    >
      <template #first>
        <div class="leftDiv">
          <a-tabs
            default-active-key="1"
            v-model:active-key="activeKey"
            @change="onTabChange"
          >
            <a-tab-pane key="1">
              <template #title>
                <IconBookmark :size="16" :style="{ color: '#007bff' }" />
                题目描述
              </template>
              <!-- 使用题目描述组件 -->
              <QuestionDescription :questionVO="questionVO" />

              <!-- 将点赞收藏操作栏放在题目描述标签页内 -->
              <QuestionActions
                v-if="questionVO"
                :questionInfo="questionVO"
                :commentNum="commentNum"
                @switch-tab="handleSwitchTab"
              />
            </a-tab-pane>
            <a-tab-pane key="2">
              <template #title>
                <IconExperiment :size="16" :style="{ color: '#007bff' }" />
                题解
              </template>
              <!-- 使用题解组件 -->
              <QuestionAnswers :question="question" />
            </a-tab-pane>
            <a-tab-pane key="3">
              <template #title>
                <IconHistory :size="16" :style="{ color: '#007bff' }" />
                提交记录
              </template>
              <!-- 使用提交记录组件 -->
              <SubmissionHistory
                :questionId="questionVO?.id?.toString()"
                @showDetail="handleShowSubmissionDetail"
              />
            </a-tab-pane>
            <a-tab-pane key="4">
              <template #title>
                <IconMessage :size="16" :style="{ color: '#007bff' }" />
                评论
              </template>
              <QuestionComment :questionId="questionVO?.id?.toString()" />
            </a-tab-pane>
          </a-tabs>
        </div>
      </template>
      <template #second>
        <div class="rightDiv">
          <a-tabs>
            <template #extra>
              <a-space style="margin-right: 10px">
                <a-select
                  size="small"
                  v-model="form.language"
                  :style="{ width: '80px' }"
                  placeholder="请选择编程语言..."
                >
                  <a-option v-for="(language, key) in LanguageEnum" :key="key"
                    >{{ language }}
                  </a-option>
                </a-select>
                <a-button
                  type="primary"
                  size="small"
                  style="min-width: 60px"
                  @click="onSubmit"
                >
                  <template #icon>
                    <IconUpload :size="16" :style="{ color: '#fff' }" />
                  </template>
                  <template #default>提交代码</template>
                </a-button>
              </a-space>
            </template>
            <a-tab-pane key="1">
              <template #title>
                <IconCode :size="16" :style="{ color: '#02b128' }" />
                代码
              </template>
              <CodeEditor
                :style="{
                  height: 'calc(85vh - 32px)',
                  width: '100%',
                  margin: '16px',
                }"
                :value="form.code || ''"
                :language="form.language || 'java'"
                :handle-change="onCodeChange"
              />
            </a-tab-pane>
          </a-tabs>
        </div>
      </template>
    </a-split>

    <!-- 使用提交详情组件 -->
    <SubmissionDetail
      v-model:visible="detailModalVisible"
      :submissionData="currentSubmission"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, withDefaults, defineProps } from "vue";
import {
  QuestionControllerService,
  QuestionSubmitAddRequest,
  QuestionSubmitVO,
  QuestionVO,
  Question,
  QuestionCommentControllerService,
} from "../../../../generated";
import message from "@arco-design/web-vue/es/message";
import CodeEditor from "@/components/code/CodeEditor.vue";
import LanguageEnum from "@/enum/LanguageEnum";
import { DefaultCodeEnum } from "@/enum/DefaultCodeEnum";
import { useRoute } from "vue-router";
// 导入Arco Design图标
import {
  IconBookmark,
  IconExperiment,
  IconHistory,
  IconMessage,
  IconUpload,
  IconCode,
} from "@arco-design/web-vue/es/icon";

// 导入自定义组件
import QuestionDescription from "./components/QuestionDescription.vue";
import QuestionAnswers from "./components/QuestionAnswers.vue";
import SubmissionHistory from "./components/SubmissionHistory.vue";
import SubmissionDetail from "./components/SubmissionDetail.vue";
import QuestionComment from "@/views/question/doQuestion/components/question-comment.vue";
import QuestionActions from "@/views/question/doQuestion/components/question-actions.vue";

const route = useRoute();

interface Props {
  id: string;
}

// 获取路由参数，questionId
const props = withDefaults(defineProps<Props>(), { id: () => "" });
var activeKey = ref<string>("1");
var questionVO = ref<QuestionVO>();
var question = ref<Question>();
// 添加评论数量变量
var commentNum = ref<number>(0);

const detailModalVisible = ref(false);
const currentSubmission = ref<QuestionSubmitVO>();

/**
 * 加载题目信息
 */
const loadQuestion = async () => {
  // 从路由中获取题目ID
  const questionId = props.id || route.params.id;
  if (!questionId) {
    console.error("无法获取题目ID");
    return;
  }

  console.log("开始加载题目信息，ID:", questionId);

  try {
    const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
      questionId as any
    );
    console.log("题目信息API返回:", res);

    if (res.code === 0) {
      if (res.data) {
        questionVO.value = res.data;
        console.log("题目信息加载成功:", questionVO.value);
        // 初始化代码
        switch (form.value.language) {
          case LanguageEnum.JAVA:
            form.value.code = DefaultCodeEnum.java;
            break;
          case LanguageEnum.CPP:
            form.value.code = DefaultCodeEnum.cpp;
            break;
          // GOLANG和PYTHON可能不在枚举中，需要移除或修复
          default:
            form.value.code = DefaultCodeEnum.java;
        }
        // 加载评论数
        loadCommentCount();
      } else {
        message.error("题目不存在");
        console.error("题目不存在");
      }
    } else {
      message.error("加载失败，" + res.message);
      console.error("加载题目失败:", res.message);
    }
  } catch (e: any) {
    message.error("加载失败，" + e.message);
    console.error("加载题目异常:", e);
  }
};

/**
 * 加载评论数量
 */
const loadCommentCount = async () => {
  const questionId = props.id || route.params.id;
  if (!questionId) {
    return;
  }

  try {
    const res = await QuestionCommentControllerService.getNumUsingGet1(
      questionId as any
    );
    if (res.code === 0) {
      commentNum.value = res.data as number;
    } else {
      console.error("获取评论数失败:", res.message);
    }
  } catch (error) {
    console.error("获取评论数失败:", error);
  }
};

/**
 * 加载题目答案
 */
const loadQuestionAnswer = async () => {
  // 从路由中获取题目ID
  const questionId = props.id || route.params.id;
  if (!questionId) {
    return;
  }

  try {
    const res = await QuestionControllerService.getQuestionByIdUsingGet(
      questionId as any
    );
    if (res.code === 0) {
      if (res.data) {
        question.value = res.data;
      } else {
        message.error("题解不存在");
      }
    } else {
      message.error("加载失败，" + res.message);
    }
  } catch (e: any) {
    message.error("加载失败，" + e.message);
  }
};

/**
 * 显示提交详情
 */
const handleShowSubmissionDetail = (submission: QuestionSubmitVO) => {
  currentSubmission.value = submission;
  detailModalVisible.value = true;
};

onMounted(() => {
  loadQuestion(); // 初始加载题目信息
  // 其他加载操作已经移至子组件中
});

// 监听路由参数变化
watch(
  () => props.id,
  (newId) => {
    if (newId) {
      activeKey.value = "1";
      loadQuestion(); // 重新加载题目信息
    }
  }
);

const onTabChange = (key: string | number) => {
  console.log("切换标签页:", key);
  if (key === "1") {
    loadQuestion();
  } else if (key === "2") {
    loadQuestionAnswer();
  } else if (key === "3") {
    activeKey.value = "3";
  }
};

const form = ref<QuestionSubmitAddRequest>({
  language: LanguageEnum.JAVA,
  code: DefaultCodeEnum.java,
});

// 父组件向子组件传递一个函数
const onCodeChange = (v: string) => {
  form.value.code = v;
};

/**
 * 提交代码
 */
const onSubmit = async () => {
  if (!questionVO.value?.id) {
    return;
  }
  const res = await QuestionControllerService.doQuestionSubmitUsingPost({
    ...form.value,
    questionId: questionVO.value?.id,
  });
  if (res.code === 0) {
    message.success("提交成功");
    // 切换到提交记录标签页
    activeKey.value = "3";
    // 此处不再需要额外调用onTabChange，因为v-model:active-key会自动触发tab切换
  } else {
    message.error("提交失败：" + res.message);
  }
};

/**
 * 处理子组件触发的标签页切换事件
 */
const handleSwitchTab = (key: string) => {
  activeKey.value = key;
};
</script>

<style scoped>
/* 页面整体样式 */
#doQuestionView {
  height: 100%;
  width: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

/* 左侧和右侧容器样式 */
.leftDiv,
.rightDiv {
  height: 100%;
  width: 100%;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  box-sizing: border-box;
}

/* 自定义滚动条样式 */
.leftDiv::-webkit-scrollbar,
.rightDiv::-webkit-scrollbar {
  width: 8px; /* 滚动条宽度 */
}

.leftDiv::-webkit-scrollbar-thumb,
.rightDiv::-webkit-scrollbar-thumb {
  background-color: #888; /* 滚动条滑块颜色 */
  border-radius: 4px; /* 滚动条滑块圆角 */
}

.leftDiv::-webkit-scrollbar-thumb:hover,
.rightDiv::-webkit-scrollbar-thumb:hover {
  background-color: #555; /* 滚动条滑块悬停颜色 */
}

.leftDiv::-webkit-scrollbar-track,
.rightDiv::-webkit-scrollbar-track {
  background: #f1f1f1; /* 滚动条轨道颜色 */
  border-radius: 4px; /* 滚动条轨道圆角 */
}

/* Tabs 样式优化 */
:deep(.arco-tabs) {
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

:deep(.arco-tabs-nav) {
  padding: 0 16px;
  background-color: #fff;
  border-bottom: 1px solid var(--color-neutral-3);
}

:deep(.arco-tabs-content) {
  flex: 1;
  overflow: hidden;
}

/* 标签页内容区域 */
.tab-content {
  height: calc(100% - 48px);
  padding: 20px;
  overflow-y: auto;
  box-sizing: border-box;
}

/* 表格样式优化 */
:deep(.arco-table) {
  border-radius: 4px;
  border: 1px solid var(--color-neutral-3);
}

:deep(.arco-table-th) {
  background-color: var(--color-fill-2) !important;
}

:deep(.arco-table-tr:hover) {
  background-color: var(--color-fill-2);
  cursor: pointer;
}

/* 按钮样式优化 */
:deep(.arco-btn-primary) {
  font-weight: 500;
}

/* 代码编辑器区域 */
:deep(.monaco-editor) {
  border-radius: 4px;
  border: 1px solid var(--color-neutral-3);
}

/* AI 分析区域 */
.ai-analysis {
  padding: 20px;
  height: 100%;
  overflow-y: auto;
  border-left: 1px solid var(--color-neutral-3);
}

/* 提交详情样式 */
.submission-detail {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.submission-info {
  margin-bottom: 24px;
  padding: 16px;
  background-color: var(--color-fill-2);
  border-radius: 4px;
}

.status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 500;
}

.info-items {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  color: var(--color-text-2);
}
</style>
