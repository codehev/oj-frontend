<template>
  <div class="oauth-result-container">
    <div v-if="success" class="success-container">
      <a-result status="success" title="登录成功">
        <template #extra>
          <a-button type="primary" @click="goToHome">返回首页</a-button>
        </template>
      </a-result>
    </div>
    <div v-else class="error-container">
      <a-result status="error" :title="errorMessage">
        <template #extra>
          <a-button @click="goToLogin">返回登录</a-button>
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
const success = ref(route.path === "/user/oauth/success");
const errorMessage = ref("登录失败");

const goToHome = () => {
  router.push("/");
};

const goToLogin = () => {
  router.push("/user/login");
};

onMounted(() => {
  // 处理错误消息
  if (route.query.message) {
    const message = route.query.message;
    errorMessage.value = Array.isArray(message)
      ? String(message[0])
      : String(message);
  }

  // 如果是登录成功页面，检查URL参数中的token
  if (success.value) {
    const token = route.query.token;
    if (token) {
      // 保存token到localStorage
      localStorage.setItem(
        "token",
        Array.isArray(token) ? String(token[0]) : String(token)
      );

      // 获取当前登录用户信息
      store.dispatch("user/getLoginUser");

      // 3秒后自动跳转到首页
      setTimeout(() => {
        goToHome();
      }, 3000);
    } else {
      success.value = false;
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
