<template>
  <div class="footer">
    <div class="footer-content">
      <div class="footer-links">
        <a-link href="https://github.com/codehev" target="_blank">
          <template #icon>
            <icon-github />
          </template>
          GitHub
        </a-link>
        <a-divider direction="vertical" margin="12" />
        <a-link href="https://arco.design" target="_blank">
          <template #icon>
            <icon-book />
          </template>
          文档
        </a-link>
      </div>
      <div class="copyright">
        Online Judge © {{ new Date().getFullYear() }} by
        <a-link href="https://github.com/codehev" target="_blank"
          >codehev</a-link
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconGithub, IconBook } from "@arco-design/web-vue/es/icon";
</script>

<style scoped>
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
</style>
