<template>
  <div id="userManagementView">
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
          <a-button type="primary" @click="showAddUserModal">添加用户</a-button>
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
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD h:mm:ss") }}
      </template>
      <template #action="{ record }">
        <a-space direction="horizontal">
          <a-button type="text" @click="showEditUserModal(record)"
            >修改
          </a-button>
          <a-button type="text" status="danger" @click="deleteUser(record.id)"
            >删除
          </a-button>
        </a-space>
      </template>
    </a-table>

    <!-- 添加用户模态框 -->
    <a-modal
      v-model:visible="isAddUserModalVisible"
      title="添加用户"
      @ok="addUser"
      @cancel="isAddUserModalVisible = false"
    >
      <a-form :model="newUser" layout="vertical">
        <a-form-item
          label="账号"
          field="userAccount"
          :rules="[{ required: true, message: '账号为必填字段' }]"
        >
          <a-input v-model="newUser.userAccount" placeholder="请输入账号..." />
        </a-form-item>
        <a-form-item
          label="密码"
          field="userPassword"
          :rules="[{ required: true, message: '密码为必填字段' }]"
        >
          <a-input-password
            v-model="newUser.userPassword"
            placeholder="请输入密码..."
          />
        </a-form-item>
        <a-form-item label="昵称" field="userName">
          <a-input v-model="newUser.userName" placeholder="请输入昵称..." />
        </a-form-item>
        <a-form-item label="角色" field="userRole">
          <a-select v-model="newUser.userRole" placeholder="请选择角色">
            <a-option value="user">用户</a-option>
            <a-option value="admin">管理员</a-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 编辑用户模态框 -->
    <a-modal
      v-model:visible="isEditUserModalVisible"
      title="编辑用户"
      @ok="editUser"
      @cancel="isEditUserModalVisible = false"
    >
      <a-form :model="editUserData" layout="vertical">
        <a-form-item
          label="账号"
          field="userAccount"
          :rules="[{ required: true, message: '账号为必填字段' }]"
        >
          <a-input
            v-model="editUserData.userAccount"
            placeholder="请输入账号..."
          />
        </a-form-item>
        <a-form-item label="密码" field="userPassword">
          <a-input-password
            v-model="editUserData.userPassword"
            placeholder="请输入密码..."
          />
        </a-form-item>
        <a-form-item label="昵称" field="userName">
          <a-input
            v-model="editUserData.userName"
            placeholder="请输入昵称..."
          />
        </a-form-item>
        <a-form-item label="角色" field="userRole">
          <a-select v-model="editUserData.userRole" placeholder="请选择角色">
            <a-option value="user">用户</a-option>
            <a-option value="admin">管理员</a-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { UserControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import moment from "moment";

const searchParams = ref({
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
};

const isAddUserModalVisible = ref(false);
const isEditUserModalVisible = ref(false);
const newUser = ref({
  userAccount: "",
  userPassword: "",
  userName: "",
  userRole: "user",
});
const editUserData = ref<any>({});

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

const columns = [
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
    title: "创建时间",
    slotName: "createTime",
  },
  {
    title: "操作",
    slotName: "action",
  },
];

const onPageChange = (page: number) => {
  searchParams.value.current = page;
  loadData();
};

const onPageSizeChange = (pageSize: number) => {
  searchParams.value.pageSize = pageSize;
  searchParams.value.current = 1;
  loadData();
};

const showAddUserModal = () => {
  newUser.value = {
    userAccount: "",
    userPassword: "",
    userName: "",
    userRole: "user",
  };
  isAddUserModalVisible.value = true;
};

const addUser = async () => {
  const res = await UserControllerService.addUserUsingPost(newUser.value);
  if (res.code === 0) {
    message.success("用户添加成功");
    isAddUserModalVisible.value = false;
    loadData();
  } else {
    message.error("添加用户失败，" + res.message);
  }
};

const showEditUserModal = (record: any) => {
  editUserData.value = { ...record };
  isEditUserModalVisible.value = true;
};

const editUser = async () => {
  const res = await UserControllerService.updateUserUsingPost(
    editUserData.value
  );
  if (res.code === 0) {
    message.success("用户信息更新成功");
    isEditUserModalVisible.value = false;
    loadData();
  } else {
    message.error("更新用户信息失败，" + res.message);
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
