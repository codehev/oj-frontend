<template>
  <!-- 查看题目页面 -->
  <div id="viewQuestionView">
    <a-split
      :default-size="0.5"
      :min="0.01"
      :max="0.99"
      :style="{
        height: '95vh',
        width: '100%',
      }"
    >
      <template #first>
        <div class="leftDiv">
          <a-tabs default-active-key="1">
            <a-tab-pane key="1">
              <template #title>
                <IconPark
                  type="transaction-order"
                  theme="filled"
                  size="16"
                  fill="#007bff"
                />
                题目描述
              </template>
              <!--滚动条-->
              <a-scrollbar
                type="embed"
                style="height: 95vh; margin: 15px; overflow: auto"
              >
                <a-space wrap>
                  <a-tag
                    v-for="(tag, index) in question?.tags"
                    :key="index"
                    color="green"
                    >{{ tag }}
                  </a-tag>
                </a-space>
                <!--描述，不同窗口大小，动态调整列数-->
                <a-descriptions
                  title="判题条件："
                  :column="{ xs: 1, md: 2, lg: 3 }"
                >
                  <a-descriptions-item label="时间限制">
                    {{ question?.judgeConfig?.timeLimit ?? 0 }}ms
                  </a-descriptions-item>
                  <a-descriptions-item label="内存限制">
                    {{ question?.judgeConfig?.memoryLimit ?? 0 }}kb
                  </a-descriptions-item>
                  <a-descriptions-item label="堆栈限制">
                    {{ question?.judgeConfig?.stackLimit ?? 0 }}kb
                  </a-descriptions-item>
                </a-descriptions>
                <MdViewer :value="question?.content || ''" />
              </a-scrollbar>
            </a-tab-pane>
            <a-tab-pane key="2">
              <template #title>
                <IconPark
                  type="cuvette"
                  theme="filled"
                  size="16"
                  fill="#007bff"
                />
                题解
              </template>
              暂无题解
              {{ question?.title }}
            </a-tab-pane>
            <a-tab-pane key="3" title="提交记录">
              <template #title>
                <IconPark
                  type="history"
                  theme="filled"
                  size="16"
                  fill="#007bff"
                />
                提交记录
              </template>
              暂无提交记录
            </a-tab-pane>
            <a-tab-pane key="4" title="评论">
              <template #title>
                <IconPark
                  type="comment"
                  theme="filled"
                  size="16"
                  fill="#007bff"
                />
                评论
              </template>
              暂无评论
            </a-tab-pane>
          </a-tabs>
        </div>
      </template>
      <template #second>
        <div class="rightDiv">
          <a-tabs>
            <template #extra>
              <a-space style="margin-right: 10px">
                <a-select
                  size="small"
                  v-model="form.language"
                  :style="{ width: '80px' }"
                  placeholder="请选择编程语言..."
                >
                  <a-option v-for="(language, key) in LanguageEnum" :key="key"
                    >{{ language }}
                  </a-option>
                </a-select>
                <a-button
                  type="primary"
                  size="small"
                  style="min-width: 60px"
                  @click="onSubmit"
                >
                  <template #icon>
                    <IconPark
                      type="upload-one"
                      theme="filled"
                      size="24"
                      fill="#fff"
                    />
                  </template>
                  <template #default>提交代码</template>
                </a-button>
              </a-space>
            </template>
            <a-tab-pane key="1">
              <template #title>
                <IconPark type="code" theme="filled" size="16" fill="#02b128" />
                代码
              </template>
              <CodeEditor
                :style="{
                  height: '89vh',
                  width: '100%',
                }"
                :value="form.code"
                :language="form.language"
                :handle-change="onCodeChange"
              />
            </a-tab-pane>
          </a-tabs>
        </div>
      </template>
    </a-split>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, withDefaults, defineProps } from "vue";
import {
  QuestionControllerService,
  QuestionSubmitAddRequest,
  QuestionVO,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import CodeEditor from "@/components/CodeEditor.vue";
import MdViewer from "@/components/MdViewer.vue";
import LanguageEnum from "@/enum/LanguageEnum";
import { DefaultCodeEnum } from "@/enum/DefaultCodeEnum";
import { IconPark } from "@icon-park/vue-next/es/all";

interface Props {
  id: string;
}

const props = withDefaults(defineProps<Props>(), { id: () => "" });

const question = ref<QuestionVO>();

/**
 * 加载表格数据
 */
const loadData = async () => {
  //获取题目封装类
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    props.id as any
  );
  if (res.code === 0) {
    question.value = res.data;
  } else {
    message.error("加载失败" + res.message);
  }
};
onMounted(() => {
  loadData();
});
/**
 * 提交代码
 */
const form = ref<QuestionSubmitAddRequest>({
  language: LanguageEnum.JAVA,
  code: DefaultCodeEnum.java,
});
//父组件向子组件传递一个函数
const onCodeChange = (v: string) => {
  form.value.code = v;
  // console.log(v);
};
const onSubmit = async () => {
  if (!question.value?.id) {
    return;
  }
  const res = await QuestionControllerService.doQuestionSubmitUsingPost({
    ...form.value,
    questionId: question.value?.id,
  });
  if (res.code === 0) {
    message.success("提交成功");
  } else {
    message.error("提交失败" + res.message);
  }
};
</script>

<style scoped>
#viewQuestionView {
  margin: 0 auto;
}

/*调整a-tag*/
#viewQuestionView .arco-space-horizontal .arco-space-item {
  /*!important提升优先级*/
  margin-bottom: 0 !important;
}

/* 隐藏滚动条但能滚动 */
.leftDiv::-webkit-scrollbar {
  display: none;
}

.rightDiv::-webkit-scrollbar {
  display: none;
}

.leftDiv,
.rightDiv {
  background-color: #ffffff;
  /* length具体尺寸*/
  border-radius: 10px;
  padding: 5px;
}
</style>
