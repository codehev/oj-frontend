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
      <a-form-item field="userAccount" label="账号：">
        <a-input v-model="form.userAccount" placeholder="请输入账号..." />
      </a-form-item>
      <a-form-item
        field="userPassword"
        tooltip="密码长度不低于4位数"
        label="密码："
      >
        <a-input-password
          v-model="form.userPassword"
          placeholder="请输入密码..."
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" style="width: 120px"
          >登录</a-button
        >
      </a-form-item>
    </a-form>
  </div>
</template>
<script setup lang="ts">
import { reactive } from "vue";
import { UserControllerService, UserLoginRequest } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import router from "@/router";
import { useStore } from "vuex";

const store = useStore();

const form = reactive({
  userAccount: "",
  userPassword: "",
} as UserLoginRequest);
const handleSubmit = async (data: any) => {
  // console.log(data);
  // alert(JSON.stringify(data.value));
  // await UserControllerService.userLoginUsingPost(data.value);
  const res = await UserControllerService.userLoginUsingPost(form);
  if (res.code === 0) {
    // alert(res.data);

    //获取并保存用户信息，可以发起请求获取登录信息，也可以直接使用登录时响应的用户信息再保存
    await store.dispatch("user/getLoginUser");
    //登录成功后返回之前的页面或直接固定返回主页
    router.push({
      path: "/home",
      replace: true, //不保留当前页面的历史记录，无法其他页面back回去
    });
  } else {
    message.error("登录失败!" + res.message);
  }
};
</script>
<style scoped></style>
