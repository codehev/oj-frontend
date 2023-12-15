<template>
  <div id="questionsView">
    <a-form :model="searchParams" layout="inline">
      <a-form-item
        field="title"
        label="题目名称"
        :show-colon="true"
        style="min-width: 280px"
      >
        <a-input v-model="searchParams.title" placeholder="请输入题目名称..." />
      </a-form-item>
      <a-form-item
        field="tags"
        label="标签"
        :show-colon="true"
        style="min-width: 280px"
      >
        <a-input-tag v-model="searchParams.tags" placeholder="请输入标签..." />
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
      <!--题目-->
      <template #title="{ record }">
        <div class="title" @click="toQuestionPage(record.id)">
          {{ record.title }}
        </div>
        <!--        <router-link-->
        <!--          :to="{-->
        <!--            path: `/view/question/${record.id}`,-->
        <!--          }"-->
        <!--          >{{ record.title }}-->
        <!--        </router-link>-->
      </template>
      <!--标签-->
      <template #tags="{ record }">
        <a-space wrap>
          <a-tag v-for="(tag, index) of record.tags" :key="index" color="green"
            >{{ tag }}
          </a-tag>
        </a-space>
      </template>
      <!--通过率-->
      <template #acceptedRate="{ record }">
        {{
          `${
            record.submitNum ? record.acceptedNum / record.submitNum : "0"
          }% (${record.acceptedNum} / ${record.submitNum})`
        }}
      </template>
      <!--创建时间-->
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD h:mm:ss") }}
      </template>
      <!--作用域插槽，{ record }解构赋值，record行记录-->
      <!--      <template #optional="{ record }">-->
      <!--        <a-space>-->
      <!--          <a-button-->
      <!--            type="primary"-->
      <!--            size="small"-->
      <!--            @click="toQuestionPage(record.id)"-->
      <!--            >做题-->
      <!--          </a-button>-->
      <!--        </a-space>-->
      <!--      </template>-->
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import {
  QuestionControllerService,
  QuestionQueryRequest,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";

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
const dataList = ref([]);

/**
 * 加载表格数据
 */
const loadData = async () => {
  //获取题目封装类，要写成对象的形式，不然会监听不到searchParams.value的变化
  const res = await QuestionControllerService.listQuestionVoByPageUsingPost({
    ...searchParams.value,
  });
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
 * 要展示的列，以及设置列属性
 */
const columns = [
  {
    title: "题号",
    dataIndex: "id",
    width: 200,
    sortable: {
      sortDirections: ["ascend", "descend"],
    },
  },
  {
    title: "题目名称",
    slotName: "title",
    width: 300,
    sortable: {
      sortDirections: ["ascend", "descend"],
    },
  },
  {
    title: "标签",
    slotName: "tags", //插槽名称
  },
  {
    // 通过数/提交数
    title: "通过率",
    slotName: "acceptedRate", //插槽名称
    sortable: {
      sortDirections: ["ascend", "descend"],
    },
  },
  {
    title: "提交数",
    dataIndex: "submitNum",
    sortable: {
      sortDirections: ["ascend", "descend"],
    },
  },
  // {
  //   title: "通过数",
  //   dataIndex: "acceptedNum",
  // },
  {
    title: "创建时间",
    slotName: "createTime",
    sortable: {
      sortDirections: ["ascend", "descend"],
    },
  },
  // {
  //   title: "操作",
  //   slotName: "optional",
  // },
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
  // console.log("watchEffect配置的回调执行了");
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
#questionsView {
  max-width: 1280px;
  margin: 0 auto;
}

.title:hover {
  color: #59a4f3;
}
</style>
