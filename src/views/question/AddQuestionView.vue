<template>
  <!-- 添加或更新题目页面 -->
  <div id="addQuestionView">
    <BreadcrumbComponent :items="items" />
    <h2 style="text-align: center">
      {{ isUpdatePage ? "更新题目" : "创建题目" }}
    </h2>
    <a-form ref="formRef" :model="form" @submit="doSubmit">
      <!--:show-colon="true"显示冒号-->
      <a-form-item
        field="title"
        label="标题"
        :show-colon="true"
        :rules="[
          { required: true, message: '标题是必填项' },
          { minLength: 5, message: '必须大于5个字符' },
          { maxLength: 80, message: '必须小于80个字符' },
        ]"
        :validate-trigger="['change', 'input']"
      >
        <a-input
          v-model="form.title"
          placeholder="请输入标题"
          :style="{ maxWidth: '350px' }"
        />
      </a-form-item>
      <a-form-item
        field="tags"
        label="标签"
        :show-colon="true"
        :rules="[
          { required: true, message: '标签是必填项' },
          {
            type: 'array',
            minLength: 1,
            message: '至少有一个标签',
          },
        ]"
        :validate-trigger="['change', 'input']"
      >
        <a-input-tag
          v-model:model-value="form.tags"
          :style="{ maxWidth: '350px' }"
          placeholder="请添加标签"
          allow-clear
        />
      </a-form-item>
      <a-form-item
        field="content"
        label="内容"
        :show-colon="true"
        :rules="[{ required: true, message: '内容是必填项' }]"
        validate-trigger="input"
      >
        <!--没法通过v-model绑定值，通过函数handle-change手动获取值-->
        <MdEditor
          class="mdEditor"
          :value="form.content"
          :handle-change="onContentChange"
        />
      </a-form-item>
      <a-form-item
        field="answer"
        label="答案"
        :show-colon="true"
        :rules="[{ required: true, message: '答案是必填项' }]"
        validate-trigger="input"
      >
        <a-space direction="vertical" style="width: 100%">
          <a-button
            type="primary"
            @click="generateAnswer"
            class="generate-button"
            style="margin-bottom: 10px"
          >
            <IconPark type="magic" theme="filled" size="16" fill="#fff" />
            AI生成答案
          </a-button>
          <MdEditor
            class="mdEditor"
            :value="form.answer"
            :handle-change="onAnswerChange"
          />
        </a-space>
      </a-form-item>
      <a-form-item label="测试用例" :show-colon="true">
        <a-space direction="vertical">
          <!--综合嵌套数据和动态表单的写法-->
          <a-space
            v-for="(judgeCaseItem, index) of form.judgeCase"
            :key="index"
            direction="vertical"
            style="min-width: 480px"
          >
            <a-form-item
              :field="`judgeCase[${index}].input`"
              :label="`输入用例${index + 1}`"
              :key="index"
              :show-colon="true"
              :rules="[{ required: true, message: '输入用例是必填项' }]"
              validate-trigger="input"
            >
              <!--直接judgeCaseItem.output，而非judgeCase[${index}].output，arco design的动态表单的写法，参考官方文档-->
              <a-input
                v-model="judgeCaseItem.input"
                placeholder="请输入输入用例"
              />
            </a-form-item>
            <a-form-item
              :field="`judgeCase[${index}].output`"
              :label="`输出用例${index + 1}`"
              :key="index"
              :show-colon="true"
              :rules="[{ required: true, message: '输出用例是必填项' }]"
              validate-trigger="input"
            >
              <!--直接judgeCaseItem.output，而非judgeCase[${index}].output，arco design的动态表单的写法，参考官方文档-->
              <a-input
                v-model="judgeCaseItem.output"
                placeholder="请输入输出用例"
              />
            </a-form-item>
            <a-button
              status="danger"
              @click="handleDelete(index)"
              :style="{ marginLeft: '10px' }"
              >删除
            </a-button>
          </a-space>
          <div style="margin-top: 20px">
            <a-button type="outline" status="success" @click="handleAdd"
              >新增测试用例
            </a-button>
          </div>
        </a-space>
      </a-form-item>
      <a-form-item
        label="判题配置"
        :show-colon="true"
        :content-flex="false"
        :merge-props="false"
      >
        <a-space direction="vertical" style="min-width: 480px">
          <a-form-item
            field="judgeConfig.timeLimit"
            validate-trigger="input"
            :rules="[
              { required: true, message: '时间限制是必填项' },
              {
                type: 'number',
                min: 0,
                max: 60000,
                message: '时间限制必须大于 0 小于 1min',
              },
            ]"
            label="时间限制"
            :show-colon="true"
          >
            <a-input-number
              v-model="form.judgeConfig.timeLimit"
              :min="0"
              placeholder="请输入时间限制"
              mode="button"
            />
            ms
          </a-form-item>
          <a-form-item
            field="judgeConfig.memoryLimit"
            validate-trigger="input"
            :rules="[
              { required: true, message: '内存限制是必填项' },
              {
                type: 'number',
                min: 0,
                max: 1048576,
                message: '内存限制必须大于 0 小于1024mb',
              },
            ]"
            label="内存限制"
            :show-colon="true"
          >
            <a-input-number
              v-model="form.judgeConfig.memoryLimit"
              :min="0"
              placeholder="请输入内存限制"
              mode="button"
            />
            kb
          </a-form-item>
          <a-form-item
            field="judgeConfig.stackLimit"
            validate-trigger="input"
            :rules="[
              { required: true, message: '堆栈限制是必填项' },
              {
                type: 'number',
                min: 0,
                max: 1048576,
                message: '堆栈限制必须大于 0 小于1024mb',
              },
            ]"
            label="堆栈限制"
            :show-colon="true"
          >
            <a-input-number
              v-model="form.judgeConfig.stackLimit"
              :min="0"
              placeholder="请输入堆栈限制"
              mode="button"
            />
            kb
          </a-form-item>
        </a-space>
      </a-form-item>
      <a-form-item style="margin-top: 16px">
        <a-space>
          <a-button type="primary" style="min-width: 200px" html-type="submit"
            >{{ isUpdatePage ? "更新" : "创建" }}题目
          </a-button>
          <a-button @click="formRef.resetFields()">重置</a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from "vue";
import MdEditor from "@/components/markdown/MdEditor.vue";
import message from "@arco-design/web-vue/es/message";
import { useRoute } from "vue-router";
import {
  AiControllerService,
  QuestionControllerService,
} from "../../../generated";
import { IconPark } from "@icon-park/vue-next/es/all";
import BreadcrumbComponent from "@/components/breadcrumb/BreadcrumbComponent.vue";
import { BreadcrumbItem } from "@/components/breadcrumb/types";

// 表单ref
const formRef = ref();

const route = useRoute();
// 如果页面地址包含 update，视为更新页面,includes()返回Boolean值
const isUpdatePage = route.path.includes("update");
const items = ref<BreadcrumbItem[]>([
  {
    path: "/manage/question",
    name: "题目管理",
  },
  {
    path: isUpdatePage ? "/update/question" : "/add/question",
    name: isUpdatePage ? "更新题目" : "创建题目",
    query: {
      id: route.query.id as string,
    },
  },
]);

let form = reactive({
  title: "",
  tags: [],
  answer: "",
  content: "",
  judgeCase: [
    {
      input: "",
      output: "",
    },
  ],
  judgeConfig: {
    timeLimit: 1000,
    memoryLimit: 1024,
    stackLimit: 1024,
  },
});
/**
 * 动态表单的方法：测试用例
 */
const handleAdd = () => {
  // 数组中添加一条元素
  form.judgeCase.push({
    input: "",
    output: "",
  });
};
const handleDelete = (index: number) => {
  if (form.judgeCase.length == 1) {
    message.error("至少保留一个测试用例");
    return;
  }
  // 删除数组中指定索引的元素
  form.judgeCase.splice(index, 1);
};
/**
 * md编辑器定义的方法
 * @param value
 */
const onContentChange = (value: string) => {
  form.content = value;
  // console.log(value);
};
const onAnswerChange = (value: string) => {
  form.answer = value;
  // console.log(value);
};

/**
 * 表单数据回填
 */
const loadData = async () => {
  //获取题目id
  const id = route.query.id as any;
  //避免创建题目时调用
  if (!id) {
    return;
  }
  const res = await QuestionControllerService.getQuestionByIdUsingGet(id);
  if (res.code === 0) {
    // if (res.data?.judgeCase) {
    //   res.data.judgeCase = JSON.parse(res.data.judgeCase);
    // }
    // if (res.data?.judgeConfig) {
    //   res.data.judgeConfig = JSON.parse(res.data.judgeConfig);
    // }
    // if (res.data?.tags) {
    //   res.data.tags = JSON.parse(res.data.tags);
    // }
    // console.log(res.data);
    Object.assign(form, res.data);

    if (form.judgeCase) {
      form.judgeCase = JSON.parse(form.judgeCase as any);
    } else {
      form.judgeCase = [
        {
          input: "",
          output: "",
        },
      ];
    }
    if (form.judgeConfig) {
      form.judgeConfig = JSON.parse(form.judgeConfig as any);
    } else {
      form.judgeConfig = {
        timeLimit: 1000,
        memoryLimit: 1000,
        stackLimit: 1000,
      };
    }
    if (form.tags) {
      form.tags = JSON.parse(form.tags as any);
    } else {
      form.tags = [];
    }
    // console.log(form);
  } else {
    message.error("加载失败，" + res.message);
  }
};
onMounted(() => {
  loadData();
});
/**
 * 提交表单
 */
const doSubmit = async ({ values, errors }: any) => {
  // console.log("values:", values, "\nerrors:", errors);
  // console.log("\nform:", form);
  // console.log("bject.keys(errors):", Object.keys(errors));
  if (errors) {
    return;
  }
  // if (errors != undefined && Object.keys(errors).length > 0) {
  //   return;
  // }
  if (isUpdatePage) {
    const res = await QuestionControllerService.updateQuestionUsingPost(form);
    if (res.code === 0) {
      message.success("更新成功");
    } else {
      message.error("更新失败，" + res.message);
    }
  } else {
    const res = await QuestionControllerService.addQuestionUsingPost(form);
    if (res.code === 0) {
      message.success("创建成功");
    } else {
      message.error("创建失败，" + res.message);
    }
  }
};

// 生成答案的方法
const generateAnswer = async () => {
  // 检查题目内容是否为空
  if (!form.content.trim()) {
    message.error("题目内容不能为空，请输入题目内容。");
    return;
  }

  // 校验测试用例是否为空
  for (const judgeCase of form.judgeCase) {
    if (!judgeCase.input.trim() || !judgeCase.output.trim()) {
      message.error("所有测试用例的输入和输出不能为空。");
      return;
    }
  }

  try {
    const res = await AiControllerService.generateAnswerByAiUsingPost({
      questionContent: form.content,
      judgeCase: form.judgeCase,
    });
    if (res.code === 0) {
      form.answer = res.data; // 将生成的答案填充到表单中
      message.success("答案生成成功");
    } else {
      message.error("生成答案失败，" + res.message);
    }
  } catch (error) {
    message.error("请求失败，请重试");
  }
};
</script>

<style scoped>
#addQuestionView {
  max-width: 1280px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.mdEditor {
  width: 100%;
  max-width: 1200px;
  margin-bottom: 20px;
}

h2 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

a-button[type="primary"] {
  background-color: #4caf50;
  border-color: #4caf50;
  color: white;
  transition: background-color 0.3s, transform 0.2s;
}

a-button[type="primary"]:hover {
  background-color: #45a049;
  border-color: #45a049;
}

a-button[type="primary"]:active {
  transform: scale(0.95);
}

a-button[type="outline"] {
  border-color: #4caf50;
  color: #4caf50;
}

a-button[type="outline"]:hover {
  background-color: #f1f1f1;
  border-color: #45a049;
  color: #45a049;
}

a-space {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}
</style>
