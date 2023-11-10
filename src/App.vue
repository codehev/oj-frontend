<template>
  <div id="app">
    <!--   路由以/user开头-->
    <template v-if="route.path.startsWith('/user')">
      <!-- 默认展示路由数组的第一个路由页面-->
      <router-view />
    </template>
    <template v-else>
      <BasicLayout />
    </template>
  </div>
</template>

<style>
#app {
}
</style>
<script setup lang="ts">
import BasicLayout from "@/layouts/BasicLayout.vue";
import { onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

/**
 * 全局初始化函数，有全局单次调用的代码，都可以写到这里
 */
const doInit = () => {
  console.log("hello, 欢迎使用！");
};

onMounted(() => {
  doInit();
});
</script>
