<template>
  <a-row>
    <a-col :flex="1">
      <a-form
        :model="searchParams"
        :label-col-props="{ span: 6 }"
        :wrapper-col-props="{ span: 18 }"
        label-align="left"
      >
        <a-row :gutter="16">
          <a-col :span="8">
            <a-form-item field="title" label="标题">
              <a-input
                v-model="searchParams.title"
                placeholder="请输入帖子标题"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="zone" label="分区">
              <a-select
                v-model="searchParams.zone"
                placeholder="请选择帖子分区"
                allow-clear
                :options="zoneOptions"
              ></a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item field="tags" label="标签">
              <a-input-tag
                v-model="searchParams.tags"
                allow-clear
                placeholder="请输入帖子标签并回车"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-col>
    <a-divider style="height: 75px" direction="vertical" />
    <a-col :flex="'60px'" style="text-align: right">
      <a-space direction="vertical" :size="10">
        <a-button type="primary" @click="loadPostList">
          <template #icon>
            <icon-search />
          </template>
          查询
        </a-button>
        <a-button @click="reset">
          <template #icon>
            <icon-refresh />
          </template>
          重置
        </a-button>
      </a-space>
    </a-col>
  </a-row>
  <a-divider style="margin-top: 12px" />
  <a-table
    bordered
    row-key="id"
    :columns="columns"
    :data="postList"
    :loading="loading"
    :pagination="{
      current: searchParams.current,
      pageSize: searchParams.pageSize,
      defaultCurrent: 1,
      defaultPageSize: 10,
      showTotal: true,
      total: total,
      showJumper: true,
      showPageSize: true,
      pageSizeOptions: [10, 20, 30, 40, 50],
    }"
    @page-change="handlePageNumberChange"
    @page-size-change="handlePageSizeChange"
  >
    <template #Tags="{ record }">
      <a-space wrap>
        <span
          v-for="tag in record.tagList"
          :key="tag"
          style="text-align: center"
        >
          <a-tag color="blue">
            {{ tag }}
          </a-tag>
        </span>
      </a-space>
    </template>
    <template #Avatar="{ record }">
      <a-image width="40px" :src="record?.user?.userAvatar"></a-image>
    </template>
    <template #Controls="{ record }">
      <a-link @click="handleEdit(record)">编辑</a-link>
      <a-popconfirm content="确定要删除吗？" @ok="handleDel(record)">
        <a-link status="danger">删除</a-link>
      </a-popconfirm>
    </template>
  </a-table>
</template>

<script setup lang="ts">
import { Message, TableColumnData } from "@arco-design/web-vue";
import { onMounted, ref } from "vue";
import { SelectOptionData } from "@arco-design/web-vue/es/select/interface";
import { useRouter } from "vue-router";
import {
  PostVO,
  PostQueryRequest,
  PostControllerService,
} from "../../../../../generated";
import { IconSearch, IconRefresh } from "@arco-design/web-vue/es/icon";

const zoneOptions = ref<SelectOptionData[]>([
  {
    label: "综合",
    value: "synthesis",
  },
  {
    label: "前端",
    value: "frontend",
  },
  {
    label: "后端",
    value: "backend",
  },
  {
    label: "鸿蒙",
    value: "harmony",
  },
  {
    label: "AIGC",
    value: "aigc",
  },
]);
const columns: TableColumnData[] = [
  {
    title: "作者",
    dataIndex: "user.userName",
    align: "center",
    slotName: "User",
    width: 200,
  },
  {
    title: "头像",
    dataIndex: "user.userAvatar",
    align: "center",
    slotName: "Avatar",
    width: 100,
  },
  {
    title: "标题",
    dataIndex: "title",
    align: "center",
    width: 200,
  },
  {
    title: "分区",
    dataIndex: "zone",
    align: "center",
    width: 150,
  },
  {
    title: "标签",
    slotName: "Tags",
    align: "center",
    width: 200,
  },
  {
    title: "点赞数",
    dataIndex: "thumbNum",
    align: "center",
    width: 100,
    sortable: {
      sortDirections: ["ascend", "descend"],
    },
  },
  {
    title: "收藏数",
    dataIndex: "favourNum",
    align: "center",
    width: 100,
    sortable: {
      sortDirections: ["ascend", "descend"],
    },
  },
  {
    title: "观看数",
    dataIndex: "viewNum",
    align: "center",
    width: 100,
    sortable: {
      sortDirections: ["ascend", "descend"],
    },
  },
  {
    slotName: "Controls",
    title: "操作",
    fixed: "right",
    align: "center",
    width: 200,
  },
];

const loading = ref(false);
const searchParams = ref<PostQueryRequest>({
  current: 1,
  pageSize: 10,
  title: "",
  zone: "",
  tags: [],
});
const total = ref(0);
const postList = ref<PostVO[]>([]);
/**
 * 查询数据
 */
const loadPostList = async () => {
  loading.value = true;
  const res = await PostControllerService.listPostVoByPageUsingPost({
    ...searchParams.value,
  });
  if (res.code === 0) {
    postList.value = res.data.records;
    total.value = res.data.total;
    searchParams.value.current = res.data.current;
    searchParams.value.pageSize = res.data.size;
  } else {
    Message.error("查询失败，" + res.message);
  }
  loading.value = false;
};

const handlePageSizeChange = (pageSize: number) => {
  searchParams.value.pageSize = pageSize;
  loadPostList();
};

const handlePageNumberChange = (current: number) => {
  searchParams.value.current = current;
  loadPostList();
};
//
const handleDel = async (record: PostVO) => {
  const res = await PostControllerService.deletePostUsingPost({
    id: record.id,
  });
  if (res.code === 0) {
    Message.success("删除成功");
    loadPostList();
  } else {
    Message.error("删除失败，" + res.message);
  }
};

const router = useRouter();
/**
 * 编辑帖子
 */
const handleEdit = (record: PostVO) => {
  router.push({ path: "/update/post", query: { id: record.id } });
};

/**
 * 重置查询条件
 */
const reset = () => {
  searchParams.value = {
    current: 1,
    pageSize: 10,
    title: "",
    zone: "",
    tags: [],
  };
  loadPostList();
};

onMounted(() => {
  loadPostList();
});
</script>

<style scoped lang="less"></style>
