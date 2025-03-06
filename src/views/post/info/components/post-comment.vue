<template>
  <a-card :bordered="false" class="comment-container">
    <inner-post-comment v-if="!loading" :comments="commentList" />
    <a-skeleton v-if="loading" animation>
      <a-space direction="vertical" :style="{ width: '100%' }" size="large">
        <a-skeleton-shape />
        <a-skeleton-line :rows="3" :widths="['40%', '100%', '100%']" />
      </a-space>
    </a-skeleton>
    <template #actions>
      <a-button
        v-if="!commentVisible"
        type="primary"
        shape="round"
        @click="commentVisible = !commentVisible"
      >
        <template #icon>
          <IconMessage />
        </template>
        评论
      </a-button>
    </template>
    <div v-if="commentVisible" class="md-editor-container">
      <a-textarea
        v-model="commentContent"
        placeholder="有好交流哦~"
        style="height: 100px"
      />
      <a-row class="pt-1.5">
        <a-col :flex="1" />
        <a-col :span="5.5">
          <a-space>
            <a-button @click="commentVisible = !commentVisible">取消</a-button>
            <a-button
              type="primary"
              style="text-align: right"
              @click="submitComment"
            >
              提交
            </a-button>
          </a-space>
        </a-col>
      </a-row>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from "vue";
import { IconMessage } from "@arco-design/web-vue/es/icon";
import { Message } from "@arco-design/web-vue";
import InnerPostComment from "@/views/post/info/components/inner-post-comment.vue";
import { useRoute } from "vue-router";
import {
  PostCommentControllerService,
  PostCommentVO,
} from "../../../../../generated";

const commentVisible = ref(false);
const commentContent = ref("");
const postId = Number(useRoute().query.postId);
const submitComment = async () => {
  var res = await PostCommentControllerService.saveUsingPost({
    content: commentContent.value,
    postId: postId,
  });
  if (res.code === 0) {
    Message.success("评论成功");
    commentVisible.value = false;
    commentContent.value = "";
    getRootComment();
  } else {
    Message.error("评论失败，" + res.message);
  }
};

const commentList = ref<PostCommentVO[]>([]);
onMounted(() => {
  nextTick(() => {
    getRootComment();
  });
});

const loading = ref(false);

/**
 * 获取根节点评论
 */
const getRootComment = async () => {
  // loading.value = true;
  // OjPostCommentService.list(postId)
  //   .then((res) => {
  //     commentList.value = res.result;
  //   })
  //   .finally(() => {
  //     loading.value = false;
  //   });
  // var res = await PostCommentControllerService.listChildrenUsingGet(postId);
  // if (res.code === 0) {
  //   commentList.value = res.data as PostCommentVO[];
  // } else {
  //   Message.error("获取评论失败");
  // }
};
</script>

<style scoped lang="less"></style>
