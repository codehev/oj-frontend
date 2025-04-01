<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

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
