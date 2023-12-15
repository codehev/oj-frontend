<template>
  <div id="viewQuestionView">
    <a-button type="text" @click="router.back()">返回</a-button>
    <!--指定 gutter 可以增加栅格的区域间隔-->
    <a-row class="grid" :gutter="[24, 24]">
      <!--响应式布局，预置六种响应尺寸, 分别为 xs, sm, md, lg, xl, xxl。（从左到右依次变大）
      当窗口宽度对应对应尺寸时使用对应的宽度-->
      <a-col :md="12" :xs="24">
        <a-tabs default-active-key="question">
          <a-tab-pane key="question" title="题目描述">
            <a-card v-if="question" :title="question.title">
              <!--              不同窗口大小，动态调整列数-->
              <a-descriptions
                title="判题条件"
                :column="{ xs: 1, md: 2, lg: 3 }"
              >
                <a-descriptions-item label="时间限制">
                  {{ question.judgeConfig.timeLimit ?? 0 }}ms
                </a-descriptions-item>
                <a-descriptions-item label="内存限制">
                  {{ question.judgeConfig.memoryLimit ?? 0 }}kb
                </a-descriptions-item>
                <a-descriptions-item label="堆栈限制">
                  {{ question.judgeConfig.stackLimit ?? 0 }}kb
                </a-descriptions-item>
              </a-descriptions>
              <MdViewer :value="question.content || ''" />
              <template #extra>
                <a-space wrap>
                  <a-tag
                    v-for="(tag, index) in question.tags"
                    :key="index"
                    color="green"
                    >{{ tag }}
                  </a-tag>
                </a-space>
              </template>
            </a-card>
          </a-tab-pane>
          <a-tab-pane key="2" title="评论"> 评论区</a-tab-pane>
          <a-tab-pane key="3" title="题解">暂无答案</a-tab-pane>
          <a-tab-pane key="4" title="提交记录">
            Content of Tab Panel 4
          </a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :md="12" :xs="24">
        <a-form :model="form" layout="inline">
          <a-form-item
            field="language"
            label="编程语言"
            style="min-width: 280px"
          >
            <a-select
              v-model="form.language"
              :style="{ width: '320px' }"
              placeholder="请选择编程语言..."
            >
              <a-option v-for="(language, key) in languageEnum" :key="key"
                >{{ language }}
              </a-option>
            </a-select>
          </a-form-item>
        </a-form>
        <CodeEditor
          :value="form.code"
          :language="form.language"
          :handle-change="onCodeChange"
        />
        <a-divider :size="0" />
        <a-button type="primary" style="min-width: 200px" @click="onSubmit"
          >提交代码
        </a-button>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, withDefaults, defineProps } from "vue";
import {
  QuestionControllerService,
  QuestionSubmitAddRequest,
  QuestionSubmitControllerService,
  QuestionVO,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import CodeEditor from "@/components/CodeEditor.vue";
import MdViewer from "@/components/MdViewer.vue";
import languageEnum from "@/enum/languageEnum";
import router from "@/router";

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
  language: "java",
  code: "",
});
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
  max-width: 1400px;
  margin: 0 auto;
}

/*调整a-tag*/
#viewQuestionView .arco-space-horizontal .arco-space-item {
  /*!important提升优先级*/
  margin-bottom: 0 !important;
}
</style>
