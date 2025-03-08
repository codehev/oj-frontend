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
                v-model="searchParams.zoneId"
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

  <!-- 添加分区管理按钮 -->
  <div class="operation-wrapper">
    <a-button type="primary" @click="openZoneDrawer">
      <template #icon>
        <icon-plus />
      </template>
      分区管理
    </a-button>
  </div>

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

  <!-- 分区管理抽屉 -->
  <a-drawer
    :visible="zoneDrawerVisible"
    :width="500"
    title="分区管理"
    @cancel="zoneDrawerVisible = false"
    @ok="zoneDrawerVisible = false"
    unmountOnClose
  >
    <template #footer>
      <div style="text-align: right">
        <a-space>
          <a-button @click="zoneDrawerVisible = false">取消</a-button>
          <a-button type="primary" @click="saveZoneChanges">保存</a-button>
        </a-space>
      </div>
    </template>

    <div class="zone-management-container">
      <a-button type="primary" style="margin-bottom: 16px" @click="addNewZone">
        <template #icon>
          <icon-plus />
        </template>
        添加分区
      </a-button>

      <a-table
        :columns="zoneColumns"
        :data="editablePostZoneList"
        :pagination="false"
        bordered
      >
        <template #zoneName="{ record }">
          <a-input v-model="record.zoneName" placeholder="请输入分区名称" />
        </template>
        <template #description="{ record }">
          <a-input v-model="record.description" placeholder="请输入分区描述" />
        </template>
        <template #operation="{ record }">
          <a-button type="text" status="danger" @click="removeZone(record)">
            <template #icon>
              <icon-delete />
            </template>
          </a-button>
        </template>
      </a-table>
    </div>
  </a-drawer>
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
  PostZoneControllerService,
} from "../../../../../generated";
import {
  IconSearch,
  IconRefresh,
  IconPlus,
  IconDelete,
} from "@arco-design/web-vue/es/icon";

const zoneOptions = ref<SelectOptionData[]>([]);
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
    dataIndex: "postZone.zoneName",
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
  zoneId: undefined,
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
    zoneId: undefined,
    tags: [],
  };
  loadPostList();
};

// 分区管理相关
const zoneDrawerVisible = ref(false);
const editablePostZoneList = ref<SelectOptionData[]>([]);

const zoneColumns: TableColumnData[] = [
  {
    title: "分区名称",
    dataIndex: "zoneName",
    slotName: "zoneName",
  },
  {
    title: "分区描述",
    dataIndex: "description",
    slotName: "description",
  },
  {
    title: "操作",
    slotName: "operation",
    width: 80,
  },
];

// 加载分区列表
const loadZoneList = async () => {
  try {
    const res = await PostZoneControllerService.listPostZoneUsingGet();
    if (res.code === 0 && res.data) {
      // 转换为下拉框所需的格式
      zoneOptions.value = res.data.map((zone) => ({
        label: zone.zoneName || "",
        value: zone.id?.toString() || "",
      }));
    } else {
      Message.error("获取分区列表失败，" + res.message);
    }
  } catch (error) {
    console.error("获取分区列表出错", error);
    Message.error("获取分区列表失败");
  }
};

// 打开分区管理抽屉
const openZoneDrawer = async () => {
  try {
    // 获取完整的分区信息用于编辑
    const res = await PostZoneControllerService.listPostZoneUsingGet();
    if (res.code === 0 && res.data) {
      // 转换为表格编辑所需的格式
      editablePostZoneList.value = res.data.map((zone) => ({
        id: zone.id,
        zoneName: zone.zoneName || "",
        description: zone.description || "",
        sort: zone.sort || 0,
      }));
      zoneDrawerVisible.value = true;
    } else {
      Message.error("获取分区列表失败，" + res.message);
    }
  } catch (error) {
    console.error("获取分区列表出错", error);
    Message.error("获取分区列表失败");
  }
};

// 添加新分区
const addNewZone = () => {
  editablePostZoneList.value.push({
    id: undefined,
    zoneName: "",
    description: "",
    sort: 0,
  });
};

// 移除分区
const removeZone = (record: any) => {
  const index = editablePostZoneList.value.findIndex(
    (item) => item.id === record.id
  );
  if (index !== -1) {
    editablePostZoneList.value.splice(index, 1);
  }
};

// 保存分区更改
const saveZoneChanges = async () => {
  // 验证数据有效性
  const isValid = editablePostZoneList.value.every((item) => item.zoneName);

  if (!isValid) {
    Message.error("分区名称不能为空");
    return;
  }

  try {
    // 获取当前的分区列表，用于比较删除项
    const res = await PostZoneControllerService.listPostZoneUsingGet();
    if (res.code !== 0) {
      throw new Error("获取分区列表失败");
    }

    const currentZones = res.data || [];

    // 处理删除的分区（在原列表中但不在编辑列表中的项）
    const deletedZones = currentZones.filter(
      (originalZone) =>
        !editablePostZoneList.value.some(
          (editedZone) => originalZone.id && editedZone.id === originalZone.id
        )
    );

    // 处理新增和更新的分区
    for (const zone of editablePostZoneList.value) {
      if (zone.id) {
        // 更新现有分区
        await PostZoneControllerService.updatePostZoneUsingPost({
          id: zone.id,
          zoneName: zone.zoneName,
          description: zone.description,
          sort: zone.sort,
        });
      } else {
        // 添加新分区
        await PostZoneControllerService.addPostZoneUsingPost({
          zoneName: zone.zoneName,
          description: zone.description,
          sort: zone.sort,
        });
      }
    }

    // 删除已移除的分区
    for (const zone of deletedZones) {
      if (zone.id) {
        await PostZoneControllerService.deletePostZoneUsingPost({
          id: zone.id,
        });
      }
    }

    // 重新加载分区列表
    await loadZoneList();
    Message.success("分区保存成功");
    zoneDrawerVisible.value = false;
  } catch (error) {
    Message.error("保存分区失败，请重试");
  }
};

onMounted(() => {
  loadZoneList(); // 加载分区列表
  loadPostList();
});
</script>

<style scoped lang="less">
.operation-wrapper {
  margin-bottom: 16px;
  display: flex;
  justify-content: flex-end;
}

.zone-management-container {
  padding: 16px;
}
</style>
