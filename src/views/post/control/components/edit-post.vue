<template>
  <div class="container-edit-post">
    <BreadcrumbComponent :items="items" />
    <a-form ref="formRef" :model="postUpdateRequest">
      <a-row style="margin-bottom: 10px">
        <a-col :span="24" style="text-align: right">
          <a-button type="primary" html-type="submit" @click="handleSubmit">
            {{ isUpdatePage ? "更新帖子" : "发布帖子" }}
          </a-button>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="8">
          <a-form-item
            field="title"
            label="标题"
            :rules="[
              {
                required: true,
                message: '请输入标题',
              },
            ]"
          >
            <a-input
              v-model="postUpdateRequest.title"
              placeholder="请输入标题"
              size="large"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
            field="zoneId"
            label="分区"
            :rules="[
              {
                required: true,
              },
            ]"
          >
            <a-select
              v-model="postUpdateRequest.zoneId"
              placeholder="请选择分区"
              allow-clear
              :options="zoneOptions"
            ></a-select>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
            field="tags"
            label="标签"
            :rules="[
              {
                required: false,
              },
            ]"
          >
            <a-input-tag
              v-model="postUpdateRequest.tags"
              allow-clear
              placeholder="请输入标签并回车"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <MdEditor
      v-model="postUpdateRequest.content"
      placeholder="请输入内容（Markdown格式）"
      :preview="false"
      :auto-detect-code="true"
      @onUploadImg="onUploadImg"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { SelectOptionData } from "@arco-design/web-vue/es/select/interface";
import { MdEditor } from "md-editor-v3";
import { Message } from "@arco-design/web-vue";
import { useRoute, useRouter } from "vue-router";
import BreadcrumbComponent from "@/components/breadcrumb/BreadcrumbComponent.vue";
import { BreadcrumbItem } from "@/components/breadcrumb/types";
import {
  PostUpdateRequest,
  PostControllerService,
  FileControllerService,
  PostZoneControllerService,
} from "../../../../../generated";
// 如果页面地址包含 update，视为更新页面,includes()返回Boolean值
const route = useRoute();
const isUpdatePage = route.path.includes("update");
const items = ref<BreadcrumbItem[]>([
  { path: "/manage/post", name: "帖子管理" },
  {
    path: isUpdatePage ? "/update/post" : "/add/post",
    name: isUpdatePage ? "更新帖子" : "创建帖子",
    query: {
      id: route.query.id as string,
    },
  },
]);
const formRef = ref();
const zoneOptions = ref<SelectOptionData[]>([]);

// 加载分区列表
const loadZoneList = async () => {
  try {
    const res = await PostZoneControllerService.listPostZoneUsingGet();
    if (res.code === 0 && res.data) {
      // 转换为下拉框所需的格式
      zoneOptions.value = res.data.map((zone) => ({
        label: zone.zoneName || "",
        value: zone.id?.toString() || "",
      }));
    } else {
      Message.error("获取分区列表失败，" + res.message);
    }
  } catch (error) {
    Message.error("获取分区列表失败");
  }
};

const postUpdateRequest = ref<PostUpdateRequest>({
  id: 0,
  title: "",
  content: "",
  tags: [],
  zoneId: undefined,
});

const onUploadImg = async (
  files: File[],
  callback: (urls: string[]) => void
) => {
  try {
    const uploadPromises = files.map(async (file: File) => {
      const res = await FileControllerService.uploadFileToMinioUsingPost(
        "post_image",
        file
      );
      if (res.code === 0) {
        return res.data;
      } else {
        Message.error("上传失败:" + res.message);
        throw new Error(res.message);
      }
    });

    const results = await Promise.all(uploadPromises);
    callback(results);
  } catch (error) {
    console.error("文件上传过程中发生错误:", error);
  }
};

const router = useRouter();
const handleSubmit = async () => {
  if (isUpdatePage) {
    const res = await PostControllerService.updatePostUsingPost(
      postUpdateRequest.value
    );
    if (res.code === 0) {
      Message.success("更新成功");
      router.back();
    } else {
      Message.error("更新失败," + res.message);
    }
  } else {
    const res = await PostControllerService.addPostUsingPost(
      postUpdateRequest.value
    );
    if (res.code === 0) {
      Message.success("发布成功");
      router.back();
    } else {
      Message.error("发布失败," + res.message);
    }
  }
};

const loadData = async () => {
  //获取题目id
  const id = route.query.id as string;
  //避免创建题目时调用
  if (!id || id == "") {
    return;
  }
  const res = await PostControllerService.getPostVoByIdUsingGet(id as any);
  if (res.code === 0) {
    postUpdateRequest.value = { tags: res.data?.tagList, ...res.data };
  } else {
    Message.error("获取帖子失败," + res.message);
  }
};
onMounted(() => {
  loadZoneList(); // 加载分区列表
  loadData();
});
</script>

<style scoped lang="less">
.container-edit-post {
  padding: 0 20px 20px;
}

.base-info-button {
  /*右对齐*/
  text-align: right;
  margin-bottom: 10px;
}
</style>
