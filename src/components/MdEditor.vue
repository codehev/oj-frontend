<template>
  <Editor :value="value" :plugins="plugins" @change="handleChange" />
</template>

<script setup lang="ts">
import { Editor, Viewer } from "@bytemd/vue-next";
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight";
import { ref, withDefaults, defineProps } from "vue";

const value = ref("");

const plugins = [
  gfm(),
  highlight(),
  // Add more plugins here
];
const handleChange = (v: string) => {
  value.value = v;
};

/**
 * 定义组件属性类型
 */
interface Props {
  value: string;
  handleChange: (v: string) => void;
}

/**props：自定义组件属性
 * withDefaults:当父组件没有传值，使用在此定义的默认值
 * defineProps<Props>()：固定写法，定义默认值的属性类型
 */
const props = withDefaults(defineProps<Props>(), {
  value: () => "",
  handleChange: (v: string) => {
    // console.log(v);
  },
});
</script>

<style scoped>
.bytemd-toolbar-icon.bytemd-tippy.bytemd-tippy-right:last-child {
  display: none;
}
</style>
