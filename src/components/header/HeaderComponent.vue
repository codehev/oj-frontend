<template>
  <!-- 用简单div结构实现顶部导航栏 -->
  <div id="globalHeader" class="header-container">
    <div class="header-content">
      <!-- 完全自定义导航栏结构，不使用a-menu -->
      <div class="custom-nav">
        <!-- Logo区域，点击回到首页 -->
        <div class="logo-section" @click="doMenuClick('/')">
          <div class="logo-wrapper">
            <router-link to="/" class="logo-link">
              <!-- <img src="@/assets/logo.svg" alt="Logo" class="logo-img" /> -->
              <span class="site-name">Online Judge</span>
            </router-link>
          </div>
        </div>

        <!-- 导航菜单区域 -->
        <div class="nav-menu">
          <div
            v-for="item in menuItems"
            :key="item.path"
            class="nav-item"
            :class="{ active: isMenuActive(item.path) }"
            @click="doMenuClick(item.path)"
          >
            <component :is="item.icon" :size="16" class="menu-icon" />
            <span>{{ item.name }}</span>

            <!-- 添加徽章（用于显示新功能或未读消息） -->
            <span
              v-if="item.path === '/message'"
              class="badge"
              v-show="unreadCount > 0"
            >
              {{ unreadCount > 99 ? "99+" : unreadCount }}
            </span>
          </div>
        </div>

        <!-- 用户信息区域 -->
        <div class="user-area">
          <template v-if="userInfo?.userRole != accessEnum.NOT_LOGIN">
            <a-dropdown trigger="hover">
              <div class="user-info">
                <a-avatar
                  :size="32"
                  class="user-avatar"
                  v-if="userInfo.userAvatar"
                >
                  <img :src="userInfo.userAvatar" alt="用户头像" />
                </a-avatar>
                <a-avatar :size="32" class="user-avatar" v-else>
                  {{ userInfo?.userName?.charAt(0) || "?" }}
                </a-avatar>
                <div class="user-text">
                  <a-typography-paragraph
                    :ellipsis="{
                      rows: 1,
                      showTooltip: true,
                    }"
                    class="username"
                  >
                    {{ userInfo?.userName }}
                  </a-typography-paragraph>
                  <span class="role-tag">{{ getUserRoleText() }}</span>
                </div>
                <icon-down :size="14" class="dropdown-icon" />
              </div>
              <template #content>
                <div class="dropdown-menu">
                  <div class="dropdown-item" @click="toUserHome">
                    <icon-user :size="16" />
                    <span>个人主页</span>
                  </div>
                  <div class="dropdown-item" @click="toUserSettings">
                    <icon-settings :size="16" />
                    <span>账号设置</span>
                  </div>
                  <a-divider style="margin: 2px 0" />
                  <div class="dropdown-item logout" @click="userLoginout">
                    <icon-export :size="16" />
                    <span>退出登录</span>
                  </div>
                </div>
              </template>
            </a-dropdown>
          </template>
          <template v-else>
            <div class="auth-buttons">
              <a-button type="outline" size="small" @click="userLogin">
                <template #icon>
                  <icon-import :size="14" />
                </template>
                登录
              </a-button>
              <a-button type="primary" size="small" @click="userRegister">
                <template #icon>
                  <icon-user-add :size="14" />
                </template>
                注册
              </a-button>
            </div>
          </template>
        </div>

        <!-- 深色/浅色模式切换 -->
        <div class="theme-toggle" @click="toggleTheme">
          <icon-moon-fill v-if="isDarkMode" />
          <icon-sun-fill v-else />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { routes } from "@/router/routes/routes";
import { useRouter, useRoute } from "vue-router";
import { computed, ref, watch, onMounted } from "vue";
import { useStore } from "vuex";
import checkAccess from "@/access/checkAccess";
import { UserControllerService } from "../../../generated";
import accessEnum from "@/enum/AccessEnum";
import {
  IconCode,
  IconUser,
  IconSettings,
  IconExport,
  IconImport,
  IconUserAdd,
  IconHome,
  IconTrophy,
  IconMessage,
  IconCommon,
  IconFile,
  IconDown,
  IconMoonFill,
  IconSunFill,
  IconDashboard,
  IconApps,
  IconCalendar,
} from "@arco-design/web-vue/es/icon";

const router = useRouter();
const route = useRoute();
const store = useStore();
const unreadCount = ref(0); // 未读消息数
const isDarkMode = ref(localStorage.getItem("theme") === "dark");

// 当前选中的菜单项
const activeMenuPath = ref("");

// 根据图标类型返回对应的组件
const getMenuIcon = (iconType?: string) => {
  if (!iconType) return IconCommon;

  switch (iconType) {
    case "home":
      return IconHome;
    case "code":
      return IconCode;
    case "dashboard":
      return IconDashboard;
    case "trophy":
      return IconTrophy;
    case "message":
      return IconMessage;
    case "apps":
      return IconApps;
    case "user":
      return IconUser;
    case "file":
      return IconFile;
    case "calendar":
      return IconCalendar;
    default:
      return IconCommon;
  }
};

// 预处理菜单项
const menuItems = computed(() => {
  // 获取基础布局的子路由
  const mainRoutes = routes.find((route) => route.path === "/")?.children || [];

  // 过滤出可见的路由
  const filteredRoutes = mainRoutes.filter((item) => {
    if (item.meta?.hideInMenu) {
      return false;
    }
    if (!checkAccess(store.state.user.loginUser, item.meta?.access as string)) {
      return false;
    }
    return true;
  });

  // 提前计算好菜单项的属性，确保path前面有"/"
  return filteredRoutes.map((item) => ({
    path: item.path === "" ? "/" : `/${item.path}`,
    name: item.name,
    icon: getMenuIcon(item.meta?.icon as string),
  }));
});

// 检查菜单项是否处于激活状态
const isMenuActive = (menuPath: string) => {
  // 处理首页的特殊情况
  if (menuPath === "/" && route.path === "/") {
    return true;
  }

  // 对于其他页面，比较路由路径
  if (menuPath !== "/") {
    // 移除开头的斜杠以匹配路由定义中的相对路径
    const currentPathWithoutSlash = route.path.startsWith("/")
      ? route.path.substring(1)
      : route.path;

    // 移除菜单路径开头的斜杠进行比较
    const menuPathWithoutSlash = menuPath.startsWith("/")
      ? menuPath.substring(1)
      : menuPath;

    // 检查当前路径是否以菜单路径开头
    return (
      currentPathWithoutSlash === menuPathWithoutSlash ||
      currentPathWithoutSlash.startsWith(`${menuPathWithoutSlash}/`)
    );
  }

  return false;
};

// 更新当前激活的菜单路径
const updateActiveMenu = () => {
  // 获取当前路由的路径
  const currentPath = route.path;

  // 对于根路径，直接设为 "/"
  if (currentPath === "/") {
    activeMenuPath.value = "/";
    return;
  }

  // 提取第一级路径部分（不带开头的"/"）
  const mainPathSegment = currentPath.split("/").filter(Boolean)[0] || "";
  const mainPath = `/${mainPathSegment}`;

  // 在menuItems中查找匹配项
  const menuItem = menuItems.value.find((item) => {
    // 移除两个路径开头的"/"后比较
    const itemPathNormalized = item.path.startsWith("/")
      ? item.path.substring(1)
      : item.path;
    const mainPathNormalized = mainPath.startsWith("/")
      ? mainPath.substring(1)
      : mainPath;

    return itemPathNormalized === mainPathNormalized;
  });

  if (menuItem) {
    activeMenuPath.value = menuItem.path;
  } else {
    // 如果找不到匹配项，保持当前状态
  }
};

// 切换主题模式
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  const newTheme = isDarkMode.value ? "dark" : "light";
  localStorage.setItem("theme", newTheme);
  document.body.setAttribute("arco-theme", newTheme);
};

// 获取用户角色文本
const getUserRoleText = () => {
  const role = userInfo.value?.userRole;
  switch (role) {
    case accessEnum.ADMIN:
      return "管理员";
    case accessEnum.USER:
      return "用户";
    default:
      return "访客";
  }
};

/**
 * 点击菜单项更新路由
 */
const doMenuClick = (key: string) => {
  // 处理路径，如果已经是以/开头，直接使用，否则在/后拼接
  const path = key.startsWith("/") ? key : `/${key}`;

  // 更新当前激活的菜单
  activeMenuPath.value = path;

  // 导航到新路径
  router.push({
    path,
  });
};

// 监听路由变化以更新菜单高亮状态
watch(
  () => route.path,
  () => {
    updateActiveMenu();
  },
  { immediate: true }
);

// 监听路由变化以更新页面标题
watch(route, (newRoute) => {
  // 更新页面标题
  document.title = (newRoute.name as string) || "Online Judge";
});

// 获取用户信息
let userInfo = computed(() => store.state.user.loginUser);

// 模拟获取未读消息数量
const fetchUnreadCount = () => {
  // 实际项目中应该调用API获取未读消息数量
  setTimeout(() => {
    unreadCount.value = Math.floor(Math.random() * 10);
  }, 1000);
};

// 监听用户状态变化
watch(
  () => userInfo.value,
  (newValue) => {
    if (newValue && newValue.userRole !== accessEnum.NOT_LOGIN) {
      // 获取未读消息数量 (模拟)
      fetchUnreadCount();
    } else {
      unreadCount.value = 0;
    }
  },
  { immediate: true }
);

// 应用存储的主题
onMounted(() => {
  if (isDarkMode.value) {
    document.body.setAttribute("arco-theme", "dark");
  }

  // 初始化页面加载时的菜单高亮状态
  updateActiveMenu();

  // 初始化未读消息数量
  if (userInfo.value && userInfo.value.userRole !== accessEnum.NOT_LOGIN) {
    fetchUnreadCount();
  }
});

const userLogin = () => {
  router.push({
    path: "/user/login",
  });
};

const userRegister = () => {
  router.push({
    path: "/user/register",
  });
};

const userLoginout = async () => {
  await UserControllerService.userLogoutUsingPost();
  //更新vuex用户信息
  store.dispatch("user/getLoginUser");
  router.push({
    path: "/",
    replace: true,
  });
};

const toUserHome = () => {
  router.push({
    path: `/user/home/${userInfo.value?.id}`,
  });
};

const toUserSettings = () => {
  router.push({
    path: "/user/settings",
  });
};
</script>

<style scoped>
/* 基础容器样式 */
.header-container {
  width: 100%;
  background-color: var(--color-bg-2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(8px);
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-bottom: 1px solid var(--color-border-2);
}

.header-content {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  align-items: center;
}

/* 导航栏主体样式 */
.custom-nav {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  position: relative;
}

/* Logo区域样式 */
.logo-section {
  display: flex;
  align-items: center;
  padding: 0 4px;
  margin-right: 40px;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.logo-section:hover {
  transform: translateY(-2px);
}

.logo-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.logo-wrapper:hover {
  transform: rotate(10deg);
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.logo-img {
  height: 32px;
  margin-right: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.site-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.logo-link:hover .site-name {
  color: rgb(var(--primary-6));
}

.logo-link:hover .logo-img {
  transform: scale(1.05);
}

/* 导航菜单区域样式 */
.nav-menu {
  display: flex;
  height: 100%;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 16px;
  font-size: 15px;
  height: 100%;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  color: var(--color-text-2);
  position: relative;
  overflow: hidden;
}

.nav-item:hover {
  color: rgb(var(--primary-6));
  background-color: var(--color-fill-2);
}

.nav-item.active {
  color: rgb(var(--primary-6));
  font-weight: 500;
}

.nav-item.active::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background-color: rgb(var(--primary-6));
  animation: slideIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes slideIn {
  from {
    transform: scaleX(0);
    opacity: 0;
  }
  to {
    transform: scaleX(1);
    opacity: 1;
  }
}

.menu-icon {
  margin-right: 6px;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-item:hover .menu-icon {
  transform: translateY(-2px);
}

/* 徽章样式 */
.badge {
  position: absolute;
  top: 12px;
  right: 4px;
  min-width: 16px;
  height: 16px;
  border-radius: 8px;
  background-color: rgb(var(--danger-6));
  color: #fff;
  font-size: 10px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
  box-shadow: 0 2px 6px rgba(var(--danger-6), 0.4);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

/* 用户区域样式 */
.user-area {
  margin-left: auto;
  padding: 0 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background-color: var(--color-fill-2);
}

.user-info:hover {
  background-color: var(--color-fill-3);
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

.user-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.role-tag {
  font-size: 10px;
  color: var(--color-text-3);
  background: var(--color-fill-3);
  padding: 1px 6px;
  border-radius: 10px;
  display: inline-block;
  line-height: 1.2;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.user-info:hover .role-tag {
  background: rgba(var(--primary-2), 0.4);
  color: rgb(var(--primary-6));
}

.dropdown-icon {
  color: var(--color-text-3);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.user-info:hover .dropdown-icon {
  transform: rotate(180deg);
  color: rgb(var(--primary-6));
}

.user-avatar {
  border: 2px solid transparent;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.user-info:hover .user-avatar {
  border-color: rgba(var(--primary-6), 0.5);
  transform: scale(1.05);
}

.username {
  width: 90px;
  margin: 0;
  font-size: 14px;
  color: var(--color-text-1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.user-info:hover .username {
  color: rgb(var(--primary-6));
}

/* 登录按钮组 */
.auth-buttons {
  display: flex;
  gap: 8px;
}

/* 主题切换按钮 */
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-left: 12px;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: var(--color-text-2);
  background-color: var(--color-fill-2);
}

.theme-toggle:hover {
  background-color: var(--color-fill-3);
  color: rgb(var(--primary-6));
  transform: rotate(30deg);
}

/* 下拉菜单样式 */
.dropdown-menu {
  min-width: 180px;
  padding: 6px;
  background: var(--color-bg-popup);
  border-radius: 8px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  margin: 2px 0;
  border-radius: 6px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  color: var(--color-text-1);
}

.dropdown-item:hover {
  background-color: var(--color-fill-2);
  transform: translateX(2px);
}

.dropdown-item:active {
  transform: scale(0.98);
}

.dropdown-item.logout:hover {
  background-color: rgba(var(--danger-2), 0.3);
  color: rgb(var(--danger-6));
}

/* 移动端适配 */
@media screen and (max-width: 768px) {
  .header-container {
    padding: 0;
  }

  .custom-nav {
    padding: 0 12px;
  }

  .logo-section {
    margin-right: 20px;
  }

  .site-name {
    font-size: 16px;
  }

  .logo-img {
    height: 28px;
    margin-right: 8px;
  }

  .nav-item {
    padding: 0 12px;
    font-size: 14px;
  }

  .user-info {
    padding: 4px 8px;
  }
}

@media screen and (max-width: 480px) {
  .nav-item {
    padding: 0 8px;
  }

  .menu-icon {
    margin-right: 4px;
  }

  .site-name {
    display: none;
  }

  .logo-img {
    height: 24px;
    margin-right: 0;
  }

  .logo-section {
    margin-right: 10px;
  }

  .theme-toggle {
    width: 28px;
    height: 28px;
    margin-left: 8px;
  }

  .auth-buttons {
    gap: 4px;
  }
}
</style>
