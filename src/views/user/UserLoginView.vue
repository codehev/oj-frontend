<template>
  <!--  默认以文件名为组件名，使用ESLint时组件名只能多单词命名-->
  <div id="userLoginView" class="auth-container">
    <div class="decoration-lines"></div>
    <div class="floating-elements">
      <div class="floating-element"></div>
      <div class="floating-element"></div>
      <div class="floating-element"></div>
      <div class="floating-element"></div>
      <div class="floating-element"></div>
      <div class="floating-element"></div>
    </div>
    <div class="tech-circles">
      <div class="tech-circle"></div>
      <div class="tech-circle"></div>
      <div class="tech-circle"></div>
    </div>
    <div class="binary-code">
      <span
        v-for="(digit, index) in binaryDigits"
        :key="index"
        class="binary-digit"
        :style="getBinaryStyle(index)"
        >{{ digit }}</span
      >
    </div>
    <div class="auth-card">
      <div class="auth-header">
        <h2 class="auth-title" data-text="用户登录">用户登录</h2>
        <p class="auth-subtitle">欢迎回来，请登录您的账号</p>
      </div>

      <!-- 登录方式切换 -->
      <div class="auth-tabs">
        <a-radio-group v-model="loginType" type="button">
          <a-radio value="password">账号密码</a-radio>
          <a-radio value="email-code">邮箱验证码</a-radio>
        </a-radio-group>
      </div>

      <!-- 账号/邮箱密码登录表单 -->
      <a-form
        v-if="loginType === 'password'"
        :model="passwordForm"
        @submit="handlePasswordSubmit"
        label-align="left"
        size="large"
        auto-label-width
        class="auth-form"
      >
        <a-form-item field="account" :rules="accountRules">
          <template #label>
            <span class="form-label">账号/邮箱</span>
          </template>
          <a-input
            v-model="passwordForm.account"
            placeholder="请输入账号或邮箱..."
            class="input-field"
          >
            <template #prefix>
              <icon-user />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item field="password" :rules="passwordRules">
          <template #label>
            <span class="form-label">密码</span>
          </template>
          <a-input-password
            v-model="passwordForm.password"
            placeholder="请输入密码..."
            @keyup.enter="handlePasswordSubmit"
            class="input-field"
          >
            <template #prefix>
              <icon-lock />
            </template>
          </a-input-password>
        </a-form-item>
        <div class="auth-options">
          <a-checkbox v-model="autoLogin">自动登录</a-checkbox>
          <a class="forget-link">忘记密码？</a>
        </div>
        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            class="submit-button"
            :loading="loading"
          >
            登录
          </a-button>
        </a-form-item>
        <div class="auth-redirect">
          <span>没有账号？</span>
          <a @click="ToRegister" class="redirect-link">立即注册</a>
        </div>

        <!-- 第三方登录 -->
        <div class="third-party-login">
          <div class="divider">
            <span>第三方账号登录</span>
          </div>
          <div class="social-buttons">
            <a-button
              @click="handleOAuthLogin('github')"
              class="social-button github-button"
            >
              <template #icon>
                <icon-github />
              </template>
              GitHub
            </a-button>
            <a-button
              @click="handleOAuthLogin('gitee')"
              class="social-button gitee-button"
            >
              <template #icon>
                <icon-code />
              </template>
              Gitee
            </a-button>
          </div>
        </div>
      </a-form>

      <!-- 邮箱验证码登录表单 -->
      <a-form
        v-else
        :model="emailCodeForm"
        @submit="handleEmailCodeSubmit"
        label-align="left"
        size="large"
        auto-label-width
        class="auth-form"
      >
        <a-form-item field="email" :rules="emailRules">
          <template #label>
            <span class="form-label">邮箱</span>
          </template>
          <a-input
            v-model="emailCodeForm.email"
            placeholder="请输入邮箱..."
            class="input-field"
          >
            <template #prefix>
              <icon-email />
            </template>
          </a-input>
        </a-form-item>

        <!-- 验证码输入 -->
        <a-form-item field="code" :rules="codeRules">
          <template #label>
            <span class="form-label">验证码</span>
          </template>
          <div class="verification-code">
            <a-input
              v-model="emailCodeForm.code"
              placeholder="请输入验证码"
              class="code-input"
            >
              <template #prefix>
                <icon-safe />
              </template>
            </a-input>
            <a-button
              :disabled="codeSending || countdown > 0"
              @click="sendVerificationCode"
              class="get-code-btn"
              :loading="codeSending"
            >
              {{ countdown > 0 ? `${countdown}秒后重新获取` : "获取验证码" }}
            </a-button>
          </div>
        </a-form-item>

        <div class="auth-options">
          <a-checkbox v-model="autoLogin">自动登录</a-checkbox>
        </div>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            class="submit-button"
            :loading="loading"
          >
            登录
          </a-button>
        </a-form-item>

        <div class="auth-redirect">
          <span>没有账号？</span>
          <a @click="ToRegister" class="redirect-link">立即注册</a>
        </div>

        <!-- 第三方登录 -->
        <div class="third-party-login">
          <div class="divider">
            <span>第三方账号登录</span>
          </div>
          <div class="social-buttons">
            <a-button
              @click="handleOAuthLogin('github')"
              class="social-button github-button"
            >
              <template #icon>
                <icon-github />
              </template>
              GitHub
            </a-button>
            <a-button
              @click="handleOAuthLogin('gitee')"
              class="social-button gitee-button"
            >
              <template #icon>
                <icon-code />
              </template>
              Gitee
            </a-button>
          </div>
        </div>
      </a-form>
    </div>
  </div>
</template>
<script setup lang="ts">
import { reactive, ref, onUnmounted, onMounted } from "vue";
import {
  UserControllerService,
  UserLoginRequest,
  OAuthControllerService,
  EmailLoginRequest,
  SendEmailCodeRequest,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import router from "@/router";
import { useStore } from "vuex";
import {
  IconGithub,
  IconCode,
  IconUser,
  IconLock,
  IconEmail,
  IconSafe,
} from "@arco-design/web-vue/es/icon";

// 二进制数字动画效果
const binaryDigits = ref<string[]>([]);

onMounted(() => {
  // 生成随机二进制数字
  const digits = [];
  for (let i = 0; i < 40; i++) {
    digits.push(Math.random() > 0.5 ? "1" : "0");
  }
  binaryDigits.value = digits;

  // 定期更新一些数字
  setInterval(() => {
    const newDigits = [...binaryDigits.value];
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * newDigits.length);
      newDigits[randomIndex] = Math.random() > 0.5 ? "1" : "0";
    }
    binaryDigits.value = newDigits;
  }, 2000);
});

// 获取二进制数字样式
const getBinaryStyle = (index: number) => {
  const leftPos = Math.random() * 95;
  const topPos = Math.random() * 95;
  const opacity = Math.random() * 0.3 + 0.1;
  const size = Math.random() * 8 + 10;
  const animationDelay = Math.random() * 5;

  return {
    left: `${leftPos}%`,
    top: `${topPos}%`,
    opacity: opacity,
    fontSize: `${size}px`,
    animationDelay: `${animationDelay}s`,
  };
};

const store = useStore();

// 登录方式
const loginType = ref("password");

// 加载状态
const loading = ref(false);

// 账号/邮箱密码登录表单
const passwordForm = reactive({
  account: "",
  password: "",
});

// 邮箱验证码登录表单
const emailCodeForm = reactive({
  email: "",
  code: "",
} as EmailLoginRequest);

let autoLogin = ref(false);

// 验证码发送状态
const codeSending = ref(false);
const countdown = ref(0);
let timer: number | null = null;

// 表单验证规则
const accountRules = [{ required: true, message: "账号/邮箱为必填字段" }];

const passwordRules = [
  { required: true, message: "密码为必填字段" },
  { minLength: 8, message: "密码长度不低于8位字符" },
];

const emailRules = [
  { required: true, message: "邮箱为必填字段" },
  {
    match: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
    message: "请输入正确的邮箱格式",
  },
];

const codeRules = [
  { required: true, message: "验证码为必填字段" },
  { minLength: 6, maxLength: 6, message: "验证码为6位数字" },
];

/**
 * 跳转到注册页面
 */
const ToRegister = () => {
  // 强制刷新注册页面，解决空白问题
  router
    .push({
      path: "/user/register",
      replace: true,
    })
    .then(() => {
      // 确保DOM已更新后刷新
      setTimeout(() => {
        window.location.reload();
      }, 100);
    });
};

/**
 * 账号/邮箱密码登录处理
 */
const handlePasswordSubmit = async ({ values, errors }: any) => {
  if (errors) return;

  // 检查必要的字段
  if (!passwordForm.account) {
    message.error("请输入账号或邮箱");
    return;
  }

  if (!passwordForm.password) {
    message.error("请输入密码");
    return;
  }

  loading.value = true;

  try {
    // 判断输入的是邮箱还是账号
    const isEmail = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(
      passwordForm.account
    );

    let res;
    if (isEmail) {
      // 使用邮箱登录
      const emailLoginRequest: EmailLoginRequest = {
        email: passwordForm.account,
        password: passwordForm.password,
      };
      res = await UserControllerService.emailLoginUsingPost(emailLoginRequest);
    } else {
      // 使用账号登录
      const userLoginRequest: UserLoginRequest = {
        userAccount: passwordForm.account,
        userPassword: passwordForm.password,
      };
      res = await UserControllerService.userLoginUsingPost(userLoginRequest);
    }

    if (res.code === 0) {
      await store.dispatch("user/getLoginUser");
      message.success("登录成功");
      const urlParams = new URL(window.location.href).searchParams;
      await router.push({
        path: urlParams.get("redirect") || "/",
        replace: true,
      });
    } else {
      message.error("登录失败!" + res.message);
    }
  } catch (error) {
    message.error("登录失败: " + (error as Error).message);
  } finally {
    loading.value = false;
  }
};

/**
 * 邮箱验证码登录处理
 */
const handleEmailCodeSubmit = async ({ values, errors }: any) => {
  if (errors) return;

  // 检查必要的字段
  if (!emailCodeForm.email) {
    message.error("请输入邮箱地址");
    return;
  }

  if (!emailCodeForm.code) {
    message.error("请输入验证码");
    return;
  }

  loading.value = true;

  try {
    const res = await UserControllerService.emailLoginUsingPost(emailCodeForm);
    if (res.code === 0) {
      await store.dispatch("user/getLoginUser");
      message.success("登录成功");
      const urlParams = new URL(window.location.href).searchParams;
      await router.push({
        path: urlParams.get("redirect") || "/",
        replace: true,
      });
    } else {
      message.error("登录失败!" + res.message);
    }
  } catch (error) {
    message.error("登录失败: " + (error as Error).message);
  } finally {
    loading.value = false;
  }
};

/**
 * 发送邮箱验证码
 */
const sendVerificationCode = async () => {
  if (!emailCodeForm.email) {
    message.error("请输入邮箱地址");
    return;
  }

  if (codeSending.value || countdown.value > 0) {
    return;
  }

  codeSending.value = true;

  try {
    const sendEmailCodeRequest: SendEmailCodeRequest = {
      email: emailCodeForm.email,
      type: "login",
    };

    const res = await UserControllerService.sendEmailCodeUsingPost(
      sendEmailCodeRequest
    );

    if (res.code === 0) {
      message.success("验证码已发送，请查收");
      countdown.value = 60; // 60秒倒计时

      // 设置倒计时
      timer = window.setInterval(() => {
        if (countdown.value > 0) {
          countdown.value -= 1;
        } else {
          clearInterval(timer as number);
          timer = null;
        }
      }, 1000);
    } else {
      message.error("验证码发送失败: " + res.message);
    }
  } catch (error) {
    message.error("验证码发送失败: " + (error as Error).message);
  } finally {
    codeSending.value = false;
  }
};

/**
 * 第三方登录处理
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

// 组件卸载时清除定时器
onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
});
</script>
<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;
  width: 100%;
  overflow-y: auto;
  position: relative;
  z-index: 2;
  background: linear-gradient(
    135deg,
    rgba(248, 250, 252, 0.8) 0%,
    rgba(238, 242, 255, 0.9) 100%
  );
}

/* 添加顶部的几何图形装饰 */
.auth-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.08) 0%,
    rgba(99, 102, 241, 0.12) 100%
  );
  clip-path: polygon(0 0, 100% 0, 100% 70%, 0 100%);
  z-index: -1;
  pointer-events: none;
}

/* 添加右上角的圆形装饰 */
.auth-container::after {
  content: "";
  position: absolute;
  top: 40px;
  right: 5%;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(59, 130, 246, 0.1) 0%,
    rgba(59, 130, 246, 0) 70%
  );
  z-index: -1;
  animation: pulse 10s infinite alternate;
  pointer-events: none;
}

/* 添加左侧的装饰线条 */
.auth-container .decoration-lines {
  position: absolute;
  top: 20%;
  left: 10%;
  width: 150px;
  height: 150px;
  border-left: 2px solid rgba(59, 130, 246, 0.15);
  border-bottom: 2px solid rgba(59, 130, 246, 0.15);
  z-index: -1;
  transform: rotate(-45deg);
  opacity: 0.8;
  animation: rotate 20s linear infinite;
  pointer-events: none;
}

/* 添加科技感圆环 */
.tech-circles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}

.tech-circle {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(59, 130, 246, 0.1);
  animation: tech-circle-pulse 8s infinite ease-in-out;
}

.tech-circle:nth-child(1) {
  width: 200px;
  height: 200px;
  top: 20%;
  right: 15%;
  border-width: 2px;
  animation-delay: 0s;
}

.tech-circle:nth-child(2) {
  width: 400px;
  height: 400px;
  bottom: 10%;
  left: 5%;
  border-width: 1px;
  animation-delay: 2s;
}

.tech-circle:nth-child(3) {
  width: 300px;
  height: 300px;
  top: 5%;
  left: 20%;
  border-width: 1.5px;
  animation-delay: 4s;
}

@keyframes tech-circle-pulse {
  0% {
    transform: scale(1);
    opacity: 0.3;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.1;
  }
  100% {
    transform: scale(1);
    opacity: 0.3;
  }
}

/* 二进制数字背景 */
.binary-code {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
}

.binary-digit {
  position: absolute;
  font-family: "Courier New", monospace;
  color: rgba(59, 130, 246, 0.15);
  animation: binary-fade 8s infinite ease-in-out;
  pointer-events: none;
}

@keyframes binary-fade {
  0% {
    opacity: 0.1;
  }
  50% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.1;
  }
}

/* 添加浮动的科技元素 */
.floating-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;
}

.floating-element {
  position: absolute;
  background-color: rgba(59, 130, 246, 0.1);
  border-radius: 4px;
  transform-origin: center;
  animation: float 15s ease-in-out infinite alternate;
}

.floating-element:nth-child(1) {
  top: 15%;
  left: 15%;
  width: 40px;
  height: 40px;
  animation-delay: 0s;
}

.floating-element:nth-child(2) {
  top: 25%;
  right: 15%;
  width: 60px;
  height: 60px;
  animation-delay: 2s;
}

.floating-element:nth-child(3) {
  bottom: 30%;
  left: 20%;
  width: 30px;
  height: 30px;
  animation-delay: 4s;
}

.floating-element:nth-child(4) {
  bottom: 40%;
  right: 25%;
  width: 50px;
  height: 20px;
  animation-delay: 6s;
}

.floating-element:nth-child(5) {
  top: 45%;
  left: 30%;
  width: 20px;
  height: 20px;
  animation-delay: 8s;
}

.floating-element:nth-child(6) {
  top: 60%;
  right: 20%;
  width: 35px;
  height: 35px;
  animation-delay: 10s;
}

@keyframes float {
  0% {
    transform: translate(0, 0) rotate(0deg);
  }
  50% {
    transform: translate(15px, -15px) rotate(5deg);
  }
  100% {
    transform: translate(-10px, 10px) rotate(-5deg);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 0.6;
  }
}

@keyframes rotate {
  0% {
    transform: rotate(-45deg);
  }
  100% {
    transform: rotate(315deg);
  }
}

.auth-card {
  width: 100%;
  max-width: 460px;
  min-height: 580px; /* 固定最小高度 */
  height: auto;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
  padding: 30px;
  transition: all 0.4s ease;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(59, 130, 246, 0.15);
  overflow: hidden;
  position: relative;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  z-index: 1;
}

/* 卡片内部的蓝图网格 */
.auth-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(
      rgba(59, 130, 246, 0.05) 1px,
      transparent 1px
    ),
    linear-gradient(90deg, rgba(59, 130, 246, 0.05) 1px, transparent 1px);
  background-size: 20px 20px;
  z-index: -1;
  pointer-events: none;
}

/* 边框发光效果 */
.auth-card::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 16px;
  padding: 1px;
  background: linear-gradient(
    45deg,
    rgba(59, 130, 246, 0) 0%,
    rgba(59, 130, 246, 0.3) 50%,
    rgba(59, 130, 246, 0) 100%
  );
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  animation: borderGlow 4s linear infinite;
  pointer-events: none;
}

@keyframes borderGlow {
  0% {
    background-position: 0% 0%;
  }
  100% {
    background-position: 300% 0%;
  }
}

.auth-header {
  text-align: center;
  margin-bottom: 24px;
}

.auth-title {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 8px;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  letter-spacing: 0.5px;
  filter: drop-shadow(0 0 2px rgba(59, 130, 246, 0.5));
  position: relative;
}

.auth-title::after {
  content: attr(data-text);
  position: absolute;
  left: 0;
  top: 0;
  z-index: -1;
  background: none;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  filter: blur(8px);
  opacity: 0.5;
}

.auth-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.auth-tabs {
  margin-bottom: 24px;
  text-align: center;
}

.auth-form {
  margin-bottom: 0;
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-label {
  font-weight: 600;
  color: #334155;
  font-size: 14px;
  display: block;
  margin-bottom: 4px;
}

.input-field {
  border-radius: 8px;
  height: 42px;
  transition: all 0.3s;
  border: 1px solid rgba(59, 130, 246, 0.25);
  background-color: rgba(255, 255, 255, 0.8);
  color: #334155;
}

.auth-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  color: #64748b;
}

.forget-link {
  color: #3b82f6;
  transition: color 0.3s;
}

.forget-link:hover {
  color: #2563eb;
  text-decoration: none;
}

.submit-button {
  width: 100%;
  height: 42px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 8px;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  border: none;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.submit-button::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: all 0.6s;
}

.submit-button:hover::before {
  left: 100%;
}

.auth-redirect {
  text-align: center;
  margin: 16px 0;
  font-size: 14px;
  color: #64748b;
}

.redirect-link {
  color: #3b82f6;
  font-weight: 600;
  cursor: pointer;
  margin-left: 4px;
  transition: color 0.3s, text-shadow 0.3s;
}

.redirect-link:hover {
  color: #2563eb;
  text-shadow: 0 0 5px rgba(59, 130, 246, 0.3);
  text-decoration: none;
}

.third-party-login {
  margin-top: auto;
  padding-top: 16px;
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
  background-color: rgba(59, 130, 246, 0.15);
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
  background-color: rgba(255, 255, 255, 0.9);
  position: relative;
  z-index: 1;
  color: #64748b;
  font-size: 14px;
}

.social-buttons {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
}

.social-button {
  flex: 1;
  max-width: 180px;
  border-radius: 8px;
  height: 40px;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  font-weight: 500;
  background-color: rgba(245, 247, 250, 0.8);
  border: 1px solid rgba(59, 130, 246, 0.15);
  color: #334155;
}

.social-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
  background-color: rgba(255, 255, 255, 0.95);
}

.github-button,
.gitee-button {
  position: relative;
  overflow: hidden;
}

.verification-code {
  display: flex;
  width: 100%;
}

.code-input {
  flex: 1;
  margin-right: 12px;
  border-radius: 8px;
}

.get-code-btn {
  min-width: 120px;
  white-space: nowrap;
  border-radius: 8px;
  height: 42px;
  transition: all 0.3s;
  background-color: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

.get-code-btn:not(:disabled):hover {
  background-color: rgba(59, 130, 246, 0.15);
}

/* 响应式调整 */
@media (max-width: 576px) {
  .auth-card {
    padding: 24px 20px;
    min-height: 520px;
  }

  .auth-title {
    font-size: 24px;
  }

  .social-buttons {
    flex-direction: column;
    gap: 10px;
  }

  .social-button {
    max-width: 100%;
  }

  .floating-element,
  .tech-circle,
  .binary-digit {
    display: none;
  }
}

/* 确保内容在一屏内显示的优化 */
@media (max-height: 700px) {
  .auth-card {
    padding: 20px;
    min-height: 520px;
  }

  .auth-header {
    margin-bottom: 16px;
  }

  .auth-title {
    font-size: 24px;
    margin-bottom: 4px;
  }

  .auth-tabs {
    margin-bottom: 16px;
  }

  .input-field,
  .submit-button,
  .get-code-btn {
    height: 38px;
  }

  .auth-options {
    margin-bottom: 16px;
  }

  .third-party-login {
    padding-top: 8px;
  }

  .social-button {
    height: 36px;
  }
}
</style>
