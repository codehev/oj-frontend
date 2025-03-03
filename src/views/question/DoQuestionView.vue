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
                <IconPark
                  type="transaction-order"
                  theme="filled"
                  size="16"
                  fill="#007bff"
                />
                题目描述
              </template>
              <div class="tab-content" style="flex: 1; overflow-y: auto">
                <a-space wrap>
                  <a-tag
                    v-for="(tag, index) in questionVO?.tags"
                    :key="index"
                    color="green"
                    >{{ tag }}
                  </a-tag>
                </a-space>
                <!--描述，不同窗口大小，动态调整列数-->
                <a-descriptions
                  title="判题条件："
                  :column="{ xs: 1, md: 2, lg: 3 }"
                >
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
                  :value="questionVO?.content || ''"
                  style="height: 100%; width: 100%"
                />
              </div>
            </a-tab-pane>
            <a-tab-pane key="2">
              <template #title>
                <IconPark
                  type="cuvette"
                  theme="filled"
                  size="16"
                  fill="#007bff"
                />
                题解
              </template>
              <div class="tab-content">
                <div v-if="question?.answer">
                  <MdViewer :value="question.answer" />
                </div>
                <div v-else>暂无题解</div>
              </div>
            </a-tab-pane>
            <a-tab-pane key="3" title="提交记录">
              <template #title>
                <IconPark
                  type="history"
                  theme="filled"
                  size="16"
                  fill="#007bff"
                />
                提交记录
              </template>
              <div class="tab-content">
                <div
                  style="
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 16px;
                  "
                >
                  <div class="filter-section">
                    <a-select
                      v-model="searchParams.language"
                      placeholder="选择编程语言"
                      allow-clear
                      size="small"
                      style="width: 120px; margin-right: 16px"
                      @change="handleLanguageChange"
                    >
                      <a-option
                        v-for="(language, key) in LanguageEnum"
                        :key="key"
                      >
                        {{ language }}
                      </a-option>
                    </a-select>
                  </div>
                  <a-button
                    type="primary"
                    @click="refreshSubmissions"
                    :loading="loading"
                    size="small"
                  >
                    刷新提交记录
                  </a-button>
                </div>
                <div v-if="submissions.length === 0">暂无提交记录</div>
                <a-table
                  v-else
                  :data="submissions"
                  :columns="columns"
                  :pagination="{
                    total: Number(total),
                    current: current,
                    pageSize: pageSize,
                    showTotal: true,
                    showJumper: true,
                    showPageSize: true,
                    pageSizeOptions: [5, 10, 20],
                    baseSize: 5,
                  }"
                  @row-click="handleRowClick"
                  @page-change="onPageChange"
                  @page-size-change="onPageSizeChange"
                >
                  <!-- 状态列 -->
                  <template #status="{ record }">
                    {{ STATUS_ENUM[record.status] }}
                  </template>
                  <!-- 结果列 -->
                  <template #judgeMessage="{ record }">
                    {{ record.judgeInfo?.message }}
                  </template>
                  <!-- 时间列 -->
                  <template #judgeTime="{ record }">
                    {{ record.judgeInfo?.time }}ms
                  </template>
                  <!-- 内存列 -->
                  <template #judgeMemory="{ record }">
                    {{ record.judgeInfo?.memory }}kb
                  </template>
                  <!-- 提交时间列 -->
                  <template #createTime="{ record }">
                    {{ formatTime(record.createTime) }}
                  </template>
                </a-table>

                <!-- 提交详情弹窗 -->
                <a-modal
                  v-model:visible="detailModalVisible"
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
                        <h2>提交详情 #{{ currentSubmission?.id }}</h2>
                      </div>
                      <div class="right-section">
                        <a-button
                          type="primary"
                          @click="detailModalVisible = false"
                        >
                          <template #icon>
                            <icon-park type="close" theme="outline" size="18" />
                          </template>
                          关闭
                        </a-button>
                      </div>
                    </div>

                    <!-- 提交信息 -->
                    <div class="submission-info">
                      <div
                        :class="[
                          'status',
                          currentSubmission?.judgeInfo?.message === '答案正确'
                            ? 'success'
                            : 'error',
                        ]"
                      >
                        <IconPark
                          v-if="
                            currentSubmission?.judgeInfo?.message === '答案正确'
                          "
                          type="check-one"
                          theme="filled"
                          size="24"
                          :fill="'#19be6b'"
                        />
                        <IconPark
                          v-else
                          type="close-one"
                          theme="filled"
                          size="24"
                          :fill="'#ed3f14'"
                        />
                        {{
                          currentSubmission?.status != 2
                            ? STATUS_ENUM[currentSubmission?.status ?? 0]
                            : currentSubmission?.judgeInfo?.message
                        }}
                      </div>
                      <div class="info-items">
                        <span
                          >时间：{{
                            currentSubmission?.judgeInfo?.time
                          }}ms</span
                        >
                        <span
                          >内存：{{
                            currentSubmission?.judgeInfo?.memory
                          }}kb</span
                        >
                        <span>语言：{{ currentSubmission?.language }}</span>
                      </div>
                    </div>

                    <!-- 代码和分析结果分栏 -->
                    <a-split
                      :style="{ height: 'calc(100% - 0px)' }"
                      :default-size="0.6"
                      min="0.3"
                      max="0.7"
                    >
                      <template #first>
                        <div class="code-section">
                          <div class="section-header">
                            <h3>提交的代码</h3>
                            <a-button
                              type="primary"
                              size="small"
                              @click="
                                showAIAnalysis(
                                  currentSubmission as QuestionSubmitVO
                                )
                              "
                            >
                              <template #icon>
                                <icon-park
                                  type="brain"
                                  theme="filled"
                                  size="16"
                                  fill="#fff"
                                />
                              </template>
                              AI 分析
                            </a-button>
                          </div>
                          <div style="overflow-y: auto; height: 100%">
                            <CodeViewer
                              :value="currentSubmission?.code"
                              :language="currentSubmission?.language"
                              style="width: 100%; height: 100%"
                            ></CodeViewer>
                          </div>
                        </div>
                      </template>
                      <template #second>
                        <div class="ai-analysis">
                          <h3>AI 分析结果</h3>
                          <a-spin :loading="aiAnalysisLoading">
                            <div
                              v-if="aiAnalysisResult"
                              class="analysis-content"
                              style="overflow-y: auto; height: 100%"
                            >
                              <MdViewer :value="aiAnalysisResult" />
                            </div>
                            <div v-else class="empty-analysis">
                              <icon-park
                                type="click"
                                theme="outline"
                                size="32"
                              />
                              <p>点击"AI 分析"按钮获取代码分析</p>
                            </div>
                          </a-spin>
                        </div>
                      </template>
                    </a-split>
                  </div>
                </a-modal>
              </div>
            </a-tab-pane>
            <a-tab-pane key="4" title="评论">
              <template #title>
                <IconPark
                  type="comment"
                  theme="filled"
                  size="16"
                  fill="#007bff"
                />
                评论
              </template>
              暂无评论
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
                    <IconPark
                      type="upload-one"
                      theme="filled"
                      size="24"
                      fill="#fff"
                    />
                  </template>
                  <template #default>提交代码</template>
                </a-button>
              </a-space>
            </template>
            <a-tab-pane key="1">
              <template #title>
                <IconPark type="code" theme="filled" size="16" fill="#02b128" />
                代码
              </template>
              <CodeEditor
                :style="{
                  height: 'calc(85vh - 32px)',
                  width: '100%',
                  margin: '16px',
                }"
                :value="form.code"
                :language="form.language"
                :handle-change="onCodeChange"
              />
            </a-tab-pane>
          </a-tabs>
        </div>
      </template>
    </a-split>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, withDefaults, defineProps } from "vue";
import {
  QuestionControllerService,
  QuestionSubmitAddRequest,
  QuestionSubmitVO,
  QuestionVO,
  Question,
  AiControllerService,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import CodeEditor from "@/components/CodeEditor.vue";
import CodeViewer from "@/components/CodeViewer.vue";
import MdViewer from "@/components/MdViewer.vue";
import LanguageEnum from "@/enum/LanguageEnum";
import STATUS_ENUM from "@/enum/StatusEnum";
import { DefaultCodeEnum } from "@/enum/DefaultCodeEnum";
import { IconPark } from "@icon-park/vue-next/es/all";
import { useStore } from "vuex";
import ACCESS_ENUM from "@/enum/AccessEnum";

const store = useStore();

interface Props {
  id: string;
}
// 获取路由参数，questionId
const props = withDefaults(defineProps<Props>(), { id: () => "" });
var activeKey = ref<string>("1");
var questionVO = ref<QuestionVO>();
var question = ref<Question>();
var submissions = ref<QuestionSubmitVO[]>([]); // 用于存储提交记录
var loading = ref<boolean>(false); // 添加加载状态

const aiModalVisible = ref(false);
const aiModalTitle = ref("");
const aiAnalysisResult = ref("");
const aiAnalysisLoading = ref(false);

const columns = [
  {
    title: "状态",
    slotName: "status",
  },
  {
    title: "结果",
    slotName: "judgeMessage",
  },
  {
    title: "时间",
    slotName: "judgeTime",
  },
  {
    title: "内存",
    slotName: "judgeMemory",
  },
  {
    title: "语言",
    dataIndex: "language",
  },
  {
    title: "提交时间",
    slotName: "createTime",
  },
];

const detailModalVisible = ref(false);
const currentSubmission = ref<QuestionSubmitVO>();

const current = ref(1);
const pageSize = ref(10);
const total = ref(0);

const searchParams = ref({
  language: undefined,
  current: 1,
});

/**
 * 加载题目信息
 */
const loadQuestion = async () => {
  //获取题目封装类
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    props.id as any
  );
  if (res.code === 0) {
    questionVO.value = res.data;
  } else {
    message.error("加载题目失败，" + res.message);
  }
};
/**
 * 加载题目答案
 */
const loadQuestionAnswer = async () => {
  // 获取题目答案
  const res = await QuestionControllerService.getQuestionByIdUsingGet(
    props.id as any
  );
  if (res.code === 0) {
    question.value = res.data;
  } else {
    message.error("加载题目答案失败，" + res.message);
  }
};
/**
 * 加载提交记录
 */
const loadSubmissions = async () => {
  // 从 Vuex 中获取用户信息
  const user = store.state.user.loginUser;

  let userId;
  if (user && user.userRole !== ACCESS_ENUM.NOT_LOGIN) {
    userId = user.id;
  } else {
    await store.dispatch("user/getLoginUser");
  }

  // 获取提交记录
  const res = await QuestionControllerService.listQuestionSubmitByPageUsingPost(
    {
      questionId: questionVO.value?.id,
      userId: userId,
      language: searchParams.value.language,
      current: current.value,
      pageSize: pageSize.value,
      sortField: "createTime",
      sortOrder: "descend",
    }
  );

  if (res.code === 0) {
    submissions.value = res.data.records;
    total.value = res.data.total;
  } else {
    message.error("加载提交记录失败" + res.message);
  }
};
/**
 * 刷新提交记录
 */
const refreshSubmissions = async () => {
  loading.value = true;
  current.value = 1; // 刷新时重置为第一页
  searchParams.value.language = undefined; // 重置语言筛选
  await loadSubmissions();
  loading.value = false;
};

/**
 * 格式化时间
 */
const formatTime = (timeString: string) => {
  const date = new Date(timeString);
  return date.toLocaleString(); // Format to local time string
};

onMounted(() => {
  loadQuestion(); //加载题目信息
});

const onTabChange = (key: string) => {
  if (key === "1") {
    loadQuestion();
  } else if (key === "2") {
    loadQuestionAnswer();
  } else if (key === "3") {
    loadSubmissions();
  } else if (key === "4") {
    // loadComments();
  }
};

const form = ref<QuestionSubmitAddRequest>({
  language: LanguageEnum.JAVA,
  code: DefaultCodeEnum.java,
});
//父组件向子组件传递一个函数
const onCodeChange = (v: string) => {
  form.value.code = v;
  // console.log(v);
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
    activeKey.value = "3";
    onTabChange("3"); // 手动调用以触发相关逻辑
  } else {
    message.error("提交失败" + res.message);
  }
};

const showAIAnalysis = async (submission: QuestionSubmitVO) => {
  if (!submission) return;

  aiAnalysisLoading.value = true;
  aiModalTitle.value = submission.status === 3 ? "代码优化建议" : "错误分析";

  try {
    // 这里调用后端 AI 分析接口
    const res = await AiControllerService.analysisCodeByAiUsingGet(
      submission.id
    );
    if (res.code === 0) {
      aiAnalysisResult.value = res.data || "";
    } else {
      message.error("AI 分析失败：" + res.message);
    }
  } catch (error) {
    message.error("AI 分析请求失败");
  } finally {
    aiAnalysisLoading.value = false;
  }
};

const handleRowClick = (rowData: QuestionSubmitVO) => {
  currentSubmission.value = rowData;
  detailModalVisible.value = true;
  // 重置 AI 分析结果
  aiAnalysisResult.value = "";
};

/**
 * 页码改变时的回调
 */
const onPageChange = (page: number) => {
  current.value = page;
  loadSubmissions();
};

/**
 * 每页条数改变时的回调
 */
const onPageSizeChange = (size: number) => {
  pageSize.value = size;
  current.value = 1; // 切换每页条数时，重置为第一页
  loadSubmissions();
};

/**
 * 处理语言筛选变化
 */
const handleLanguageChange = () => {
  current.value = 1; // 重置页码
  loadSubmissions();
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
