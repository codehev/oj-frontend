<template>
  <!--栅格布局，Flex 用法：通过设置 Col 组件的 flex 属性，可以任意配置 flex 布局。
  通过 align 来进行垂直布局。-->
  <a-row id="globalHeader" class="grid-demo" align="center" :wrap="false">
    <!--:wrap="false",关闭换行，当窗口缩小时，不会把”未登录“这块的字挤压到第二行，
    :是为了把false识别出属性而非字符串-->
    <a-col flex="auto">
      <!--菜单-->
      <a-menu
        mode="horizontal"
        :selected-keys="selectedKeys"
        @menu-item-click="doMenuClick"
      >
        <a-menu-item
          key="0"
          :style="{ padding: 0, marginRight: '38px' }"
          disabled
        >
          <div class="title-bar">
            <img class="logo" src="../assets/logo.jpeg" />
            <div class="title">OJ</div>
          </div>
        </a-menu-item>
        <a-menu-item v-for="item in visibleRoutes" :key="item.path">
          <IconPark :type="item.meta.icon" theme="filled" />
          <!--          <IconPark :icon="item.meta.icon" />-->
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col flex="100px">
      <!--用户登录信息显示-->
      <!--      <div>{{ store.state.user?.loginUser?.userName ?? "未登录" }}</div>-->
      <div v-if="store.state.user?.loginUser?.userRole != accessEnum.NOT_LOGIN">
        <!--        <a-space decoration="vertical" fill>
                  {{ store.state.user?.loginUser?.userName }}
                  <a-button type="text" @click="userLoginout">注销</a-button>
                </a-space>-->
        <a-space>
          <a-dropdown trigger="hover">
            <a-avatar>
              <img
                alt="avatar"
                src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp"
              />
            </a-avatar>
            <template #content>
              <!--              <a-space style="margin: 14px">
                              <a-avatar :size="32">
                                <img
                                  alt="avatar"
                                  src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp"
                                />
                              </a-avatar>
                              <div>{{ store.state.user?.loginUser?.userName }}</div>
                            </a-space>
                            <a-divider :size="0" margin="3px" />-->
              <a-doption>
                <template #icon>
                  <IconPark type="user" theme="filled" fill="#333" />
                </template>
                <template #default>
                  <div @click="userLoginout">我的主页</div>
                </template>
              </a-doption>
              <a-doption>
                <template #icon>
                  <IconPark type="config" theme="filled" fill="#333" />
                </template>
                <template #default>
                  <div @click="userLoginout">我的设置</div>
                </template>
              </a-doption>
              <a-divider :size="0" margin="3px" />
              <a-doption>
                <template #icon>
                  <IconPark type="logout" theme="filled" fill="#333" />
                </template>
                <template #default>
                  <div @click="userLoginout">退出登录</div>
                </template>
              </a-doption>
            </template>
          </a-dropdown>
          {{ store.state.user?.loginUser?.userName }}
        </a-space>
      </div>
      <div v-else>
        <!--        <a-space decoration="vertical" fill>-->
        <!--          <router-link to="/user/login">登录</router-link>-->
        <!--          <router-link to="#">注册</router-link>-->
        <!--        </a-space>-->
        <a-space>
          <a-dropdown trigger="hover">
            <a-avatar>未登录</a-avatar>
            <template #content>
              <a-doption>
                <template #icon>
                  <IconPark type="login" theme="filled" fill="#333" />
                </template>
                <template #default>
                  <div @click="userLogin">登录</div>
                </template>
              </a-doption>
              <a-doption>
                <template #icon>
                  <IconPark type="newlybuild" theme="filled" fill="#333" />
                </template>
                <template #default>
                  <div @click="userRegister">注册</div>
                </template>
              </a-doption>
            </template>
          </a-dropdown>
          <!--          {{ store.state.user?.loginUser?.userName }}-->
        </a-space>
      </div>
    </a-col>
  </a-row>
</template>
<script setup lang="ts">
import { routes } from "@/router/routes";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import checkAccess from "@/access/checkAccess";
import { UserControllerService } from "../../generated";
import accessEnum from "@/access/accessEnum";
import { IconPark } from "@icon-park/vue-next/es/all";

const router = useRouter();
/**
 * 点击菜单项更新路由
 */
const doMenuClick = (key: string) => {
  // console.log("key=" + key);
  router.push({
    path: key,
  });
};

// 每次点击菜单项更新路由后，更新菜单栏上的指示条（菜单栏高亮）
// 目的是刷新页面后，菜单栏上的指示条（菜单栏高亮）保持不动，而不是直接消失
const selectedKeys = ref(["/"]); //默认主页
router.afterEach((to, from, failure) => {
  // console.log("path=" + to.path);
  selectedKeys.value = [to.path];
});

/**
 * 自动登录
 */
var store = useStore();
// console.log(store.state.user.loginUser);
setTimeout(() => {
  //远程获取登录信息，并更新本地vuex用户信息
  store.dispatch("user/getLoginUser");
}, 3000);

/**
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
const userLoginout = () => {
  UserControllerService.userLogoutUsingPost();
  //更新vuex用户信息
  store.dispatch("user/getLoginUser");
  router.push({
    path: "/",
    replace: true, //不保留当前页面的历史记录，无法其他页面back回去
  });
};
</script>
<style scoped>
/*scoped样式只在当前vue文件下起作用*/

.title-bar {
  display: flex;
  align-items: center;
}

.logo {
  height: 26px;
}

.title {
  color: #444;
}
</style>
