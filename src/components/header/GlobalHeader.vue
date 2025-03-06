<template>
  <!--栅格布局，Flex 用法：通过设置 Col 组件的 flex 属性，可以任意配置 flex 布局。
  通过 align 来进行垂直布局。-->
  <a-row id="globalHeader" class="grid-demo" :wrap="false">
    <!--:wrap="false",关闭换行，当窗口缩小时，不会把"未登录"这块的字挤压到第二行，
    :是为了把false识别出属性而非字符串-->
    <a-col flex="auto">
      <!--菜单-->
      <a-menu
        mode="horizontal"
        :selected-keys="selectedKeys"
        @menu-item-click="doMenuClick"
        class="main-menu"
      >
        <a-menu-item
          key="logo"
          :style="{ padding: 0, marginRight: '38px' }"
          disabled
        >
          <div class="title-bar">
            <div class="logo-wrapper">
              <icon-code theme="filled" size="24" />
            </div>
            <div class="title">在线评测</div>
          </div>
        </a-menu-item>
        <a-menu-item
          v-for="item in visibleRoutes"
          :key="item.path"
          class="menu-item"
        >
          <IconPark
            :type="item.meta?.icon as string"
            theme="filled"
            :size="16"
            class="menu-icon"
          />
          {{ item.name }}
        </a-menu-item>

        <!-- 用户信息区域 -->
        <div class="user-area">
          <template v-if="userInfo?.userRole != accessEnum.NOT_LOGIN">
            <a-space>
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
                    {{ userInfo?.userName.charAt(0) }}
                  </a-avatar>
                  <a-typography-paragraph
                    :ellipsis="{
                      rows: 1,
                      showTooltip: true,
                    }"
                    class="username"
                  >
                    {{ userInfo?.userName }}
                  </a-typography-paragraph>
                </div>
                <template #content>
                  <div class="dropdown-menu">
                    <a-doption class="dropdown-item">
                      <template #icon>
                        <IconPark type="user" theme="filled" :size="16" />
                      </template>
                      <div @click="toUserHome">我的主页</div>
                    </a-doption>
                    <a-doption class="dropdown-item">
                      <template #icon>
                        <IconPark type="config" theme="filled" :size="16" />
                      </template>
                      <div @click="toUserSettings">我的设置</div>
                    </a-doption>
                    <a-divider margin="4" />
                    <a-doption class="dropdown-item">
                      <template #icon>
                        <IconPark type="logout" theme="filled" :size="16" />
                      </template>
                      <div @click="userLoginout">退出登录</div>
                    </a-doption>
                  </div>
                </template>
              </a-dropdown>
            </a-space>
          </template>
          <template v-else>
            <a-space>
              <a-dropdown trigger="hover">
                <a-avatar :size="32" class="guest-avatar">未登录</a-avatar>
                <template #content>
                  <div class="dropdown-menu">
                    <a-doption class="dropdown-item">
                      <template #icon>
                        <IconPark type="login" theme="filled" :size="16" />
                      </template>
                      <div @click="userLogin">登录</div>
                    </a-doption>
                    <a-doption class="dropdown-item">
                      <template #icon>
                        <IconPark type="newlybuild" theme="filled" :size="16" />
                      </template>
                      <div @click="userRegister">注册</div>
                    </a-doption>
                  </div>
                </template>
              </a-dropdown>
            </a-space>
          </template>
        </div>
      </a-menu>
    </a-col>
    <!--    <a-col flex="100px"> 6666666666666666</a-col>-->
  </a-row>
</template>
<script setup lang="ts">
import { routes } from "@/router/routes/routes";
import { useRouter, useRoute } from "vue-router";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import checkAccess from "@/access/checkAccess";
import { UserControllerService } from "../../../generated";
import accessEnum from "@/enum/AccessEnum";
import { IconPark } from "@icon-park/vue-next/es/all";
import { IconCode } from "@arco-design/web-vue/es/icon";

const router = useRouter();
const route = useRoute();
/**
 * 点击菜单项更新路由
 */
const doMenuClick = (key: string) => {
  // console.log("key=" + key);
  router.push({
    path: key,
  });
  selectedKeys.value = [key];
};

/**
 * 每次点击菜单项更新路由后，更新菜单栏上的指示条（菜单栏高亮）
 * 目的是刷新页面后，菜单栏上的指示条（菜单栏高亮）保持不动，而不是直接消失
 */
const selectedKeys = ref([route.path]); //默认主页(初始加载页面时从route.path获取当前路径，并设置为默认选中路径)

router.afterEach((to, from, failure) => {
  document.title = (to.name as string) || "OJ在线判题系统";
});

/**
 * 自动登录
 */
var store = useStore();
// console.log(store.state.user.loginUser);
// setTimeout(() => {
//   //远程获取登录信息，并更新本地vuex用户信息
//   store.dispatch("user/getLoginUser");
// }, 3000);

/**
 * 获取用户信息
 */
let userInfo = computed(() => store.state.user.loginUser);

/** 这是对菜单栏的过滤操作，（权限校验）
 * 过滤掉数组中需要权限的路由，保留不需权限的；
 * 注意：这里使用计算属性，是为了当登录用户信息发生变更时，触发菜单栏的重新渲染，展示新增权限的菜单项
 */
const visibleRoutes = computed(() => {
  //filter方法中，遍历元素返回true就会保留该元素，否则过滤掉
  return routes.filter((item, index) => {
    //根据meta的hideInMenu字段控制菜单显隐
    if (item.meta?.hideInMenu) {
      return false;
    }
    // todo 根据权限过滤菜单
    // as 类型断言，告诉编译器
    if (!checkAccess(store.state.user.loginUser, item.meta?.access as string)) {
      return false;
    }
    return true;
  });
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
  // 如果不加await改成同步请求，可能还没注销完毕，后面的获取信息在注销之前就执行完毕了
  // 导致点击退出登录后，右上角还是注销之前的状态，（点击没反应，刷新页面其实已经注销了）
  await UserControllerService.userLogoutUsingPost();
  //更新vuex用户信息
  store.dispatch("user/getLoginUser");
  router.push({
    path: "/",
    replace: true, //不保留当前页面的历史记录，无法其他页面back回去
  });
};

// 新增用户主页和设置页面的跳转方法
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
/*scoped样式只在当前vue文件下起作用*/

.main-menu {
  padding: 0 16px;
  overflow: hidden;
}

.title-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 4px;
  overflow: hidden;
}

.logo-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgb(var(--primary-6));
  color: #fff;
  transition: all 0.3s ease;
}

.logo-wrapper:hover {
  transform: rotate(30deg);
}

.title {
  font-size: 18px;
  font-weight: 600;
  color: rgb(var(--primary-6));
  letter-spacing: 0.5px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 16px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.menu-icon {
  margin-right: 4px;
}

.user-area {
  float: right;
  margin-right: 0;
  padding: 0 8px;
  transition: background 0.3s ease;
  display: flex;
  align-items: center;
  width: auto;
  min-width: 100px;
  max-width: 150px;
  overflow: hidden;
}

.user-area:hover {
  background: var(--color-fill-2);
  border-radius: 4px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
}

.user-avatar {
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.user-avatar:hover {
  border-color: rgb(var(--primary-6));
}

.guest-avatar {
  cursor: pointer;
  transition: all 0.3s ease;
}

.guest-avatar:hover {
  background: var(--color-fill-2);
}

.username {
  width: 90px;
  margin: 0;
  font-size: 14px;
  color: var(--color-text-1);
}

.dropdown-menu {
  min-width: 160px;
  padding: 2px;
  max-height: 200px;
  overflow-y: auto;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
  line-height: 1.5;
}

:deep(.arco-dropdown-option:hover) {
  background-color: var(--color-fill-2);
}

:deep(.arco-menu-light .arco-menu-item.arco-menu-selected) {
  color: rgb(var(--primary-6));
  font-weight: 500;
}

:deep(.arco-menu-light .arco-menu-item:hover) {
  color: rgb(var(--primary-6));
}

@media screen and (max-width: 768px) {
  .main-menu {
    padding: 0 8px;
  }

  .menu-item {
    padding: 0 12px;
  }

  .username {
    display: none;
  }
}
</style>
