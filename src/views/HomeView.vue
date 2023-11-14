<template>
  <!--  默认以文件名为组件名，使用ESLint时组件名只能多单词命名-->
  <div id="app">
    <span>home</span>
    <CodeEditor :value="codeValue" :handle-change="onCodeChange" />
    <MdEditor :value="mdValue" :handle-change="onMdChange" />
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import MdEditor from "@/components/MdEditor.vue";
import CodeEditor from "@/components/CodeEditor.vue";

const mdValue = ref("");
const onMdChange = (v: string) => {
  mdValue.value = v;
  console.log(v);
};

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
<style scoped>
#app {
  min-height: 1000px;
}
</style>
