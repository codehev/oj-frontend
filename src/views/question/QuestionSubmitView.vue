<template>
  <div id="questionSubmitView">
    <a-form :model="searchParams" layout="inline">
      <a-form-item
        field="questionId"
        label="题目ID"
        :show-colon="true"
        style="min-width: 280px"
      >
        <a-input
          v-model="searchParams.questionId"
          placeholder="请输入题目ID..."
        />
      </a-form-item>
      <a-form-item
        field="language"
        label="编程语言"
        :show-colon="true"
        style="min-width: 280px"
      >
        <a-select
          v-model="searchParams.language"
          :style="{ width: '160px' }"
          placeholder="请选择编程语言..."
          allow-clear
        >
          <a-option v-for="(language, key) in languageEnum" :key="key"
            >{{ language }}
          </a-option>
        </a-select>
      </a-form-item>
      <!--      <a-form-item>-->
      <!--        <a-button type="primary" @click="doSubmit">搜索</a-button>-->
      <!--      </a-form-item>-->
    </a-form>
    <a-divider :size="0" />
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
      <!--判题信息-->
      <template #judgeInfo="{ record }">
        {{ JSON.stringify(record.judgeInfo) }}
      </template>
      <!--判题状态-->
      <template #status="{ record }">
        {{ statusEnum[record.status] }}
      </template>
      <!--创建时间-->
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD h:mm:ss") }}
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import {
  QuestionControllerService,
  QuestionSubmitQueryRequest,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";
import languageEnum from "@/enum/languageEnum";
import statusEnum from "../../enum/statusEnum";

//搜索参数
const searchParams = ref<QuestionSubmitQueryRequest>({
  questionId: undefined,
  language: undefined,
  pageSize: 10,
  current: 1,
});
//记录条数
const total = ref(0);
//表格数据
const dataList = ref([]);

/**
 * 加载表格数据
 */
const loadData = async () => {
  //获取题目封装类
  const res = await QuestionControllerService.listQuestionSubmitByPageUsingPost(
    {
      ...searchParams.value,
      sortField: "createTime", //按创建时间降序
      sortOrder: "descend", //降序
    }
  );
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = Number(res.data.total);
  } else {
    message.error("加载失败，" + res.message);
  }
};
onMounted(() => {
  loadData();
});
/**
 * 每隔15秒刷新一次（更新判题状态）
 */
// setInterval(() => {
//   loadData();
// }, 15000);

/**
 * 要展示的列，以及设置列属性
 */
const columns = [
  {
    title: "提交编号",
    dataIndex: "id",
    sortable: {
      sortDirections: ["ascend", "descend"],
    },
  },
  {
    title: "用户ID",
    dataIndex: "userId",
    sortable: {
      sortDirections: ["ascend", "descend"],
    },
  },
  {
    title: "题目ID",
    dataIndex: "questionId",
    sortable: {
      sortDirections: ["ascend", "descend"],
    },
  },
  {
    title: "状态",
    slotName: "status",
    sortable: {
      sortDirections: ["ascend", "descend"],
    },
  },
  {
    title: "判题信息",
    slotName: "judgeInfo", //插槽名称
  },
  {
    title: "编程语言",
    dataIndex: "language",
    sortable: {
      sortDirections: ["ascend", "descend"],
    },
  },
  {
    title: "创建时间",
    slotName: "createTime", //插槽名称
    sortable: {
      sortDirections: ["ascend", "descend"],
    },
  },
];

/**
 * 跳转到做题页面
 * @param id
 */
const route = useRouter();
const toQuestionPage = (id: number) => {
  route.push({
    path: `/view/question/${id}`,
  });
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

const doSubmit = () => {
  searchParams.value = {
    ...searchParams.value,
    current: 1, //先把当前页重置为1，再搜索
  };
  // loadData(); //可以不需要调用，监听loadData()中的变量，searchParams
};
</script>

<style scoped>
#questionSubmitView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
