<template>
  <div id="manageQuestionView">
    <a-table
      :columns="columns"
      :data="dataList"
      :pagination="{
        total: total,
        current: searchParams.pageNum,
        pageSize: searchParams.pageSize,
        defaultCurrent: 1,
        defaultPageSize: 10,
        showTotal: true,
        showJumper: true,
        showPageSize: true,
      }"
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
    <!--      v-model:current="searchParams.pageNum"-->
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
import { onMounted, ref } from "vue";
import { QuestionControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";

const searchParams = ref({
  pageSize: 10,
  pageNum: 1,
});
const total = ref(0);
const dataList = ref();
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

const route = useRouter();
const doUpdate = (id: number) => {
  route.push({
    path: "/update/question",
    query: { id },
  });
};
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
//要展示的列，以及设置列属性
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
