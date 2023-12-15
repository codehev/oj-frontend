<template>
  <!--md编辑器-->
  <!--属性可以在官网查-->
  <Editor
    id="editor"
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

/**props：自定义组件属性
 * withDefaults:当父组件没有传值，使用在此定义的默认值
 * defineProps<Props>()：固定写法，定义默认值的属性类型
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

#editor {
  width: 800px;
}
</style>
