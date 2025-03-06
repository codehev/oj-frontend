<template>
  <div class="userRegisterView">
    <h2 class="form-title">用户注册</h2>
    <a-form
      :model="form"
      size="large"
      @submit="handleSubmit"
      label-align="left"
      auto-label-width
      class="form-container"
    >
      <a-form-item label="账号" field="userAccount" :rules="accountRules">
        <a-input
          v-model="form.userAccount"
          placeholder="请输入账号..."
          class="input-field"
        />
      </a-form-item>
      <a-form-item label="密码" field="userPassword" :rules="passwordRules">
        <a-input-password
          v-model="form.userPassword"
          placeholder="请输入密码..."
          class="input-field"
        />
      </a-form-item>
      <a-form-item
        label="确认密码"
        field="checkPassword"
        :rules="checkPasswordRules"
      >
        <a-input-password
          v-model="form.checkPassword"
          placeholder="请确认密码..."
          class="input-field"
        />
      </a-form-item>
      <div>
        <a class="login-link" @click="ToLogin">已有账号，去登录!</a>
      </div>
      <a-form-item>
        <a-button type="primary" html-type="submit" class="submit-button"
          >注 册</a-button
        >
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { Message } from "@arco-design/web-vue";
import { useRouter } from "vue-router";
import { UserControllerService, UserRegisterRequest } from "../../../generated";

const form = reactive({
  userAccount: "",
  userPassword: "",
  checkPassword: "",
} as UserRegisterRequest);

const router = useRouter();

const accountRules = [
  { required: true, message: "账号是必填项" },
  { minLength: 4, message: "账号长度不能少于4位" },
  { maxLength: 16, message: "账号长度不能超过16位" },
];

const passwordRules = [
  { required: true, message: "密码是必填项" },
  { minLength: 8, message: "密码长度不能少于8位" },
  { maxLength: 16, message: "密码长度不能超过16位" },
];

const checkPasswordRules = [
  { required: true, message: "确认密码是必填项" },
  {
    validator: (value: any, cb: any) => {
      if (value !== form.userPassword) {
        cb("两次密码输入不一致，请重新输入！");
      } else {
        cb();
      }
    },
  },
];

const ToLogin = () => {
  router.push({ path: "/user/login", replace: true });
};

const handleSubmit = async ({ values, errors }: any) => {
  if (errors) return;
  const res = await UserControllerService.userRegisterUsingPost(form);
  if (res.code === 0) {
    router.push({ path: "/user/login", replace: true });
    Message.success("注册成功，请登录！");
  } else {
    Message.error("注册失败，" + res.message);
  }
};
</script>

<style scoped>
.form-title {
  margin-bottom: 32px;
}

.form-container {
  max-width: 480px;
  margin: 0 auto;
}

.input-field {
  border-radius: 4px; /* 圆角 */
  border: 1px solid #d9d9d9; /* 边框颜色 */
  transition: border-color 0.3s; /* 边框颜色过渡 */
}

.input-field:focus {
  border-color: #1677ff; /* 聚焦时的边框颜色 */
  box-shadow: 0 0 5px rgba(22, 119, 255, 0.5); /* 聚焦时的阴影效果 */
}

.login-link {
  float: right;
  margin-bottom: 16px;
  cursor: pointer;
  color: #1677ff;
}

.submit-button {
  width: 380px;
}
</style>
