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
          {{ item.name }}
        </a-menu-item>
        <div :style="{ padding: 0, float: 'right', marginRight: '0px' }">
          <!--用户已登录，登录信息显示-->
          <template v-if="userInfo?.userRole != accessEnum.NOT_LOGIN">
            <a-space>
              <a-dropdown trigger="hover">
                <a-avatar v-if="userInfo.userAvatar">
                  <!--alt="avatar"替换文本，当图片加载失败时，才显示的文字-->
                  <img :src="userInfo.userAvatar" />
                </a-avatar>
                <a-avatar v-else>
                  {{ userInfo?.userName.charAt(0) }}
                  <!--              <IconPark type="fail-picture" theme="filled" />-->
                </a-avatar>
                <template #content>
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
              <!--          {{ store.state.user?.loginUser?.userName }}-->
              <a-typography-paragraph
                :ellipsis="{
                  rows: 1,
                  showTooltip: true,
                }"
                style="width: 90px; margin: 0 auto; padding-right: 10px"
              >
                {{ userInfo?.userName }}
              </a-typography-paragraph>
            </a-space>
          </template>
          <!--用户未登录-->
          <template v-else>
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
            </a-space>
          </template>
        </div>
      </a-menu>
    </a-col>
    <!--    <a-col flex="100px"> 6666666666666666</a-col>-->
  </a-row>
</template>
<script setup lang="ts">
import { routes } from "@/router/routes";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import checkAccess from "@/access/checkAccess";
import { UserControllerService } from "../../generated";
import accessEnum from "@/enum/AccessEnum";
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

/**
 * 每次点击菜单项更新路由后，更新菜单栏上的指示条（菜单栏高亮）
 * 目的是刷新页面后，菜单栏上的指示条（菜单栏高亮）保持不动，而不是直接消失
 */
const selectedKeys = ref(["/"]); //默认主页
router.afterEach((to, from, failure) => {
  // console.log("path=" + to.path);
  selectedKeys.value = [to.path];
});
// document.body.setAttribute("arco-theme", "dark");

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
 * 获取用户信息
 */
let userInfo = computed(() => store.state.user.loginUser);

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
