<template>
  <div class="userRegisterView">
    <h2 style="margin-bottom: 32px">用户注册</h2>
    <a-form
      :model="form"
      size="large"
      @submit="handleSubmit"
      label-align="left"
      auto-label-width
      style="max-width: 480px; margin: 0 auto"
    >
      <a-form-item
        label="账号"
        field="userAccount"
        :show-colon="true"
        tooltip="账号长度不低于4位字符"
        :validate-trigger="['change', 'input']"
        :rules="[
          {
            required: true,
            message: '账号是必填项',
          },
          { minLength: 4, message: '账号长度不能少于4位' },
          { maxLength: 16, message: '账号长度不能超过16位' },
        ]"
      >
        <a-input v-model="form.userAccount" placeholder="请输入账号..." />
      </a-form-item>
      <a-form-item
        label="密码"
        field="userPassword"
        :show-colon="true"
        tooltip="密码长度不低于8位字符"
        :validate-trigger="['change', 'input']"
        :rules="[
          {
            required: true,
            message: '密码是必填项',
          },
          { minLength: 8, message: '密码长度不能少于8位' },
          { maxLength: 16, message: '密码长度不能超过16位' },
        ]"
      >
        <a-input-password
          v-model="form.userPassword"
          placeholder="请输入密码..."
        />
      </a-form-item>
      <a-form-item
        label="确认密码"
        field="checkPassword"
        :show-colon="true"
        :validate-trigger="['change', 'input']"
        :rules="checkPasswordRules"
      >
        <a-input-password
          v-model="form.checkPassword"
          placeholder="请确认密码..."
        />
      </a-form-item>
      <div>
        <a
          style="
            float: right;
            margin-bottom: 16px;
            cursor: pointer;
            color: #1677ff;
          "
          @click="ToLogin"
          >已有账号，去登陆!</a
        >
      </div>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 380px"
          >注 册
        </a-button>
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

/**
 * 确认密码校验规则
 */
const checkPasswordRules = [
  {
    required: true,
    message: "确认密码是必填项",
  },
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

/**
 * 跳转到登录页面
 * @constructor
 */
const ToLogin = () => {
  router.push({
    path: "/user/login",
    replace: true,
  });
};

/**
 * 提交表单
 *
 */
const handleSubmit = async ({ values, errors }: any) => {
  // console.log("values:", values, "\nerrors:", errors);
  // console.log("\nform:", form);
  if (errors) {
    return;
  }
  const res = await UserControllerService.userRegisterUsingPost(form);
  if (res.code === 0) {
    // 注册成功，跳转到登录页
    router.push({
      path: "/user/login",
      replace: true,
    });
    Message.success("注册成功，请登录！");
  } else {
    Message.error("注册失败，" + res.message);
  }
};
</script>
