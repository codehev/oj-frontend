<template>
  <div id="basicLayout">
    <!--vh是前端开发中的一个动态单位，表示相对于视口（Viewport）的高度。
    系统会将视口的宽度和高度分为100份，1vh就占用视口高度的百分之一。
    这个单位使得前端开发更加灵活，可以适应不同大小的视口，提高用户体验。-->
    <a-layout class="layout-container">
      <!--固定header，offset-top距离窗口顶部达到指定偏移量后触发-->
      <a-affix :offsetTop="0">
        <a-layout-header class="header">
          <HeaderComponent />
        </a-layout-header>
      </a-affix>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <FooterComponent />
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import HeaderComponent from "@/components/header/HeaderComponent.vue";
import FooterComponent from "@/components/footer/FooterComponent.vue";
</script>

<style scoped>
/*scoped样式只在当前vue文件下起作用*/
/*#basicLayout {*/
/*}*/

.layout-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.header {
  background: #fff;
  margin-bottom: 16px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border-bottom: 1px solid var(--color-neutral-3);
}

.content {
  flex: 1;
  margin-bottom: 16px;
  padding: 0;
  background: #fff;
  transition: all 0.3s ease;
}

.footer {
  background: #fff;
  padding: 16px 0;
  border-top: 1px solid var(--color-neutral-3);
  transition: all 0.3s ease;
}

.footer-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 4px;
}

.footer-links :deep(.arco-link) {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.footer-links :deep(.arco-link:hover) {
  background-color: var(--color-fill-2);
}

.copyright {
  color: var(--color-text-3);
  font-size: 14px;
}

.copyright :deep(.arco-link) {
  transition: all 0.3s ease;
}

@media screen and (max-width: 768px) {
  .footer-content {
    padding: 0 16px;
  }

  .footer-links {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style>
