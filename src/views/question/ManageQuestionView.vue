<template>
  <!-- 题目管理页面 -->
  <div id="manageQuestionView">
    <BreadcrumbComponent :items="items" />
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
        </div>
        <div class="form-right">
          <a-button type="primary" class="create-btn" @click="createQuestion">
            <template #icon>
              <icon-plus />
            </template>
            创建题目
          </a-button>
        </div>
      </a-form>
    </div>

    <a-divider style="margin: 16px 0" />
    <a-table
      :columns="columns"
      :data="dataList"
      :pagination="{
        total: total,
        current: searchParams.current,
        pageSize: searchParams.pageSize,
        defaultCurrent: 1,
        defaultPageSize: 10,
        showTotal: true,
        showJumper: true,
        showPageSize: true,
      }"
      @page-change="onPageChange"
      @page-size-change="onPageSizeChange"
    >
      <!--题目-->
      <template #title="{ record }">
        <router-link
          class="tableLink"
          :to="{
            path: `/view/question/${record.id}`,
          }"
          >{{ record.title }}
        </router-link>
      </template>
      <!--标签-->
      <template #tags="{ record }">
        <a-space wrap>
          <a-tag v-for="(tag, index) of record.tags" :key="index" color="green"
            >{{ tag }}
          </a-tag>
        </a-space>
      </template>
      <!--判题配置-->
      <template #judgeConfig="{ record }">
        <a-popover position="right">
          <a-button type="text" size="mini">查看配置</a-button>
          <template #content>
            <a-descriptions
              :data="formatJudgeConfig(record.judgeConfig)"
              size="mini"
              :column="1"
            />
          </template>
        </a-popover>
      </template>
      <!--判题用例-->
      <template #judgeCase="{ record }">
        <a-popover position="right">
          <a-button type="text" size="mini"
            >查看用例({{ getJudgeCaseCount(record.judgeCase) }})</a-button
          >
          <template #content>
            <div class="case-scroll">
              <a-descriptions
                v-for="(item, index) in parseJudgeCase(record.judgeCase)"
                :key="index"
                :title="`用例 ${index + 1}`"
                :data="formatJudgeCase(item)"
                size="mini"
                :column="1"
              />
            </div>
          </template>
        </a-popover>
      </template>
      <!--用户-->
      <template #userName="{ record }">
        <router-link
          class="tableLink"
          :to="{
            path: `/user/home/${record.userId}`,
          }"
          >{{ record?.userId }}
        </router-link>
      </template>
      <!--创建时间-->
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD h:mm:ss") }}
      </template>
      <!--更新时间-->
      <template #updateTime="{ record }">
        {{ moment(record.updateTime).format("YYYY-MM-DD h:mm:ss") }}
      </template>
      <!--操作-->
      <template #optional="{ record }">
        <a-space direction="vertical">
          <a-button type="text" size="mini" @click="doUpdate(record.id)"
            >修改
          </a-button>
          <a-button
            type="text"
            status="danger"
            size="mini"
            @click="doDelete(record.id)"
            >删除
          </a-button>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import { QuestionControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";
import { IconPlus } from "@arco-design/web-vue/es/icon";
import BreadcrumbComponent from "@/components/breadcrumb/BreadcrumbComponent.vue";
import { BreadcrumbItem } from "@/components/breadcrumb/types";
import { TableColumnData } from "@arco-design/web-vue/es/table";
import { QuestionQueryRequest } from "../../../generated";
//搜索参数
const searchParams = ref<QuestionQueryRequest>({
  title: "",
  tags: [],
  pageSize: 10,
  current: 1,
});
//记录条数
const total = ref(0);
//表格数据
const dataList = ref();

const items = ref<BreadcrumbItem[]>([
  {
    path: "/manage/question",
    name: "题目管理",
  },
]);

/**
 * 加载表格数据
 */
const loadData = async () => {
  //获取题目封装类，要写成对象的形式，不然会监听不到searchParams.value的变化
  const res = await QuestionControllerService.listQuestionByPageUsingPost({
    ...searchParams.value,
  });
  if (res.code === 0) {
    dataList.value = res.data.records;
    //解析json
    for (let obj of dataList.value) {
      //可以直接改变原始值
      if (obj.tags) {
        obj.tags = JSON.parse(obj.tags);
      } else {
        obj.tags = [];
      }
      // if (obj.judgeCase) {
      //   obj.judgeCase = JSON.parse(obj.judgeCase);
      // } else {
      //   obj.judgeCase = [
      //     {
      //       input: "",
      //       output: "",
      //     },
      //   ];
      // }
      // if (obj.judgeConfig) {
      //   obj.judgeConfig = JSON.parse(obj.judgeConfig);
      // } else {
      //   obj.judgeConfig = {
      //     timeLimit: 1000,
      //     memoryLimit: 1000,
      //     stackLimit: 1000,
      //   };
      // }
    }
    total.value = Number(res.data.total);
  } else {
    message.error("加载失败，" + res.message);
  }
};
onMounted(() => {
  loadData();
});

/**
 * 要展示的列，以及设置列属性
 */
const columns = ref<TableColumnData[]>([
  {
    title: "id",
    dataIndex: "id",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "题目",
    slotName: "title",
    width: 150,
    ellipsis: true,
    tooltip: true,
    sortable: {
      sortDirections: ["ascend", "descend"],
    },
  },
  {
    title: "标签",
    slotName: "tags",
    ellipsis: true,
    tooltip: true,
  },
  {
    title: "提交数",
    dataIndex: "submitNum",
    ellipsis: true,
    tooltip: true,
    sortable: {
      sortDirections: ["ascend", "descend"],
    },
  },
  {
    title: "通过数",
    dataIndex: "acceptedNum",
    ellipsis: true,
    tooltip: true,
    sortable: {
      sortDirections: ["ascend", "descend"],
    },
  },
  {
    title: "判题配置",
    slotName: "judgeConfig",
    dataIndex: "judgeConfig",
    ellipsis: true,
  },
  {
    title: "判题用例",
    slotName: "judgeCase",
    dataIndex: "judgeCase",
    ellipsis: true,
  },
  {
    title: "创建用户",
    slotName: "userName",
    ellipsis: true,
    tooltip: true,
    sortable: {
      sortDirections: ["ascend", "descend"],
    },
  },
  {
    title: "创建时间",
    slotName: "createTime",
    ellipsis: true,
    tooltip: true,
    sortable: {
      sortDirections: ["ascend", "descend"],
    },
  },
  {
    title: "更新时间",
    slotName: "updateTime",
    ellipsis: true,
    tooltip: true,
    sortable: {
      sortDirections: ["ascend", "descend"],
    },
  },
  {
    title: "操作",
    slotName: "optional",
  },
]);
/**
 * 创建题目
 * @param id
 */
const route = useRouter();
const createQuestion = () => {
  route.push({
    path: "/add/question",
  });
};
/**
 * 跳转到做题页面
 * @param id
 */
const toQuestionPage = (id: number) => {
  route.push({
    path: `/view/question/${id}`,
  });
};
/**
 * 更新
 * @param id
 */
const doUpdate = (id: number) => {
  route.push({
    path: "/update/question",
    query: { id },
  });
};

/**
 * 删除
 * @param id
 */
const doDelete = async (id: number) => {
  const res = await QuestionControllerService.deleteQuestionUsingPost({ id });
  if (res.code === 0) {
    message.success(res.message);
    //更新题目列表
    loadData();
  } else {
    message.error("删除失败" + res.message);
  }
};

/**
 * 分页操作
 * @param page
 */
const onPageChange = (page: number) => {
  //这里，复制了 searchParams 的属性，并修改了 current 属性(已有则覆盖复制来的值，没有则添加)
  searchParams.value = { ...searchParams.value, current: page };
  // searchParams.value.current = page;
  // loadData();
};
const onPageSizeChange = (pageSize: number) => {
  searchParams.value = { ...searchParams.value, pageSize, current: 1 };
  // searchParams.value.pageSize = pageSize;
  // loadData();
};

/**
 * 监听loadData()中的响应式变量，例如searchParams，改变时触发函数重新调用（页面重新加载）
 *
 * watchEffect() 是 Vue 3 的 Composition API 中的一个函数，
 * 用于在组件内部监视一些响应式依赖项，并在它们更改时重新运行给定的副作用函数。
 * 简答来说里面的值发生了改变就调用一次
 */
watchEffect(() => {
  loadData();
});

/**
 * 格式化判题配置
 */
const formatJudgeConfig = (judgeConfig: string) => {
  if (!judgeConfig) {
    return [
      { label: "时间限制", value: "1000 ms" },
      { label: "内存限制", value: "1000 MB" },
      { label: "堆栈限制", value: "1000 MB" },
    ];
  }
  const config =
    typeof judgeConfig === "string" ? JSON.parse(judgeConfig) : judgeConfig;
  return [
    { label: "时间限制", value: `${config.timeLimit} ms` },
    { label: "内存限制", value: `${config.memoryLimit} MB` },
    { label: "堆栈限制", value: `${config.stackLimit} MB` },
  ];
};

/**
 * 解析判题用例
 */
const parseJudgeCase = (judgeCase: string) => {
  if (!judgeCase) {
    return [
      {
        input: "",
        output: "",
      },
    ];
  }
  return typeof judgeCase === "string" ? JSON.parse(judgeCase) : judgeCase;
};

/**
 * 格式化单个判题用例
 */
const formatJudgeCase = (caseItem: any) => {
  return [
    { label: "输入", value: caseItem.input || "空" },
    { label: "输出", value: caseItem.output || "空" },
  ];
};

/**
 * 获取判题用例数量
 */
const getJudgeCaseCount = (judgeCase: string) => {
  const cases = parseJudgeCase(judgeCase);
  return cases.length;
};
</script>

<style scoped>
#manageQuestionView {
  max-width: 1280px;
  margin: 0 auto;
  padding: 20px;
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

.form-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.form-item {
  margin-bottom: 0;
}

.create-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 16px;
  transition: all 0.3s ease;
}

.create-btn:hover {
  transform: scale(1.02);
}

.tableLink:link {
  color: rgb(var(--primary-6));
  text-decoration: none;
  transition: color 0.2s ease;
}

.tableLink:visited {
  color: rgb(var(--primary-6));
}

.tableLink:hover {
  color: rgb(var(--primary-7));
  text-decoration: underline;
}

/* 自定义滚动条样式 */
.case-scroll {
  max-height: 100px;
  overflow-y: auto;
  padding-right: 2px;
}

.case-scroll::-webkit-scrollbar {
  width: 4px;
}

.case-scroll::-webkit-scrollbar-thumb {
  border-radius: 2px;
  background-color: rgba(var(--gray-5), 0.5);
}

.case-scroll::-webkit-scrollbar-track {
  border-radius: 2px;
  background: transparent;
}

.case-scroll:hover::-webkit-scrollbar-thumb {
  background-color: rgb(var(--gray-5));
}

@media screen and (max-width: 768px) {
  .search-form {
    flex-direction: column;
    align-items: stretch;
  }

  .form-right {
    justify-content: flex-end;
    margin-top: 16px;
  }
}
</style>
