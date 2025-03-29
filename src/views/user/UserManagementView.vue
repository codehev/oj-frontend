<template>
  <div id="userManagementView">
    <BreadcrumbComponent :items="items" />
    <div class="search-form-container">
      <a-form :model="searchParams" layout="inline" class="search-form">
        <a-form-item
          field="userAccount"
          label="账号"
          :show-colon="true"
          class="form-item"
        >
          <a-input
            v-model="searchParams.userAccount"
            placeholder="请输入账号..."
            allow-clear
          />
        </a-form-item>
        <a-form-item
          field="userName"
          label="用户名"
          :show-colon="true"
          class="form-item"
        >
          <a-input
            v-model="searchParams.userName"
            placeholder="请输入用户名..."
            allow-clear
          />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" @click="loadData">搜索</a-button>
        </a-form-item>
        <a-form-item class="add-user-button">
          <a-button type="primary" @click="showUserModal('add')"
            >添加用户</a-button
          >
        </a-form-item>
      </a-form>
    </div>
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
      <template #userAvatar="{ record }">
        <a-avatar :size="32" class="user-avatar" v-if="record.userAvatar">
          <img :src="record.userAvatar" alt="用户头像" />
        </a-avatar>
        <a-avatar :size="32" class="user-avatar" v-else>
          {{ record?.userName.charAt(0) }}
        </a-avatar>
      </template>
      <template #userRole="{ record }">
        <span>{{ roleEnum[record.userRole as keyof typeof roleEnum] }}</span>
      </template>
      <template #userStatus="{ record }">
        <a-tag :color="record.userRole === 'ban' ? 'red' : 'green'">
          {{ record.userRole === "ban" ? "禁用" : "启用" }}
        </a-tag>
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD h:mm:ss") }}
      </template>
      <template #action="{ record }">
        <a-space direction="horizontal">
          <a-button type="text" @click="showUserModal('edit', record)"
            >修改</a-button
          >
          <a-popconfirm
            :content="
              record.userRole === 'ban'
                ? '确定要启用该用户吗？'
                : '确定要禁用该用户吗？'
            "
            @ok="toggleUserStatus(record)"
          >
            <a-button
              type="text"
              :status="record.userRole === 'ban' ? 'success' : 'danger'"
            >
              {{ record.userRole === "ban" ? "启用" : "禁用" }}
            </a-button>
          </a-popconfirm>
          <a-popconfirm
            content="确定要删除该用户吗？"
            @ok="deleteUser(record.id)"
          >
            <a-button type="text" status="danger">删除</a-button>
          </a-popconfirm>
        </a-space>
      </template>
    </a-table>

    <!-- 合并后的用户模态框 -->
    <a-modal
      v-model:visible="isUserModalVisible"
      :title="modalType === 'add' ? '添加用户' : '编辑用户'"
      @ok="handleUserModalOk"
      @cancel="isUserModalVisible = false"
    >
      <a-form :model="userForm" layout="vertical">
        <a-form-item
          label="账号"
          field="userAccount"
          :rules="[{ required: true, message: '账号为必填字段' }]"
        >
          <a-input v-model="userForm.userAccount" placeholder="请输入账号..." />
        </a-form-item>
        <a-form-item
          label="密码"
          field="userPassword"
          :rules="[
            { required: modalType === 'add', message: '密码为必填字段' },
          ]"
        >
          <a-input-password
            v-model="userForm.userPassword"
            :placeholder="
              modalType === 'add' ? '请输入密码...' : '留空则不修改密码...'
            "
          />
        </a-form-item>
        <a-form-item
          label="确认密码"
          field="checkPassword"
          :rules="[
            { required: modalType === 'add', message: '确认密码为必填字段' },
            {
              validator: (value) => {
                if (userForm.userPassword && value !== userForm.userPassword) {
                  return false;
                }
                return true;
              },
              message: '两次输入的密码不一致',
            },
          ]"
        >
          <a-input-password
            v-model="userForm.checkPassword"
            :placeholder="
              modalType === 'add' ? '请再次输入密码...' : '留空则不修改密码...'
            "
          />
        </a-form-item>
        <a-form-item label="昵称" field="userName">
          <a-input v-model="userForm.userName" placeholder="请输入昵称..." />
        </a-form-item>
        <a-form-item label="角色" field="userRole">
          <a-select v-model="userForm.userRole" placeholder="请选择角色">
            <a-option value="user">用户</a-option>
            <a-option value="admin">管理员</a-option>
            <a-option value="vip">会员</a-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { UserControllerService, UserQueryRequest } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import moment from "moment";
import BreadcrumbComponent from "@/components/breadcrumb/BreadcrumbComponent.vue";
import { BreadcrumbItem } from "@/components/breadcrumb/types";
import { TableColumnData } from "@arco-design/web-vue/es/table";

const searchParams = ref<UserQueryRequest>({
  userAccount: "",
  userName: "",
  pageSize: 10,
  current: 1,
});

const total = ref(0);
const dataList = ref([]);
const roleEnum = {
  user: "用户",
  admin: "管理员",
  vip: "会员",
  ban: "禁用",
};

const isUserModalVisible = ref(false);
const modalType = ref("add");
const userForm = ref({
  userAccount: "",
  userPassword: "",
  checkPassword: "",
  userName: "",
  userRole: "user",
});

const items = ref<BreadcrumbItem[]>([
  {
    path: "/manage/user",
    name: "用户管理",
  },
]);

const loadData = async () => {
  const res = await UserControllerService.listUserVoByPageUsingPost(
    searchParams.value
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

const columns = ref<TableColumnData[]>([
  {
    title: "用户头像",
    slotName: "userAvatar",
  },
  {
    title: "账号",
    dataIndex: "userAccount",
  },
  {
    title: "用户名",
    dataIndex: "userName",
  },
  {
    title: "角色",
    slotName: "userRole",
  },
  {
    title: "状态",
    slotName: "userStatus",
  },
  {
    title: "创建时间",
    slotName: "createTime",
  },
  {
    title: "操作",
    slotName: "action",
  },
]);

const onPageChange = (page: number) => {
  searchParams.value.current = page;
  loadData();
};

const onPageSizeChange = (pageSize: number) => {
  searchParams.value.pageSize = pageSize;
  searchParams.value.current = 1;
  loadData();
};

const showUserModal = (type: string, record?: any) => {
  modalType.value = type;
  if (type === "edit") {
    userForm.value = { ...record };
  } else {
    userForm.value = {
      userAccount: "",
      userPassword: "",
      checkPassword: "",
      userName: "",
      userRole: "user",
    };
  }
  isUserModalVisible.value = true;
};

const handleUserModalOk = async () => {
  if (modalType.value === "add") {
    const res = await UserControllerService.addUserUsingPost(userForm.value);
    if (res.code === 0) {
      message.success("用户添加成功");
      isUserModalVisible.value = false;
      loadData();
    } else {
      message.error("添加用户失败，" + res.message);
    }
  } else {
    const res = await UserControllerService.updateUserUsingPost(userForm.value);
    if (res.code === 0) {
      message.success("用户信息更新成功");
      isUserModalVisible.value = false;
      loadData();
    } else {
      message.error("更新用户信息失败，" + res.message);
    }
  }
};

const deleteUser = async (id: number) => {
  const res = await UserControllerService.deleteUserUsingPost({ id });
  if (res.code === 0) {
    message.success("用户删除成功");
    loadData();
  } else {
    message.error("删除用户失败，" + res.message);
  }
};

const toggleUserStatus = async (record: any) => {
  const enabled = record.userRole === "ban";
  const res = await UserControllerService.toggleUserStatusUsingPost(
    enabled,
    record.id
  );
  if (res.code === 0) {
    message.success(enabled ? "用户启用成功" : "用户禁用成功");
    loadData();
  } else {
    message.error(enabled ? "启用用户失败" : "禁用用户失败，" + res.message);
  }
};
</script>

<style scoped>
#userManagementView {
  max-width: 1280px;
  margin: 0 auto;
  padding: 20px;
}

.search-form-container {
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.add-user-button {
  margin-left: auto;
}

.user-avatar {
  width: 40px; /* 设置头像宽度 */
  height: 40px; /* 设置头像高度 */
  border-radius: 50%; /* 使头像圆形 */
}
</style>
