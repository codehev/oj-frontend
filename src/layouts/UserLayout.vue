<template>
  <div id="userLayout" class="user-layout">
    <a-layout class="layout-container">
      <div class="bg-decoration"></div>
      <div class="bg-decoration-2"></div>
      <div class="bg-decoration-3"></div>
      <div class="particles-container">
        <div
          v-for="n in 20"
          :key="n"
          class="particle"
          :style="getParticleStyle(n)"
        ></div>
      </div>
      <div class="code-rain"></div>

      <a-layout-header class="header">
        <div class="header-content">
          <div class="logo-area">
            <icon-code theme="filled" size="28" class="logo-icon" />
            <h1 class="title">Online Judge</h1>
          </div>
          <div class="subtitle">一个编程题目评测系统</div>
        </div>
      </a-layout-header>

      <a-layout-content class="content">
        <router-view v-slot="{ Component }">
          <div class="router-view-container">
            <transition name="fade" mode="out-in">
              <keep-alive>
                <component :is="Component" :key="$route.fullPath" />
              </keep-alive>
            </transition>
          </div>
        </router-view>
      </a-layout-content>

      <a-layout-footer class="footer">
        <FooterComponent />
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import FooterComponent from "@/components/footer/FooterComponent.vue";
import { IconCode } from "@arco-design/web-vue/es/icon";
import { useRoute, onBeforeRouteLeave } from "vue-router";
import { onMounted, onBeforeUnmount } from "vue";

const $route = useRoute();

// 代码雨效果
interface CodeDrop {
  element: HTMLElement;
  x: number;
  y: number;
  speed: number;
  character: string;
  opacity: number;
}

let codeDrops: CodeDrop[] = [];
let codeRainInterval: number | null = null;

// 代码字符集
const codeCharacters = "01".split("");

// 初始化代码雨效果
const initCodeRain = () => {
  const codeRainContainer = document.querySelector(".code-rain") as HTMLElement;
  if (!codeRainContainer) return;

  // 清空之前的元素
  codeRainContainer.innerHTML = "";

  // 创建代码雨滴
  const numDrops = Math.floor(window.innerWidth / 30); // 根据屏幕宽度计算雨滴数量

  for (let i = 0; i < numDrops; i++) {
    createCodeDrop(codeRainContainer);
  }

  // 动画循环
  codeRainInterval = window.setInterval(() => {
    animateCodeRain();
  }, 50);
};

// 创建单个代码雨滴
const createCodeDrop = (container: HTMLElement) => {
  const element = document.createElement("div");
  element.className = "code-drop";

  const x = Math.random() * 100; // 位置 (%)
  const y = -Math.random() * 100; // 起始位置在屏幕外
  const speed = 1 + Math.random() * 3; // 速度变化
  const character =
    codeCharacters[Math.floor(Math.random() * codeCharacters.length)];
  const opacity = 0.1 + Math.random() * 0.2;

  element.style.left = `${x}%`;
  element.style.top = `${y}%`;
  element.textContent = character;
  element.style.opacity = opacity.toString();
  element.style.animationDuration = `${10 / speed}s`;
  element.style.animationDelay = `${Math.random() * 8}s`;

  container.appendChild(element);

  codeDrops.push({
    element,
    x,
    y,
    speed,
    character,
    opacity,
  });
};

// 动画代码雨
const animateCodeRain = () => {
  // 基本动画通过CSS完成，这里可以添加额外的逻辑
  // 例如，可以随机改变一些雨滴的字符
  codeDrops.forEach((drop) => {
    if (Math.random() < 0.02) {
      drop.element.textContent =
        codeCharacters[Math.floor(Math.random() * codeCharacters.length)];
    }
  });
};

/**
 * 生成随机粒子样式
 */
const getParticleStyle = (n: number) => {
  const size = Math.floor(Math.random() * 6) + 2;
  const top = Math.floor(Math.random() * 100);
  const left = Math.floor(Math.random() * 100);
  const animationDuration = Math.floor(Math.random() * 30) + 10;
  const animationDelay = Math.floor(Math.random() * 10);
  const opacity = Math.random() * 0.5 + 0.1;

  return {
    width: `${size}px`,
    height: `${size}px`,
    top: `${top}%`,
    left: `${left}%`,
    opacity: opacity,
    animationDuration: `${animationDuration}s`,
    animationDelay: `${animationDelay}s`,
  };
};

onMounted(() => {
  initCodeRain();

  // 响应窗口大小变化
  window.addEventListener("resize", initCodeRain);
});

onBeforeUnmount(() => {
  // 清理动画和事件监听器
  if (codeRainInterval) {
    clearInterval(codeRainInterval);
    codeRainInterval = null;
  }
  window.removeEventListener("resize", initCodeRain);
  codeDrops = [];
});

// 路由切换时清理资源
onBeforeRouteLeave(() => {
  if (codeRainInterval) {
    clearInterval(codeRainInterval);
    codeRainInterval = null;
  }
  codeDrops = [];
});
</script>

<style scoped>
:global(body),
:global(html) {
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  margin: 0;
  padding: 0;
}

.user-layout {
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%);
}

.layout-container {
  min-height: 100vh;
  position: relative;
  z-index: 1;
  width: 100%;
  overflow: hidden; /* 防止内部元素溢出 */
}

/* 背景装饰 */
.bg-decoration {
  position: absolute;
  top: -100px;
  right: -80px;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: linear-gradient(
    45deg,
    rgba(59, 130, 246, 0.08),
    rgba(59, 130, 246, 0.15)
  );
  filter: blur(50px);
  z-index: 0;
  animation: float 15s ease-in-out infinite alternate;
}

.bg-decoration-2 {
  position: absolute;
  bottom: -150px;
  left: -100px;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: linear-gradient(
    45deg,
    rgba(99, 102, 241, 0.08),
    rgba(99, 102, 241, 0.12)
  );
  filter: blur(60px);
  z-index: 0;
  animation: float 20s ease-in-out infinite alternate-reverse;
}

.bg-decoration-3 {
  position: absolute;
  top: 40%;
  left: 20%;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: linear-gradient(
    45deg,
    rgba(14, 165, 233, 0.05),
    rgba(14, 165, 233, 0.1)
  );
  filter: blur(40px);
  z-index: 0;
  animation: float 18s ease-in-out infinite alternate;
}

/* 添加网格背景 */
.layout-container::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: linear-gradient(
      rgba(226, 232, 240, 0.5) 1px,
      transparent 1px
    ),
    linear-gradient(90deg, rgba(226, 232, 240, 0.5) 1px, transparent 1px);
  background-size: 30px 30px;
  z-index: -1;
}

/* 代码雨效果 */
.code-rain {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.code-drop {
  position: absolute;
  color: rgba(59, 130, 246, 0.2);
  font-family: "Courier New", monospace;
  font-size: 14px;
  line-height: 1;
  animation-name: code-rain-anim;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes code-rain-anim {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  10% {
    opacity: 0.3;
  }
  90% {
    opacity: 0.3;
  }
  100% {
    transform: translateY(100vh);
    opacity: 0;
  }
}

/* 粒子效果 */
.particles-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
  pointer-events: none;
}

.particle {
  position: absolute;
  background-color: rgba(59, 130, 246, 0.1);
  border-radius: 50%;
  animation: float-random infinite linear both;
  z-index: 0;
  pointer-events: none;
}

@keyframes float-random {
  0% {
    transform: translateY(0) translateX(0) rotate(0);
  }
  50% {
    transform: translateY(-20px) translateX(15px) rotate(180deg);
  }
  100% {
    transform: translateY(0) translateX(0) rotate(360deg);
  }
}

@keyframes float {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(30px, 30px);
  }
}

/* 路由过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.header {
  background: transparent;
  padding: 24px 0;
  box-shadow: none;
  position: relative;
  z-index: 2;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
}

.logo-area {
  display: inline-flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  color: #3b82f6;
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.header:hover .logo-icon {
  transform: rotate(360deg);
}

.title {
  font-weight: 700;
  font-size: 28px;
  margin: 0;
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  letter-spacing: 0.5px;
  position: relative;
}

.title::after {
  content: "";
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, transparent);
  transition: width 0.3s ease;
}

.logo-area:hover .title::after {
  width: 100%;
}

.subtitle {
  color: #64748b;
  font-size: 14px;
  margin-top: 8px;
  letter-spacing: 0.5px;
}

.content {
  padding: 0 20px 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  z-index: 2;
  min-height: 65vh;
  width: 100%;
  box-sizing: border-box;
  overflow: visible;
}

.content > :deep(.router-view-container) {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 确保所有卡片都有固定大小 */
:deep(.auth-card) {
  width: 100%;
  max-width: 460px;
  min-height: 580px;
  height: auto;
}

.footer {
  background: transparent;
  padding: 24px 20px;
  text-align: center;
  position: relative;
  z-index: 2;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  width: 100%;
  box-sizing: border-box;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .header {
    padding: 16px 0;
  }

  .title {
    font-size: 24px;
  }

  .subtitle {
    font-size: 12px;
  }

  .content {
    padding: 0 16px 32px;
  }

  .bg-decoration,
  .bg-decoration-2,
  .bg-decoration-3 {
    opacity: 0.6;
  }
}

@media (max-width: 480px) {
  .header-content {
    padding: 0 16px;
  }

  .title {
    font-size: 20px;
  }

  .logo-icon {
    font-size: 24px;
  }

  .particles-container {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .bg-decoration,
  .bg-decoration-2,
  .bg-decoration-3,
  .particle,
  .logo-icon,
  .code-drop {
    animation: none;
    transition: none;
  }
}
</style>
