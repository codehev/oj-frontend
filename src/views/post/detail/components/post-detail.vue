<template>
  <a-card>
    <a-card-meta>
      <template #title>
        <div>
          <a-typography-title v-if="post.title !== ''" :heading="2" bold>
            {{ post.title }}
          </a-typography-title>
          <a-skeleton v-else animation>
            <a-skeleton-line :rows="1" :widths="['40%']" />
          </a-skeleton>
        </div>
        <div>
          <a-row>
            <a-col :span="4">
              <div class="second-info">
                <a-space size="mini">
                  <icon-user />
                  <a-typography-text class="second-info-color">
                    {{ post?.user?.userName ?? "---" }}
                  </a-typography-text>
                </a-space>
              </div>
            </a-col>
            <a-col :span="3">
              <div class="second-info">
                <a-space size="mini">
                  <icon-clock-circle />
                  <a-typography-text class="second-info-color">
                    {{
                      post.createTime
                        ? dayjs(post.createTime).format("YYYY-MM-DD")
                        : "---"
                    }}
                  </a-typography-text>
                </a-space>
              </div>
            </a-col>
            <a-col :span="3">
              <div class="second-info">
                <a-space size="mini">
                  <icon-eye />
                  <a-typography-text class="second-info-color">
                    {{ post.viewNum ?? "---" }}
                  </a-typography-text>
                </a-space>
              </div>
            </a-col>
          </a-row>
        </div>
      </template>
      <template #description>
        <MdPreview
          v-if="post.content !== ''"
          :modelValue="post.content"
          @on-get-catalog="handleGetCatalog"
        />
        <a-skeleton v-else animation>
          <a-space direction="vertical" fill size="large">
            <a-skeleton-line
              :rows="8"
              :widths="[
                '40%',
                '60%',
                '60%',
                '100%',
                '100%',
                '100%',
                '100%',
                '50%',
              ]"
            />
          </a-space>
        </a-skeleton>
      </template>
    </a-card-meta>
  </a-card>
</template>

<script setup lang="ts">
import { MdPreview } from "md-editor-v3";
import { ref, watch, defineProps, defineEmits } from "vue";
import { PostVO } from "../../../../../generated";
import dayjs from "dayjs";
import {
  IconUser,
  IconClockCircle,
  IconEye,
} from "@arco-design/web-vue/es/icon";

const props = defineProps<{
  postInfo: PostVO;
}>();

const emit = defineEmits(["catalog-change"]);
// 获取目录
const handleGetCatalog = (catalog: string) => {
  emit("catalog-change", catalog);
};

watch(
  () => props.postInfo,
  () => {
    if (props.postInfo) {
      post.value = props.postInfo;
    }
  }
);

const post = ref<PostVO>({
  content: "",
  title: "",
  user: {
    userName: "",
    userAvatar: "",
  },
  createTime: "",
  viewNum: 0,
});
</script>

<style scoped lang="less">
.second-info {
  color: rgba(0, 0, 0, 0.45);
  margin-bottom: 4px;

  &-color {
    color: rgba(0, 0, 0, 0.45);
  }
}
</style>
