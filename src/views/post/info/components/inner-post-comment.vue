<template>
  <a-result
    v-if="comments.length === 0"
    status="404"
    subtitle="还木有评论哦~ 点击评论输入第一条评论"
  />
  <a-comment
    v-for="(comment, index) in comments"
    :key="index"
    :author="comment.userName"
    :datetime="comment.createTime"
  >
    <template #avatar>
      <a-avatar
        :image-url="comment.userAvatar"
        trigger-type="mask"
        @click="handleToUserInfo(comment.userId + '')"
      >
        <template #trigger-icon>
          <icon-user />
        </template>
      </a-avatar>
    </template>
    <template #content>
      <MdPreview style="padding: 0; margin: 0" :modelValue="comment.content" />
    </template>
    <template #actions>
      <a-popover :popup-visible="comment.replyFlag" trigger="click">
        <template #content>
          <a-textarea
            v-model="recoverComment.content"
            style="width: 250px; height: 100px"
            placeholder="请友好回复哦~"
          />
          <a-row class="pt-1.5">
            <a-col :flex="1" />
            <a-col :span="5.5">
              <a-button
                type="primary"
                style="text-align: right"
                @click="doRecoverComment(comment)"
              >
                提交
              </a-button>
            </a-col>
          </a-row>
        </template>
        <span class="action" @click="handleRecoverComment(comment)">
          <IconMessage />
          回复
        </span>
      </a-popover>
      <a-link
        v-if="!comment.expandedFlag && comment.children"
        class="action"
        @click="comment.expandedFlag = !comment.expandedFlag"
      >
        <IconDown />
        展开
      </a-link>
      <span
        v-if="comment.expandedFlag"
        class="action"
        @click="comment.expandedFlag = !comment.expandedFlag"
      >
        <IconUp />
        收起
      </span>
    </template>
    <inner-post-comment
      v-if="comment.expandedFlag"
      :comments="comment.children"
    />
  </a-comment>
</template>

<script setup lang="ts">
import { PropType, ref, defineProps } from "vue";
import { IconMessage, IconUser } from "@arco-design/web-vue/es/icon";
import { MdPreview } from "md-editor-v3";
import { Message } from "@arco-design/web-vue";
import router from "@/router";
import { PostCommentRequest, PostCommentVO } from "../../../../../generated";

defineProps({
  comments: {
    type: Array as PropType<PostCommentVO[]>,
    default: () => [],
  },
});

const recoverComment = ref<PostCommentRequest>({
  content: "",
  postId: 0,
  parentId: 0,
});

const handleRecoverComment = (comment: PostCommentVO) => {
  recoverComment.value.parentId = comment.id;
  recoverComment.value.postId = comment.postId;
};

/**
 * 提交回复
 */
const doRecoverComment = (comment: PostCommentVO) => {
  // OjPostCommentService.save(recoverComment.value).then((res) => {
  //   if (res.result) {
  //     recoverComment.value.content = "";
  //     Message.success("回复成功");
  //     comment.replyFlag = false;
  //     OjPostCommentService.listChildren(comment.id).then((res) => {
  //       comment.children = res.result;
  //     });
  //   }
  // });
};

const handleToUserInfo = (authorId: string) => {
  router.push({
    name: "UserInfo",
    query: {
      id: authorId,
    },
  });
};
</script>

<style scoped lang="less">
.action {
  display: inline-block;
  padding: 0 4px;
  line-height: 24px;
  color: var(--color-text-1);
  cursor: pointer;
  background: transparent;
  border-radius: 2px;
  transition: all 0.1s ease;
}

.action:hover {
  background: var(--color-fill-3);
}
</style>
