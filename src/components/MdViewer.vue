<template>
  <!--md浏览器-->
  <!--属性可以在官网查-->
  <Viewer :value="value" :plugins="plugins" />
</template>

<script setup lang="ts">
import { Viewer } from "@bytemd/vue-next";
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";
import { withDefaults, defineProps } from "vue";

const plugins = [gfm(), highlight()];

/**
 * 定义组件属性类型
 */
interface Props {
  value: string;
}

/**props：自定义组件属性
 * withDefaults:当父组件没有传值，使用在此定义的默认值
 * defineProps<Props>()：固定写法，定义默认值的属性类型
 */
const props = withDefaults(defineProps<Props>(), {
  value: () => "",
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
