<template>
  <div id="basicLayout">
    <!--vh是前端开发中的一个动态单位，表示相对于视口（Viewport）的高度。
    系统会将视口的宽度和高度分为100份，1vh就占用视口高度的百分之一。
    这个单位使得前端开发更加灵活，可以适应不同大小的视口，提高用户体验。-->
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer"><a>Footer</a></a-layout-footer>
    </a-layout>
  </div>
</template>

<style scoped>
/*scoped样式只在当前vue文件下起作用*/
/*#basicLayout {*/
/*}*/

#basicLayout .header {
  /*background: red;*/
  margin-bottom: 16px;
  box-shadow: #eee 1px 1px 5px;
}

#basicLayout .content {
  /*渐变色*/
  background: linear-gradient(to right, #bbb, #fff);
  margin-bottom: 16px;
  padding: 20px;
}

#basicLayout .footer {
  background: #efefef;
  padding: 16px;
  /*position: sticky;它使得元素在页面滚动时相对于视口（viewport）固定，直到某个位置。
  这种行为类似于position: relative;和position: fixed;的组合。
  当一个元素被设置为position: sticky;时，它基于用户的滚动位置在相对定位和固定定位之间切换。*/
  position: sticky;
  bottom: 0;

  left: 0;
  right: 0;
  text-align: center;
}
</style>
<script setup lang="ts">
import GlobalHeader from "@/components/GlobalHeader.vue";
</script>
