<template>
  <div id="app">
    <!-- router-view默认展示路由数组的第一个路由页面-->
    <!--   路由以/user开头-->
    <template v-if="route.path.startsWith('/user')">
      <router-view />
    </template>
    <!--   路由以/view开头-->
    <template v-else-if="route.path.startsWith('/view')">
      <router-view />
    </template>
    <template v-else>
      <BasicLayout />
    </template>
  </div>
</template>

<script setup lang="ts">
import BasicLayout from "@/layouts/BasicLayout.vue";
import { onMounted } from "vue";
import { useRoute } from "vue-router";
import UserLayout from "@/layouts/UserLayout.vue";

const route = useRoute();

/**
 * 全局初始化函数，有全局单次调用的代码，都可以写到这里
 */
const doInit = () => {
  console.log("hello, 欢迎使用OJ！");
};

onMounted(() => {
  doInit();
});
</script>
<style>
* {
  margin: 0;
  padding: 0;
}
</style>
