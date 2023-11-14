<template>
  <div id="code-editor" ref="codeEditorRef"></div>
  <!--  {{ codeEditor }}-->
  <button @click="fillValue">按钮</button>
</template>

<script setup lang="ts">
import * as monaco from "monaco-editor";
import { defineProps, onMounted, ref, toRaw, withDefaults } from "vue";

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

const codeEditorRef = ref();
const codeEditor = ref();
const value = ref("hello world");
onMounted(() => {
  //如果codeEditorRef实例不存在
  if (!codeEditorRef.value) {
    return;
  }
  // 使用 - 创建 monacoEditor 对象
  codeEditor.value = monaco.editor.create(codeEditorRef.value, {
    theme: "vs-dark", // 主题
    value: value.value, // 默认显示的值
    language: "java",
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
    readOnly: false, //是否只读  取值 true | false
    minimap: {
      enabled: false,
    },
  });

  // 编辑 监听内容变化
  codeEditor.value.onDidChangeModelContent(() => {
    // console.log("目前内容为：", toRaw(codeEditor.value).getValue());
    // toRaw作用：将一个由reactive生成的响应式对象转为普通对象。
    props.handleChange(toRaw(codeEditor.value).getValue());
  });
});

const fillValue = () => {
  //如果codeEditorRef实例不存在
  if (!codeEditor.value) {
    return;
  }
  // console.log(codeEditor.value);
  // console.log(toRaw(codeEditor.value));
  // toRaw作用：将一个由reactive生成的响应式对象转为普通对象。
  toRaw(codeEditor.value).setValue("新的值");
};
</script>

<style scoped>
#code-editor {
  min-height: 400px;
}
</style>
