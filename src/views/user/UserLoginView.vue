<template>
  <!--  默认以文件名为组件名，使用ESLint时组件名只能多单词命名-->
  <div id="userLoginView">
    <h2 style="margin-bottom: 16px">用户登录</h2>
    <a-form
      :model="form"
      @submit="handleSubmit"
      label-align="left"
      auto-label-width
      style="max-width: 480px; margin: 0 auto"
    >
      <a-form-item
        field="userAccount"
        tooltip="账号长度不低于4位字符"
        label="账号"
        :show-colon="true"
        :rules="[
          { required: true, message: '账号为必填字段' },
          { minLength: 4, message: '账号长度不低于4位字符' },
        ]"
        :validate-trigger="['change', 'input']"
      >
        <a-input v-model="form.userAccount" placeholder="请输入账号..." />
      </a-form-item>
      <a-form-item
        field="userPassword"
        tooltip="密码长度不低于8字符"
        label="密码"
        :show-colon="true"
        :rules="[
          { required: true, message: '密码为必填字段' },
          { minLength: 8, message: '密码长度不低于8位字符' },
        ]"
        :validate-trigger="['change', 'input']"
      >
        <a-input-password
          v-model="form.userPassword"
          placeholder="请输入密码..."
          @keyup.enter="handleSubmit"
        />
      </a-form-item>
      <a-form-item field="autoLogin" style="text-aligt: center">
        <a-checkbox v-model="autoLogin"> 自动登录</a-checkbox>
        <div style="width: 70%; text-align: right">
          <a style="cursor: pointer; color: #1677ff" @click="ToRegister"
            >没有账号？去注册</a
          >
        </div>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 120px"
          >登录
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref } from "vue";
import { UserControllerService, UserLoginRequest } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import router from "@/router";
import { useStore } from "vuex";

const store = useStore();

const form = reactive({
  userAccount: "",
  userPassword: "",
} as UserLoginRequest);

let autoLogin = ref(false);

/**
 * 跳转到注册页面
 * @constructor
 */
const ToRegister = () => {
  router.push({
    path: "/user/register",
    replace: true,
  });
};
/**
 * 注册
 * @param values
 * @param errors
 */
const handleSubmit = async ({ values, errors }: any) => {
  // console.log(data);
  // alert(JSON.stringify(data.value));
  // await UserControllerService.userLoginUsingPost(data.value);
  if (errors != undefined && Object.keys(errors).length > 0) {
    return;
  }
  const res = await UserControllerService.userLoginUsingPost(form);
  if (res.code === 0) {
    // alert(res.data);

    //获取并保存用户信息，可以发起请求获取登录信息，也可以直接使用登录时响应的用户信息再保存
    await store.dispatch("user/getLoginUser");
    //登录成功后返回之前的页面或直接固定返回主页
    router.push({
      path: "/",
      replace: true, //不保留当前页面的历史记录，无法其他页面back回去
    });
  } else {
    message.error("登录失败!" + res.message);
  }
};
</script>
<style scoped></style>
