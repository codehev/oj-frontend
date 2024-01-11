<template>
  <!--md编辑器-->
  <!--属性可以在官网查-->
  <Editor
    :value="value"
    :mode="mode"
    :plugins="plugins"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import { Editor } from "@bytemd/vue-next";
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";
import { withDefaults, defineProps } from "vue";

const plugins = [
  gfm(),
  highlight(),
  // Add more plugins here
];
// const value = ref("");
// const handleChange = (v: string) => {
//   value.value = v;
// };

/**
 * 定义组件属性，暴露给父组件，便于父组件去使用，同时也是提高组件的通用性
 */
interface Props {
  value: string;
  // 显示模式：split（两列，实时预览）, tab, auto
  mode?: string;
  handleChange: (v: string) => void;
}

/**
 * props：自定义组件属性，暴露给父组件，便于父组件去使用，同时也是提高组件的通用性
 *
 * Vue 3 中的 `withDefaults` 函数是一个工厂函数，用于创建一个具有默认值的响应式对象。
 * 它可以用于创建可重用的组件选项，并且可以通过给它传递不同的默认值来创建不同的配置。
 *
 * `defineProps` 函数则是 Vue 3 中的一个用于定义响应式 prop 的函数。它可以用于在组件定义时声明 prop，
 * 并且可以指定 prop 的默认值、类型约束和参数验证器。
 *
 * 其实这里设置默认值没啥用，因为父组件会给值，覆盖这里的
 */
const props = withDefaults(defineProps<Props>(), {
  value: () => "",
  mode: () => "auto", // 显示模式：split（两列，实时预览）, tab, auto
  handleChange: (v: string) => {
    // console.log(v);
  },
});
</script>

<style>
/*
  隐藏编辑器上github图标（超链接）
  要把<style>中的scoped删了，不然无法生效
*/
.bytemd-toolbar-icon.bytemd-tippy.bytemd-tippy-right:last-child {
  display: none;
}
</style>
