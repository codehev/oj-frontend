<template>
  <div id="code-editor" ref="codeEditorRef"></div>
  <!--  <button @click="fillValue">按钮</button>-->
</template>

<script setup lang="ts">
import * as monaco from "monaco-editor";
import { defineProps, onMounted, ref, toRaw, watch, withDefaults } from "vue";
import LanguageEnum from "@/enum/LanguageEnum";
import { LanguageValue, DefaultCodeEnum } from "@/enum/DefaultCodeEnum";

const codeEditorRef = ref(); //div的ref对象
const codeEditor = ref(); //代码编辑器实例
// const value = ref(""); //代码编辑器默认显示值

/**
 * 定义组件属性类型
 */
interface Props {
  value: string;
  language: string;
  handleChange?: (v: string) => void;
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
  value: DefaultCodeEnum.java,
  language: LanguageEnum.JAVA,
});

/**
 * 监听language变化
 * 动态更改编辑器的语言
 *
 * 注意：父组件传递来的数据与原来一样，并不会触发监听
 */
watch(
  props,
  () => {
    if (codeEditor.value) {
      monaco.editor.setModelLanguage(
        toRaw(codeEditor.value).getModel(),
        props.language
      );
      //此方式无效
      // codeEditor.value.updateOptions({
      //   language: props.language,
      // });

      toRaw(codeEditor.value).setValue(props.value);
    }
  },
  { immediate: true, deep: true }
);

/**
 * 加载代码编辑器
 */
const loadCodeEditor = () => {
  // 使用 - 创建 monacoEditor 对象
  codeEditor.value = monaco.editor.create(codeEditorRef.value, {
    theme: "vs-dark", // 主题
    value: props.value, // 默认显示的值
    language: props.language,
    folding: true, // 是否折叠
    foldingHighlight: true, // 折叠等高线
    foldingStrategy: "indentation", // 折叠方式  auto | indentation
    showFoldingControls: "always", // 是否一直显示折叠 always | mouseover
    disableLayerHinting: true, // 等宽优化
    emptySelectionClipboard: false, // 空选择剪切板
    selectionClipboard: false, // 选择剪切板
    automaticLayout: true, // 自动布局
    codeLens: false, // 代码镜头
    scrollBeyondLastLine: false, // 滚动完最后一行后再滚动一屏幕
    colorDecorators: true, // 颜色装饰器
    accessibilitySupport: "off", // 辅助功能支持  "auto" | "off" | "on"
    lineNumbers: "on", // 行号 取值： "on" | "off" | "relative" | "interval" | function
    lineNumbersMinChars: 5, // 行号最小字符   number
    // enableSplitViewResizing: false,
    readOnly: true, //是否只读  取值 true | false
    minimap: {
      enabled: false,
    },
  });
};

onMounted(() => {
  //如果codeEditorRef实例不存在
  if (!codeEditorRef.value) {
    return;
  }
  //加载代码编辑器
  loadCodeEditor();
});
</script>

<style scoped>
#code-editor {
  /*min-height: 400px;*/
  /*默认屏幕9/10高度*/
  height: 80vh;
}
</style>
