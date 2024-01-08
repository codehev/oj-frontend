<template>
  <div id="questionSubmitView">
    <a-form :model="searchParams" layout="inline">
      <a-form-item
        field="questionId"
        label="题目ID"
        :show-colon="true"
        style="min-width: 280px"
      >
        <a-input
          v-model="searchParams.questionId"
          placeholder="请输入题目ID..."
        />
      </a-form-item>
      <a-form-item
        field="language"
        label="编程语言"
        :show-colon="true"
        style="min-width: 280px"
      >
        <a-select
          v-model="searchParams.language"
          :style="{ width: '160px' }"
          placeholder="请选择编程语言..."
          allow-clear
        >
          <a-option v-for="(language, key) in languageEnum" :key="key"
            >{{ language }}
          </a-option>
        </a-select>
      </a-form-item>
      <!--      <a-form-item>-->
      <!--        <a-button type="primary" @click="doSubmit">搜索</a-button>-->
      <!--      </a-form-item>-->
      <a-switch
        style="float: right; margin-right: 16px"
        v-model="searchParams.userId"
        :checked-value="userInfo.id"
        unchecked-value=""
        @change="onSwitchChange"
      >
        <template #checked> 我的</template>
        <template #unchecked> 全部</template>
      </a-switch>
      <IconPark
        class="refreshBtn"
        style="float: right"
        type="refresh"
        theme="filled"
        fill="#333"
        size="28"
        @click="onRefresh"
      />
    </a-form>

    <a-divider :size="0" />
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
        <template v-if="record.userId == userInfo?.id">
          <router-link
            class="tableLink"
            :to="{
              path: `/user/home/${record.userId}`,
            }"
            >{{ record.id }}
          </router-link>
        </template>
        <template v-else>{{ record.id }}</template>
      </template>
      <!--用户-->
      <template #userName="{ record }">
        <router-link
          class="tableLink"
          :to="{
            path: `/user/home/${record.userId}`,
          }"
          >{{ record.userVO.userName }}
        </router-link>
      </template>
      <!--题目-->
      <template #title="{ record }">
        <router-link
          class="tableLink"
          :to="{
            path: `/view/question/${record.questionId}`,
          }"
          >{{ record.questionVO.title }}
        </router-link>
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
} from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import { useRouter } from "vue-router";
import moment from "moment";
import languageEnum from "@/enum/LanguageEnum";
import statusEnum from "../../enum/StatusEnum";
import { useStore } from "vuex";
import { IconPark } from "@icon-park/vue-next/es/all";

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
const columns = [
  {
    title: "#",
    slotName: "id",
  },
  {
    title: "用户",
    slotName: "userName",
  },
  {
    title: "题目",
    slotName: "title",
  },
  {
    title: "判题状态",
    slotName: "status",
  },
  {
    title: "判题结果",
    slotName: "judgeMessage", //插槽名称
  },
  {
    title: "时间消耗",
    slotName: "judgeTime", //插槽名称
  },
  {
    title: "内存消耗",
    slotName: "judgeMemory", //插槽名称
  },
  {
    title: "编程语言",
    dataIndex: "language",
    sortable: {
      sortDirections: ["ascend", "descend"],
    },
  },
  {
    title: "提交时间",
    slotName: "createTime", //插槽名称
    sortable: {
      sortDirections: ["ascend", "descend"],
    },
  },
];

/**
 * 跳转到做题页面
 * @param id
 */
const route = useRouter();
const toQuestionPage = (id: number) => {
  route.push({
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

const onRefresh = () => {
  //即使原来页面也是1，也能监听得到改变
  searchParams.value = { ...searchParams.value, current: 1 };
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
</script>

<style scoped>
#questionSubmitView {
  max-width: 1280px;
  margin: 0 auto;
}

.tableLink:link {
  color: #0275d8;
  text-decoration: none;
}

.tableLink:visited {
  color: #0275d8;
}

.tableLink:hover {
  color: #014c8c;
  text-decoration: underline;
}
</style>
