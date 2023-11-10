<template>
  <!--  默认以文件名为组件名，使用ESLint时组件名只能多单词命名-->
  <div id="app">
    <span>home</span>
    <MdEditor :value="mdValue" :handle-change="onMdChange" />
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import MdEditor from "@/components/MdEditor.vue";

const mdValue = ref("");

const onMdChange = (v: string) => {
  mdValue.value = v;
};
</script>
<style scoped></style>
