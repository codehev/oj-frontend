<template>
  <!-- 提交记录页面 -->
  <div id="questionSubmitView">
    <BreadcrumbComponent :items="items" />
    <div class="search-form-container">
      <a-form :model="searchParams" layout="inline" class="search-form">
        <div class="form-left">
          <a-form-item
            field="questionId"
            label="题目ID"
            :show-colon="true"
            class="form-item"
          >
            <a-input
              v-model="questionIdModel"
              placeholder="请输入题目ID..."
              :style="{ width: '200px' }"
              allow-clear
            />
          </a-form-item>
          <a-form-item
            field="language"
            label="编程语言"
            :show-colon="true"
            class="form-item"
          >
            <a-select
              v-model="searchParams.language"
              :style="{ width: '200px' }"
              placeholder="请选择编程语言..."
              allow-clear
            >
              <a-option v-for="(language, key) in languageEnum" :key="key">
                {{ language }}
              </a-option>
            </a-select>
          </a-form-item>
        </div>
        <div class="form-right">
          <a-switch
            class="my-switch"
            v-model="searchParams.userId"
            :checked-value="userInfo.id"
            unchecked-value=""
            @change="onSwitchChange"
          >
            <template #checked>我的提交</template>
            <template #unchecked>全部提交</template>
          </a-switch>
          <a-button
            type="primary"
            shape="round"
            class="refresh-btn"
            :loading="loading"
            @click="onRefresh"
          >
            刷新
          </a-button>
        </div>
      </a-form>
    </div>

    <a-divider style="margin: 16px 0" />
    <!--弹窗，显示提交代码-->
    <template>
      <a-modal v-model:visible="visible" @ok="handleOk" hide-cancel fullscreen>
        <template #title> {{ record?.questionVO?.title }}</template>
        <div class="submission-detail">
          <div class="submission-info">
            <div v-if="record?.judgeInfo?.message === '答案正确'">
              <IconPark
                type="check-one"
                theme="filled"
                size="30"
                fill="#19be6b"
              />
              {{ record?.judgeInfo?.message }}
            </div>
            <div v-else>
              <IconPark
                type="close-one"
                theme="filled"
                size="30"
                fill="#ed3f14"
              />
              {{ record?.judgeInfo?.message }}
            </div>
            <div class="info-items">
              <span>时间：{{ record?.judgeInfo?.time }}ms</span>
              <span>内存：{{ record?.judgeInfo?.memory }}kb</span>
              <span>语言：{{ record?.language }}</span>
              <span>作者：{{ record?.userVO?.userName }}</span>
            </div>
          </div>
          <CodeViewer
            :value="record?.code || 'java'"
            :language="record?.language || 'java'"
            class="code-viewer"
          ></CodeViewer>
        </div>
      </a-modal>
    </template>
    <a-table
      :columns="columns"
      :data="dataList"
      :pagination="{
        total: total,
        current: searchParams.current,
        pageSize: searchParams.pageSize,
        defaultCurrent: 1,
        defaultPageSize: 10,
        showTotal: true,
        showJumper: true,
        showPageSize: true,
      }"
      @page-change="onPageChange"
      @page-size-change="onPageSizeChange"
    >
      <!--提交记录id-->
      <template #id="{ record }">
        <template
          v-if="
            record.userId == userInfo?.id ||
            userInfo?.userRole == AccessEnum.ADMIN
          "
        >
          <a-link class="tableLink" @click="handleClick(record)"
            >{{ record.id }}
          </a-link>
        </template>
        <template v-else>{{ record.id }}</template>
      </template>
      <!--用户-->
      <template #userName="{ record }">
        <router-link
          v-if="record.userVO?.userName"
          class="tableLink"
          :to="{
            path: `/user/home/${record.userId}`,
          }"
          >{{ record.userVO?.userName || "--" }}
        </router-link>
        <span v-else>用户丢失</span>
      </template>
      <!--题目-->
      <template #title="{ record }">
        <router-link
          v-if="record.questionVO?.title"
          class="tableLink"
          :to="{
            path: `/view/question/${record.questionId}`,
          }"
          >{{ record.questionVO?.title || "--" }}
        </router-link>
        <span v-else>题目丢失</span>
      </template>
      <!--判题状态-->
      <template #status="{ record }">
        {{ statusEnum[record.status] }}
      </template>
      <!--判题结果-->
      <template #judgeMessage="{ record }">
        {{ record.judgeInfo.message }}
      </template>
      <!--时间消耗-->
      <template #judgeTime="{ record }">
        {{ record.judgeInfo.time }}ms
      </template>
      <!--内存消耗-->
      <template #judgeMemory="{ record }">
        {{ record.judgeInfo.memory }}kb
      </template>
      <!--创建时间-->
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD h:mm:ss") }}
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watchEffect } from "vue";
import {
  QuestionControllerService,
  QuestionSubmitQueryRequest,
  QuestionSubmitVO,
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";
import languageEnum from "@/enum/LanguageEnum";
import statusEnum from "../../enum/StatusEnum";
import { useStore } from "vuex";
import { IconPark } from "@icon-park/vue-next/es/all";
import AccessEnum from "@/enum/AccessEnum";
import CodeViewer from "@/components/code/CodeViewer.vue";
import BreadcrumbComponent from "@/components/breadcrumb/BreadcrumbComponent.vue";
import { BreadcrumbItem } from "@/components/breadcrumb/types";
import { TableColumnData } from "@arco-design/web-vue/es/table";

const items = ref<BreadcrumbItem[]>([
  {
    path: "/question_submit",
    name: "状态",
  },
]);
/**
 * 查看代码（弹窗相关）
 */
const visible = ref(false);
const record = ref<QuestionSubmitVO>();

const handleClick = (recordValue: any) => {
  visible.value = true;
  record.value = recordValue;
};
const handleOk = () => {
  visible.value = false;
};
/*const handleCancel = () => {
  visible.value = false;
};*/

//搜索参数
const searchParams = ref<QuestionSubmitQueryRequest>({
  questionId: undefined,
  language: undefined,
  userId: undefined,
  pageSize: 10,
  current: 1,
});
//记录条数
const total = ref(0);
//表格数据
const dataList = ref([]);

/**
 * 获取用户信息
 */
let store = useStore();
let userInfo = computed(() => store.state.user.loginUser);

/**
 * 加载表格数据
 */
const loadData = async () => {
  //获取题目封装类
  const res = await QuestionControllerService.listQuestionSubmitByPageUsingPost(
    {
      ...searchParams.value,
      sortField: "createTime", //按创建时间降序
      sortOrder: "descend", //降序
    }
  );
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = Number(res.data.total);
    // message.success("加载成功");
  } else {
    message.error("加载失败，" + res.message);
  }
};
onMounted(() => {
  loadData();
});
/**
 * 每隔15秒刷新一次（更新判题状态）
 */
/*setInterval(() => {
  loadData();
}, 15000);*/

/**
 * 要展示的列，以及设置列属性
 */
const columns = ref<TableColumnData[]>([
  {
    title: "#",
    slotName: "id",
  },
  {
    title: "作者",
    slotName: "userName",
  },
  {
    title: "题目",
    slotName: "title",
  },
  {
    title: "状态",
    slotName: "status",
  },
  {
    title: "结果",
    slotName: "judgeMessage", //插槽名称
  },
  {
    title: "时间",
    slotName: "judgeTime", //插槽名称
  },
  {
    title: "内存",
    slotName: "judgeMemory", //插槽名称
  },
  {
    title: "语言",
    dataIndex: "language",
    sortable: {
      sortDirections: ["ascend", "descend"],
    },
  },
  {
    title: "时间",
    slotName: "createTime", //插槽名称
    sortable: {
      sortDirections: ["ascend", "descend"],
    },
  },
]);

/**
 * 跳转到做题页面
 * @param id
 */
const router = useRouter();
const toQuestionPage = (id: number) => {
  router.push({
    path: `/view/question/${id}`,
  });
};
/**
 * 分页操作
 * @param page
 */
const onPageChange = (page: number) => {
  //这里，复制了 searchParams 的属性，并修改了 current 属性(已有则覆盖复制来的值，没有则添加)
  searchParams.value = { ...searchParams.value, current: page };
  // searchParams.value.current = page;
  // loadData();
};
const onPageSizeChange = (pageSize: number) => {
  searchParams.value = { ...searchParams.value, pageSize, current: 1 };
  // searchParams.value.pageSize = pageSize;
  // loadData();
};

const onSwitchChange = () => {
  searchParams.value = { ...searchParams.value, current: 1 };
};

const loading = ref(false);

const onRefresh = async () => {
  loading.value = true;
  try {
    //即使原来页面也是1（数据与原来一样，但有重新赋值），也能监听得到改变
    searchParams.value = { ...searchParams.value, current: 1 };
    await loadData();
  } finally {
    loading.value = false;
  }
};
/**
 * 监听loadData()中的响应式变量，例如searchParams，改变时触发函数重新调用（页面重新加载）
 *
 * watchEffect() 是 Vue 3 的 Composition API 中的一个函数，
 * 用于在组件内部监视一些响应式依赖项，并在它们更改时重新运行给定的副作用函数。
 * 简答来说里面的值发生了改变就调用一次
 */
watchEffect(() => {
  loadData();
});

const doSubmit = () => {
  searchParams.value = {
    ...searchParams.value,
    current: 1, //先把当前页重置为1，再搜索
  };
  // loadData(); //可以不需要调用，监听loadData()中的变量，searchParams
};

// 计算属性
const questionIdModel = computed({
  get: () =>
    searchParams.value.questionId !== undefined
      ? String(searchParams.value.questionId)
      : "",
  set: (value) => {
    searchParams.value.questionId = value ? Number(value) : undefined; // 将字符串转换回数字
  },
});
</script>

<style scoped>
#questionSubmitView {
  max-width: 1280px;
  margin: 0 auto;
  padding: 20px;
}

.search-form-container {
  background-color: var(--color-bg-2);
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.search-form {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.form-left {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.form-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.form-item {
  margin-bottom: 0;
}

.my-switch {
  min-width: 80px;
  transition: all 0.2s ease;
}

.refresh-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 80px;
  padding: 4px 16px;
  transition: all 0.3s ease;
}

.refresh-btn:not(:disabled):hover {
  transform: scale(1.02);
}

.refresh-btn :deep(.arco-btn-loading-icon) {
  font-size: 14px;
}

.tableLink:link {
  color: rgb(var(--primary-6));
  text-decoration: none;
  transition: color 0.2s ease;
}

.tableLink:visited {
  color: rgb(var(--primary-6));
}

.tableLink:hover {
  color: rgb(var(--primary-7));
  text-decoration: underline;
}

@media screen and (max-width: 768px) {
  .search-form {
    flex-direction: column;
    align-items: stretch;
  }

  .form-right {
    justify-content: flex-end;
    margin-top: 16px;
  }
}

.submission-detail {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
  overflow-y: auto; /* 允许垂直滚动 */
}

.submission-info {
  margin-bottom: 24px;
  padding: 16px;
  background-color: var(--color-fill-2);
  border-radius: 4px;
}

.info-items {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  color: var(--color-text-2);
}
</style>
