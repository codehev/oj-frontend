<template>
  <div class="footer">
    <div class="footer-content">
      <div class="footer-links">
        <a-link
          href="https://github.com/codehev"
          target="_blank"
          class="footer-link"
        >
          <icon-github />
          <span>GitHub</span>
        </a-link>
        <a-divider direction="vertical" :margin="8" />
        <a-link href="https://arco.design" target="_blank" class="footer-link">
          <icon-book />
          <span>文档</span>
        </a-link>
      </div>
      <div class="copyright">
        Online Judge © {{ new Date().getFullYear() }} by
        <a-link
          href="https://github.com/codehev"
          target="_blank"
          class="author-link"
        >
          codehev
        </a-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IconGithub, IconBook } from "@arco-design/web-vue/es/icon";
</script>

<style scoped>
.footer {
  background: var(--color-bg-2);
  padding: 24px 0;
  border-top: 1px solid var(--color-border-2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.footer::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(
    90deg,
    rgba(var(--primary-6), 0.1),
    rgba(var(--primary-6), 0.5),
    rgba(var(--primary-6), 0.1)
  );
  opacity: 0.6;
}

.footer-content {
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 8px;
}

.footer-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: var(--color-text-2);
  font-size: 14px;
}

.footer-link:hover {
  background-color: var(--color-fill-2);
  color: rgb(var(--primary-6));
  transform: translateY(-2px);
}

.copyright {
  color: var(--color-text-3);
  font-size: 14px;
  text-align: center;
  line-height: 1.6;
}

.author-link {
  font-weight: 500;
  position: relative;
  color: var(--color-text-2);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.author-link:hover {
  color: rgb(var(--primary-6));
}

.author-link::after {
  content: "";
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background-color: rgb(var(--primary-6));
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.author-link:hover::after {
  width: 100%;
}

@media screen and (max-width: 768px) {
  .footer {
    padding: 20px 0;
  }

  .footer-content {
    padding: 0 16px;
    gap: 12px;
  }
}

@media screen and (max-width: 480px) {
  .footer {
    padding: 16px 0;
  }

  .footer-content {
    padding: 0 12px;
    gap: 10px;
  }

  .footer-link {
    padding: 4px 8px;
    font-size: 13px;
  }

  .copyright {
    font-size: 12px;
  }
}
</style>
