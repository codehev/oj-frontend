<template>
  <div id="questionLayout">
    <!--vh是前端开发中的一个动态单位，表示相对于视口（Viewport）的高度。
    系统会将视口的宽度和高度分为100份，1vh就占用视口高度的百分之一。
    这个单位使得前端开发更加灵活，可以适应不同大小的视口，提高用户体验。-->
    <a-layout style="height: 100vh">
      <a-layout-header class="header">
        <a-drawer
          :width="500"
          :visible="visible"
          placement="left"
          :footer="false"
          @cancel="handleCancel"
          unmountOnClose
        >
          <template #title>题库</template>
          <!-- 搜索区域 -->
          <div class="search-form-container">
            <a-form :model="searchParams" layout="inline" class="search-form">
              <div class="form-left">
                <a-form-item
                  field="title"
                  label="题目名称"
                  :show-colon="true"
                  class="form-item"
                >
                  <a-input
                    v-model="searchParams.title"
                    placeholder="请输入题目名称..."
                    :style="{ width: '200px' }"
                    allow-clear
                  />
                </a-form-item>
                <a-form-item
                  field="tags"
                  label="标签"
                  :show-colon="true"
                  class="form-item"
                >
                  <a-input-tag
                    v-model="searchParams.tags"
                    placeholder="请输入标签..."
                    :style="{ width: '200px' }"
                  />
                </a-form-item>
                <a-form-item>
                  <a-button type="primary" @click="doSearch">搜索</a-button>
                  <a-button
                    type="default"
                    @click="resetSearch"
                    style="margin-left: 8px"
                    >重置</a-button
                  >
                </a-form-item>
              </div>
            </a-form>
          </div>

          <a-divider style="margin: 16px 0" />

          <!-- 题目列表 -->
          <div @scroll="handleScroll" class="scrollable-content">
            <a-table :columns="columns" :data="dataList" :pagination="false">
              <!--题目-->
              <template #title="{ record }">
                <router-link
                  class="tableLink"
                  :to="{
                    path: `/view/question/${record.id}`,
                  }"
                  @click="handleCancel"
                  >{{ record.title }}
                </router-link>
              </template>
              <!--标签-->
              <template #tags="{ record }">
                <a-space wrap>
                  <a-tag
                    v-for="(tag, index) of record.tags"
                    :key="index"
                    color="green"
                  >
                    {{ tag }}
                  </a-tag>
                </a-space>
              </template>
              <!--通过率-->
              <template #acceptedRate="{ record }">
                {{
                  `${
                    record.submitNum
                      ? record.acceptedNum / record.submitNum
                      : "0"
                  }% (${record.acceptedNum} / ${record.submitNum})`
                }}
              </template>
            </a-table>
            <!-- 加载指示器 -->
            <div v-if="isLoading" style="text-align: center; padding: 16px">
              <a-spin />
              <span>加载更多...</span>
            </div>
          </div>
        </a-drawer>
        <!--a-space组件可以提供不同大小的间距，并且支持响应式布局。
        这意味着间距可以根据屏幕尺寸进行自适应调整，以在不同设备上提供良好的用户体验。-->
        <a-space>
          <a-popover content="返回">
            <a-button type="text" @click="router.back()">
              <IconPark type="return" theme="filled" size="20" fill="#666" />
            </a-button>
          </a-popover>
          <a-popover content="题库">
            <a-button type="text" @click="handleClick">
              <IconPark
                type="menu-unfold-one"
                theme="filled"
                size="20"
                fill="#666"
              />
            </a-button>
          </a-popover>
          <a-popover content="上一题">
            <a-button type="text" @click="router.back()">
              <IconPark type="left" theme="filled" size="20" fill="#666" />
            </a-button>
          </a-popover>
          <a-popover content="下一题">
            <a-button type="text" @click="router.back()">
              <IconPark type="right" theme="filled" size="20" fill="#666" />
            </a-button>
          </a-popover>
          <a-popover content="随机一题">
            <a-button type="text" @click="router.back()">
              <IconPark
                type="shuffle-one"
                theme="filled"
                size="16"
                fill="#666"
              />
            </a-button>
          </a-popover>
        </a-space>
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
    </a-layout>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  QuestionControllerService,
  QuestionQueryRequest,
} from "../../generated";
import message from "@arco-design/web-vue/es/message";
import { IconPark } from "@icon-park/vue-next/es/all";

const visible = ref(false);
const router = useRouter();

// 搜索参数
const searchParams = ref<QuestionQueryRequest>({
  title: "",
  tags: [],
  pageSize: 10,
  current: 1,
});

// 记录条数
const total = ref(0);
// 表格数据
const dataList = ref<any[]>([]); // 确保 dataList 的类型为数组
// 数据加载完成标志
const allDataLoaded = ref(false);
// 加载状态，防止重复请求的标志
const isLoading = ref(false);

/**
 * 加载表格数据
 */
const loadData = async () => {
  if (allDataLoaded.value || isLoading.value) return; // 如果所有数据已加载或正在请求，则不再请求

  isLoading.value = true; // 设置为正在加载
  try {
    const res = await QuestionControllerService.listQuestionVoByPageUsingPost({
      ...searchParams.value,
    });
    if (res.code === 0) {
      dataList.value.push(...res.data.records); // 懒加载，追加数据
      total.value = Number(res.data.total);
      // 判断是否加载完所有数据
      if (total.value === dataList.value.length) {
        allDataLoaded.value = true; // 设置为已加载完所有数据
      }
    } else {
      message.error("加载失败，" + res.message);
    }
  } catch (error) {
    message.error("加载失败，请重试");
  } finally {
    isLoading.value = false; // 重置加载状态
  }
};

/**
 * 要展示的列
 */
const columns = [
  {
    title: "题目名称",
    slotName: "title",
    width: 200,
  },
  {
    title: "标签",
    slotName: "tags",
  },
  {
    title: "通过率",
    slotName: "acceptedRate",
    width: 100,
  },
];

/**
 * 处理滚动事件
 */
const handleScroll = (event: Event) => {
  const target = event.target as HTMLElement;
  const { scrollTop, clientHeight, scrollHeight } = target;
  if (scrollTop + clientHeight >= scrollHeight - 5) {
    searchParams.value.current += 1; // 增加当前页码
    loadData(); // 加载数据
  }
};

const handleClick = () => {
  visible.value = true;
  dataList.value = [];
  allDataLoaded.value = false;
  loadData();
};
const handleCancel = () => {
  visible.value = false;
  dataList.value = [];
  allDataLoaded.value = false;
};

const doSearch = () => {
  dataList.value = [];
  allDataLoaded.value = false;
  searchParams.value.current = 1;
  loadData();
};

// 重置搜索参数
const resetSearch = () => {
  searchParams.value.title = "";
  searchParams.value.tags = [];
  doSearch(); // 重新加载数据
};

// 监听搜索参数变化，重新加载数据（开启会有bug）
// watch(
//   searchParams,
//   () => {
//     dataList.value = []; // 清空数据列表
//     allDataLoaded.value = false; // 重置加载状态
//     loadData();
//   },
//   { deep: true }
// );

onMounted(() => {
  // loadData(); // 初始加载数据
});
</script>
<style scoped>
/*scoped样式只在当前vue文件下起作用*/

#questionLayout {
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background-color: var(--color-neutral-2);
}

.header {
  height: 48px;
  line-height: 48px;
  padding: 0 24px;
  background: #fff;
  border-bottom: 1px solid var(--color-neutral-3);
  display: flex;
  align-items: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.content {
  height: calc(100vh - 48px);
  padding: 16px;
  overflow: hidden;
  box-sizing: border-box;
}

:deep(.arco-btn-text) {
  color: var(--color-text-2);
}

:deep(.arco-btn-text:hover) {
  background-color: var(--color-fill-2);
  color: rgb(var(--primary-6));
}

:deep(.arco-popover) {
  font-size: 13px;
}

.search-form-container {
  background-color: var(--color-bg-2);
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.search-form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.form-left {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.form-item {
  margin-bottom: 0;
}

.tableLink {
  color: rgb(var(--primary-6));
  text-decoration: none;
  transition: color 0.2s ease;
}

.tableLink:hover {
  color: rgb(var(--primary-7));
  text-decoration: underline;
}

:deep(.arco-drawer-body) {
  padding: 0 16px;
}

:deep(.arco-table-th) {
  background-color: var(--color-fill-2) !important;
}

:deep(.arco-table-tr:hover) {
  background-color: var(--color-fill-2);
  cursor: pointer;
}

@media screen and (max-width: 768px) {
  .search-form {
    flex-direction: column;
    align-items: stretch;
  }
}

/* 自定义滚动条样式 */
.scrollable-content {
  max-height: calc(100vh - 280px);
  overflow-y: auto;
}

.scrollable-content::-webkit-scrollbar {
  width: 8px; /* 滚动条宽度 */
}

.scrollable-content::-webkit-scrollbar-thumb {
  background-color: #888; /* 滚动条滑块颜色 */
  border-radius: 4px; /* 滚动条滑块圆角 */
}

.scrollable-content::-webkit-scrollbar-thumb:hover {
  background-color: #555; /* 滚动条滑块悬停颜色 */
}

.scrollable-content::-webkit-scrollbar-track {
  background: #f1f1f1; /* 滚动条轨道颜色 */
}
</style>
