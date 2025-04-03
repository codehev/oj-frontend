<template>
  <div class="submission-history">
    <!-- 顶部过滤和操作区 -->
    <div class="control-bar">
      <div class="filter-section">
        <a-select
          v-model="searchParams.language"
          placeholder="选择编程语言"
          allow-clear
          size="small"
          style="width: 120px"
          @change="handleLanguageChange"
        >
          <a-option v-for="(language, key) in LanguageEnum" :key="key">
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

    <!-- 提交记录表格 -->
    <div v-if="submissions.length === 0" class="empty-text">暂无提交记录</div>
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
        {{ STATUS_ENUM[record.status] || "--" }}
      </template>
      <!-- 结果列 -->
      <template #judgeMessage="{ record }">
        {{ record.judgeInfo?.message || "--" }}
      </template>
      <!-- 时间列 -->
      <template #judgeTime="{ record }">
        {{ record.judgeInfo?.time || "--" }}ms
      </template>
      <!-- 内存列 -->
      <template #judgeMemory="{ record }">
        {{ record.judgeInfo?.memory || "--" }}kb
      </template>
      <!-- 提交时间列 -->
      <template #createTime="{ record }">
        {{ formatTime(record.createTime) || "--" }}
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, onMounted, watch } from "vue";
import {
  QuestionControllerService,
  QuestionSubmitVO,
} from "../../../../../generated";
import { TableColumnData } from "@arco-design/web-vue/es/table";
import LanguageEnum from "@/enum/LanguageEnum";
import STATUS_ENUM from "@/enum/StatusEnum";

const props = defineProps({
  questionId: {
    type: [String],
    required: true,
    default: undefined,
  },
});

const emit = defineEmits(["showDetail"]);

// 表格列定义
const columns = ref<TableColumnData[]>([
  { title: "状态", slotName: "status" },
  { title: "结果", slotName: "judgeMessage" },
  { title: "时间", slotName: "judgeTime" },
  { title: "内存", slotName: "judgeMemory" },
  { title: "语言", dataIndex: "language" },
  { title: "提交时间", slotName: "createTime" },
]);

// 分页相关
const current = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 提交记录数据
const submissions = ref<QuestionSubmitVO[]>([]);
const loading = ref(false);

// 搜索参数
const searchParams = ref({
  language: undefined,
  current: 1,
});

/**
 * 加载提交记录
 */
const loadSubmissions = async () => {
  const questionId = props.questionId;
  if (!questionId) {
    // console.log("未提供questionId，无法加载提交记录");
    return;
  }
  // console.log("开始加载提交记录，questionId:", questionId);
  loading.value = true;
  try {
    const res =
      await QuestionControllerService.listQuestionSubmitByPageUsingPost({
        questionId: questionId as any,
        language: searchParams.value.language,
        pageSize: pageSize.value,
        current: current.value,
        sortField: "create_time",
        sortOrder: "descend",
      });

    // console.log("提交记录API返回：", res);
    if (res.code === 0) {
      submissions.value = res.data.records;
      total.value = Number(res.data.total);
    } else {
      console.error("获取提交记录失败", res.message);
    }
  } catch (error) {
    console.error("获取提交记录失败", error);
  } finally {
    loading.value = false;
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
 * 处理语言变更
 */
const handleLanguageChange = () => {
  current.value = 1; // 重置为第一页
  loadSubmissions();
};

/**
 * 处理分页变更
 */
const onPageChange = (page: number) => {
  current.value = page;
  loadSubmissions();
};

/**
 * 处理每页数量变更
 */
const onPageSizeChange = (size: number) => {
  pageSize.value = size;
  loadSubmissions();
};

/**
 * 点击行查看详情
 */
const handleRowClick = (record: any) => {
  // 确保传递给父组件的是QuestionSubmitVO类型数据
  emit("showDetail", record as QuestionSubmitVO);
};

/**
 * 格式化时间
 */
const formatTime = (timeString: string) => {
  const date = new Date(timeString);
  return date.toLocaleString();
};

// 监听questionId变化
watch(
  () => props.questionId,
  (newId) => {
    // console.log("questionId变化，新值:", newId);
    // 重置分页
    current.value = 1;
    searchParams.value.language = undefined;
    loadSubmissions();
  },
  { immediate: true }
);

onMounted(() => {
  loadSubmissions();
});
</script>

<style scoped>
.submission-history {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.control-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 20px;
}

.empty-text {
  padding: 20px;
  text-align: center;
  color: var(--color-text-3);
}

.filter-section {
  display: flex;
  align-items: center;
}
</style>
