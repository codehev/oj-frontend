<template>
  <div class="container-post">
    <a-row :gutter="10">
      <a-col :flex="1">
        <post-list />
      </a-col>
      <a-col :span="5">
        <a-space direction="vertical" fill>
          <post-hot-list />
        </a-space>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import PostList from "@/views/post/view/components/post-list.vue";
import PostHotList from "@/views/post/view/components/post-hot-list.vue";
</script>

<style scoped lang="less">
.container-post {
  padding: 0 20px 20px;
}
</style>
