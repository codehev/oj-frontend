<template>
  <!--  默认以文件名为组件名，使用ESLint时组件名只能多单词命名-->
  <div id="app">
    <span>about</span>
    <CodeEditor :value="codeValue" :handle-change="onCodeChange" />
  </div>
</template>
<script setup lang="ts">
import CodeEditor from "@/components/CodeEditor.vue";
import { ref } from "vue";

/**
 * 通 Md 编辑器一样，也要接受父组件的传值，把显示的输入交给父组件去控制，
 * 从而能够让父组件实时得到用户输入的代码
 */
const codeValue = ref("");
const onCodeChange = (v: string) => {
  codeValue.value = v;
  console.log(v);
};
</script>
<style scoped></style>
