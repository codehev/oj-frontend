<template>
  <!--  默认以文件名为组件名，使用ESLint时组件名只能多单词命名-->
  <div id="userLoginView">
    <h2 class="form-title">用户登录</h2>
    <a-form
      :model="form"
      @submit="handleSubmit"
      label-align="left"
      size="large"
      auto-label-width
      class="form-container"
    >
      <a-form-item field="userAccount" label="账号" :rules="accountRules">
        <a-input
          v-model="form.userAccount"
          placeholder="请输入账号..."
          class="input-field"
        />
      </a-form-item>
      <a-form-item field="userPassword" label="密码" :rules="passwordRules">
        <a-input-password
          v-model="form.userPassword"
          placeholder="请输入密码..."
          @keyup.enter="handleSubmit"
          class="input-field"
        />
      </a-form-item>
      <a-form-item field="autoLogin">
        <a-checkbox v-model="autoLogin"> 自动登录</a-checkbox>
        <div class="register-link">
          <a @click="ToRegister">没有账号？去注册</a>
        </div>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" class="submit-button"
          >登录</a-button
        >
      </a-form-item>

      <!-- 第三方登录 -->
      <div class="third-party-login">
        <div class="divider">
          <span>第三方账号登录</span>
        </div>
        <div class="login-buttons">
          <a-button @click="handleOAuthLogin('github')" class="github-button">
            <template #icon><icon-github /></template>
            GitHub登录
          </a-button>
          <a-button @click="handleOAuthLogin('gitee')" class="gitee-button">
            <template #icon><icon-code /></template>
            Gitee登录
          </a-button>
        </div>
      </div>
    </a-form>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref, defineComponent, h } from "vue";
import {
  UserControllerService,
  UserLoginRequest,
  OAuthControllerService,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import router from "@/router";
import { useStore } from "vuex";
import { IconGithub, IconCode } from "@arco-design/web-vue/es/icon";

const store = useStore();

const form = reactive({
  userAccount: "",
  userPassword: "",
} as UserLoginRequest);

let autoLogin = ref(false);

const accountRules = [
  { required: true, message: "账号为必填字段" },
  { minLength: 4, message: "账号长度不低于4位字符" },
];

const passwordRules = [
  { required: true, message: "密码为必填字段" },
  { minLength: 8, message: "密码长度不低于8位字符" },
];

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
  if (errors) return;
  const res = await UserControllerService.userLoginUsingPost(form);
  if (res.code === 0) {
    // alert(res.data);

    //获取并保存用户信息，可以发起请求获取登录信息，也可以直接使用登录时响应的用户信息再保存
    await store.dispatch("user/getLoginUser");
    //登录成功后返回之前的页面或直接固定返回主页
    const urlParams = new URL(window.location.href).searchParams;
    await router.push({
      path: urlParams.get("redirect") || "/",
      replace: true, //不保留当前页面的历史记录，无法其他页面back回去
    });
  } else {
    message.error("登录失败!" + res.message);
  }
};

/**
 * 第三方登录处理
 * @param source 登录来源 (github, gitee 等)
 */
const handleOAuthLogin = async (source: string) => {
  try {
    const res = await OAuthControllerService.renderAuthUsingGet(source);

    if (res.code === 0 && res.data) {
      // 跳转到第三方授权页面
      window.location.href = res.data;
    } else {
      message.error("获取授权链接失败：" + res.message);
    }
  } catch (error) {
    message.error("获取授权链接失败：" + (error as Error).message);
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

.register-link {
  width: 70%;
  text-align: right;
  cursor: pointer;
  color: #1677ff;
}

.submit-button {
  width: 380px;
}

/* 第三方登录样式 */
.third-party-login {
  margin-top: 24px;
  text-align: center;
}

.divider {
  position: relative;
  margin: 16px 0;
  text-align: center;
}

.divider::before,
.divider::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background-color: #e5e6eb;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.divider span {
  display: inline-block;
  padding: 0 10px;
  background-color: white;
  position: relative;
  z-index: 1;
  color: #86909c;
  font-size: 14px;
}

.login-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
}

.github-button,
.gitee-button {
  min-width: 120px;
}

.gitee-button {
  color: #fff;
  background-color: #c71d23;
  border-color: #c71d23;
}

.gitee-button:hover {
  background-color: #e13035;
  border-color: #e13035;
}
</style>
