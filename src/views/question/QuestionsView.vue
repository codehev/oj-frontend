<template>
  <div id="manageQuestionView">
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
      <template #optional="{ record }">
        <a-space>
          <a-button type="primary" @click="doUpdate(record.id)">修改</a-button>
          <a-button status="danger" @click="doDelete(record.id)"
            >删除
          </a-button>
        </a-space>
      </template>
    </a-table>
    <!--    <a-pagination-->
    <!--      :total="total"-->
    <!--      v-model:current="searchParams.current"-->
    <!--      v-model:page-size="searchParams.pageSize"-->
    <!--      default-current="1"-->
    <!--      default-page-size="10"-->
    <!--      show-total-->
    <!--      show-jumper-->
    <!--      show-page-size-->
    <!--    />-->
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import { QuestionControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";

//搜索参数
const searchParams = ref({
  pageSize: 10,
  current: 1,
});
//记录条数
const total = ref(0);
//表格数据
const dataList = ref();

/**
 * 加载表格数据
 */
const loadData = async () => {
  const res = await QuestionControllerService.listQuestionByPageUsingPost(
    searchParams.value
  );
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
  } else {
    message.error(res.message);
  }
};
onMounted(() => {
  loadData();
});

/**
 * 更新
 * @param id
 */
const route = useRouter();
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
    message.error(res.message);
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
  searchParams.value = { ...searchParams.value, pageSize };
  // searchParams.value.pageSize = pageSize;
  // loadData();
};
/**
 * 监听变量searchParams，改变时触发页面重新加载
 * watchEffect() 是 Vue 3 的 Composition API 中的一个函数，
 * 用于在组件内部监视一些响应式依赖项，并在它们更改时重新运行给定的副作用函数。
 * 简答来说里面的值发生了改变就调用一次
 */
watchEffect(() => {
  loadData();
});
/**
 * 要展示的列，以及设置列属性
 */
const columns = [
  {
    title: "id",
    dataIndex: "id",
  },
  {
    title: "标题",
    dataIndex: "title",
  },
  {
    title: "标签",
    dataIndex: "tags",
  },
  {
    title: "内容",
    dataIndex: "content",
  },
  {
    title: "答案",
    dataIndex: "answer",
  },
  {
    title: "提交数",
    dataIndex: "submitNum",
  },
  {
    title: "通过数",
    dataIndex: "acceptedNum",
  },
  {
    title: "判题配置",
    dataIndex: "judgeConfig",
  },
  {
    title: "判题用例",
    dataIndex: "judgeCase",
  },
  {
    title: "用户ID",
    dataIndex: "userId",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
  },
  {
    title: "更新时间",
    dataIndex: "updateTime",
  },
  {
    title: "操作",
    slotName: "optional",
  },
];
</script>

<style scoped>
#manageQuestionView {
}
</style>
