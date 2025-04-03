<template>
  <div class="oauth-result-container">
    <div v-if="isSuccess" class="success-container">
      <a-result status="success" :title="successMessage">
        <template #extra>
          <a-button
            v-if="optionType == 'login'"
            type="primary"
            @click="goToHome"
            >返回首页 ({{ countDown }}s)</a-button
          >
          <a-button v-else @click="router.back()"
            >返回 ({{ countDown }}s)</a-button
          >
        </template>
      </a-result>
    </div>
    <div v-else class="error-container">
      <a-result status="error" :title="errorMessage">
        <template #extra>
          <a-button v-if="optionType == 'login'" @click="goToLogin"
            >返回登录</a-button
          >
          <a-button v-else @click="router.back()">返回</a-button>
        </template>
      </a-result>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";

const router = useRouter();
const route = useRoute();
const store = useStore();

const isSuccess = ref(route.path === "/user/oauth/success");
const optionType = ref(route.query.type);
const token = route.query.token;
const message = route.query.message;
const errorMessage = ref(optionType.value == "login" ? "登录失败" : "绑定失败");
const successMessage = ref(
  optionType.value == "login" ? "登录成功" : "绑定成功"
);
const countDown = ref(3); // 倒计时变量，从3开始

const goToHome = () => {
  router.push("/");
};

const goToLogin = () => {
  router.push("/user/login");
};

onMounted(() => {
  // 处理错误消息
  if (message) {
    errorMessage.value = Array.isArray(message)
      ? String(message[0])
      : String(message);
  }

  // 如果是成功页面，检查URL参数中的token
  if (isSuccess.value) {
    if (token) {
      // 保存token到localStorage
      localStorage.setItem(
        "token",
        Array.isArray(token) ? String(token[0]) : String(token)
      );

      // 获取当前登录用户信息
      store.dispatch("user/getLoginUser");

      // 设置倒计时
      const timer = setInterval(() => {
        countDown.value--;
        if (countDown.value <= 0) {
          clearInterval(timer);
          // 倒计时结束后自动跳转
          if (optionType.value == "login") goToHome();
          else router.back();
        }
      }, 1000);
    } else {
      isSuccess.value = false;
      errorMessage.value = "Token不存在";
    }
  }
});
</script>

<style scoped>
.oauth-result-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
