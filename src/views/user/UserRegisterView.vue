<template>
  <div id="userRegister" class="auth-container">
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
        <h2 class="auth-title" data-text="用户注册">用户注册</h2>
        <p class="auth-subtitle">创建您的账号，开始您的编程之旅</p>
      </div>

      <!-- 注册方式切换 -->
      <div class="auth-tabs">
        <a-radio-group v-model="registerType" type="button">
          <a-radio value="account">账号注册</a-radio>
          <a-radio value="email">邮箱注册</a-radio>
        </a-radio-group>
      </div>

      <!-- 账号注册表单 -->
      <a-form
        v-if="registerType === 'account'"
        ref="registerFormRefAccount"
        :model="registerForm"
        @submit="handleRegister"
        label-align="left"
        size="large"
        auto-label-width
        class="auth-form"
      >
        <a-form-item
          field="userAccount"
          :rules="userAccountRules"
          :validate-trigger="['change', 'blur']"
        >
          <template #label>
            <span class="form-label">账号</span>
          </template>
          <a-input
            v-model="registerForm.userAccount"
            placeholder="请输入账号..."
            class="input-field"
          >
            <template #prefix>
              <icon-user />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item
          field="userPassword"
          :rules="passwordRules"
          :validate-trigger="['change', 'blur']"
        >
          <template #label>
            <span class="form-label">密码</span>
          </template>
          <a-input-password
            v-model="registerForm.userPassword"
            placeholder="请输入密码..."
            class="input-field"
          >
            <template #prefix>
              <icon-lock />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item
          field="confirm"
          :rules="confirmRules"
          :validate-trigger="['change', 'blur']"
        >
          <template #label>
            <span class="form-label">确认密码</span>
          </template>
          <a-input-password
            v-model="registerForm.confirm"
            placeholder="请再次输入密码..."
            class="input-field"
          >
            <template #prefix>
              <icon-check />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            class="submit-button"
            :loading="loading"
          >
            注册
          </a-button>
        </a-form-item>
        <div class="auth-redirect">
          <span>已有账号？</span>
          <a @click="ToLogin" class="redirect-link">立即登录</a>
        </div>
      </a-form>

      <!-- 邮箱注册表单 -->
      <a-form
        v-else
        ref="registerFormRefEmail"
        :model="emailRegisterForm"
        @submit="handleEmailRegister"
        label-align="left"
        size="large"
        auto-label-width
        class="auth-form"
      >
        <a-form-item
          field="email"
          :rules="emailRules"
          :validate-trigger="['change', 'blur']"
        >
          <template #label>
            <span class="form-label">邮箱</span>
          </template>
          <a-input
            v-model="emailRegisterForm.email"
            placeholder="请输入邮箱..."
            class="input-field"
          >
            <template #prefix>
              <icon-email />
            </template>
          </a-input>
        </a-form-item>

        <a-form-item
          field="code"
          :rules="codeRules"
          :validate-trigger="['change', 'blur']"
        >
          <template #label>
            <span class="form-label">验证码</span>
          </template>
          <div class="verification-code">
            <a-input
              v-model="emailRegisterForm.code"
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

        <a-form-item
          field="userPassword"
          :rules="passwordRules"
          :validate-trigger="['change', 'blur']"
        >
          <template #label>
            <span class="form-label">密码</span>
          </template>
          <a-input-password
            v-model="emailRegisterForm.userPassword"
            placeholder="请输入密码..."
            class="input-field"
          >
            <template #prefix>
              <icon-lock />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item
          field="confirm"
          :rules="emailConfirmRules"
          :validate-trigger="['change', 'blur']"
        >
          <template #label>
            <span class="form-label">确认密码</span>
          </template>
          <a-input-password
            v-model="emailRegisterForm.confirm"
            placeholder="请再次输入密码..."
            class="input-field"
          >
            <template #prefix>
              <icon-check />
            </template>
          </a-input-password>
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            class="submit-button"
            :loading="loading"
          >
            注册
          </a-button>
        </a-form-item>
        <div class="auth-redirect">
          <span>已有账号？</span>
          <a @click="ToLogin" class="redirect-link">立即登录</a>
        </div>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  UserControllerService,
  UserRegisterRequest,
  EmailRegisterRequest,
  SendEmailCodeRequest,
} from "../../../generated";
import { FormInstance } from "@arco-design/web-vue/es/form";
import { Message } from "@arco-design/web-vue";
import {
  IconUser,
  IconLock,
  IconCheck,
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

// 注册方式
const registerType = ref("account");

// 加载状态
const loading = ref(false);

// 验证码发送状态
const codeSending = ref(false);
const countdown = ref(0);
let timer: number | null = null;

// 账号注册表单
const registerForm = reactive({
  userAccount: "",
  userPassword: "",
  confirm: "",
});

// 邮箱注册表单
const emailRegisterForm = reactive({
  email: "",
  code: "",
  userPassword: "",
  confirm: "",
});

// 表单实例
const registerFormRefAccount = ref<FormInstance>();
const registerFormRefEmail = ref<FormInstance>();

// 路由
const router = useRouter();

// 跳转到登录页面
const ToLogin = () => {
  router.push({
    path: "/user/login",
    replace: true,
  });
};

// 账号验证规则
const userAccountRules = [
  { required: true, message: "账号为必填项" },
  { minLength: 4, message: "账号长度不能小于4位" },
];

// 密码验证规则
const passwordRules = [
  { required: true, message: "密码为必填项" },
  { minLength: 8, message: "密码长度不能小于8位" },
];

// 确认密码规则
const confirmRules = [
  { required: true, message: "请确认密码" },
  {
    validator: (value: string, callback: (error?: string) => void) => {
      if (value !== registerForm.userPassword) {
        callback("两次密码输入不一致");
      } else {
        callback();
      }
    },
  },
];

// 邮箱验证规则
const emailRules = [
  { required: true, message: "邮箱为必填项" },
  {
    match: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
    message: "请输入正确的邮箱格式",
  },
];

// 邮箱注册确认密码规则
const emailConfirmRules = [
  { required: true, message: "请确认密码" },
  {
    validator: (value: string, callback: (error?: string) => void) => {
      if (value !== emailRegisterForm.userPassword) {
        callback("两次密码输入不一致");
      } else {
        callback();
      }
    },
  },
];

// 验证码规则
const codeRules = [
  { required: true, message: "验证码为必填项" },
  { minLength: 6, maxLength: 6, message: "验证码为6位数字" },
];

// 发送验证码
const sendVerificationCode = async () => {
  if (!emailRegisterForm.email) {
    Message.error("请输入邮箱");
    return;
  }

  if (codeSending.value || countdown.value > 0) {
    return;
  }

  codeSending.value = true;

  try {
    const sendEmailCodeRequest: SendEmailCodeRequest = {
      email: emailRegisterForm.email,
      type: "register",
    };

    const res = await UserControllerService.sendEmailCodeUsingPost(
      sendEmailCodeRequest
    );

    if (res.code === 0) {
      Message.success("验证码已发送，请查收");
      countdown.value = 60; // 60秒倒计时

      // 设置倒计时
      timer = window.setInterval(() => {
        if (countdown.value > 0) {
          countdown.value -= 1;
        } else {
          if (timer) {
            clearInterval(timer);
            timer = null;
          }
        }
      }, 1000);
    } else {
      Message.error("验证码发送失败: " + res.message);
    }
  } catch (error) {
    Message.error("验证码发送失败: " + (error as Error).message);
  } finally {
    codeSending.value = false;
  }
};

// 使用账号注册
const handleRegister = async ({ values, errors }: any) => {
  if (errors) {
    return;
  }

  loading.value = true;

  try {
    const userRegisterRequest: UserRegisterRequest = {
      userAccount: registerForm.userAccount,
      userPassword: registerForm.userPassword,
      checkPassword: registerForm.confirm,
    };

    const res = await UserControllerService.userRegisterUsingPost(
      userRegisterRequest
    );

    if (res.code === 0) {
      Message.success("注册成功");
      router.push({
        path: "/user/login",
        replace: true,
      });
    } else {
      Message.error("注册失败: " + res.message);
    }
  } catch (error) {
    Message.error("注册失败: " + (error as Error).message);
  } finally {
    loading.value = false;
  }
};

// 使用邮箱注册
const handleEmailRegister = async ({ values, errors }: any) => {
  if (errors) {
    return;
  }

  loading.value = true;

  try {
    const emailRegisterRequest: EmailRegisterRequest = {
      email: emailRegisterForm.email,
      code: emailRegisterForm.code,
      password: emailRegisterForm.userPassword,
      checkPassword: emailRegisterForm.confirm,
    };

    const res = await UserControllerService.emailRegisterUsingPost(
      emailRegisterRequest
    );

    if (res.code === 0) {
      Message.success("注册成功");
      router.push({
        path: "/user/login",
        replace: true,
      });
    } else {
      Message.error("注册失败: " + res.message);
    }
  } catch (error) {
    Message.error("注册失败: " + (error as Error).message);
  } finally {
    loading.value = false;
  }
};
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
  min-height: 580px;
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

/* 验证码样式 */
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

/* 修复表单验证星号与标签的对齐问题 */
:global(.arco-form-item-label-col) {
  display: flex;
  align-items: center;
}

:global(.arco-form-item-label) {
  display: flex;
  align-items: center;
}

:global(.arco-form-item-required-symbol) {
  margin-right: 4px;
  display: inline-flex;
  align-items: center;
  color: rgba(239, 68, 68, 0.9); /* 调整必填星号颜色 */
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
}

/* 当屏幕高度非常小时的额外优化 */
@media (max-height: 600px) {
  .auth-card {
    min-height: 480px;
    padding: 16px;
  }

  .auth-header {
    margin-bottom: 12px;
  }

  .auth-title {
    font-size: 22px;
  }

  .auth-subtitle {
    font-size: 12px;
  }

  .auth-tabs {
    margin-bottom: 12px;
  }

  .input-field,
  .submit-button,
  .get-code-btn {
    height: 36px;
  }
}
</style>
