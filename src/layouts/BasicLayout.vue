<template>
  <div id="basicLayout">
    <a-layout class="layout-container">
      <!-- 固定在顶部的header -->
      <a-layout-header class="header">
        <HeaderComponent />
      </a-layout-header>

      <!-- 内容区域与header保持适当距离 -->
      <div class="header-placeholder"></div>

      <!-- 内容区域 -->
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <!-- 页脚 -->
      <a-layout-footer class="footer">
        <FooterComponent />
      </a-layout-footer>
    </a-layout>

    <!-- 回到顶部按钮 -->
    <div
      class="back-to-top"
      :class="{ visible: showBackToTop }"
      @click="scrollToTop"
    >
      <icon-arrow-up />
    </div>
  </div>
</template>

<script setup lang="ts">
import HeaderComponent from "@/components/header/HeaderComponent.vue";
import FooterComponent from "@/components/footer/FooterComponent.vue";
import { ref, onMounted, onUnmounted } from "vue";
import { IconArrowUp } from "@arco-design/web-vue/es/icon";

// 控制回到顶部按钮显示
const showBackToTop = ref(false);

// 监听滚动事件，控制回到顶部按钮显示
const handleScroll = () => {
  showBackToTop.value = window.scrollY > 200;
};

// 回到顶部
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

// 生命周期钩子
onMounted(() => {
  // 添加滚动监听
  window.addEventListener("scroll", handleScroll);
});

// 组件卸载时移除事件监听
onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-1);
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;
  background: var(--color-bg-2);
  box-shadow: 0 1px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-bottom: 1px solid var(--color-border-2);
  backdrop-filter: blur(8px);
}

/* 占位元素，防止内容被固定header遮挡 */
.header-placeholder {
  height: 60px;
}

.content {
  flex: 1;
  padding: 24px 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--color-bg-1);
}

.content-wrapper {
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  padding: 0 20px;
  min-height: calc(100vh - 160px); /* 确保短内容页面也有足够高度 */
}

.footer {
  background: var(--color-bg-2);
  border-top: 1px solid var(--color-border-2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 0;
}

/* 路由切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 回到顶部按钮 */
.back-to-top {
  position: fixed;
  right: 24px;
  bottom: 32px;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background-color: rgb(var(--primary-6));
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(var(--primary-6), 0.3);
  opacity: 0;
  transform: translateY(20px) scale(0.9);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 99;
}

.back-to-top:hover {
  background-color: rgb(var(--primary-5));
  transform: translateY(0) scale(1.05);
  box-shadow: 0 6px 16px rgba(var(--primary-6), 0.4);
}

.back-to-top.visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* 响应式调整 */
@media screen and (max-width: 1024px) {
  .content-wrapper {
    max-width: 900px;
  }
}

@media screen and (max-width: 768px) {
  .content {
    padding: 16px 0;
  }

  .content-wrapper {
    padding: 0 16px;
  }

  .back-to-top {
    right: 16px;
    bottom: 24px;
    width: 40px;
    height: 40px;
  }
}

@media screen and (max-width: 480px) {
  .content {
    padding: 12px 0;
  }

  .content-wrapper {
    padding: 0 12px;
  }

  .back-to-top {
    right: 12px;
    bottom: 20px;
    width: 36px;
    height: 36px;
  }
}
</style>
