<template>
  <div id="basicLayout">
    <!--vh是前端开发中的一个动态单位，表示相对于视口（Viewport）的高度。
    系统会将视口的宽度和高度分为100份，1vh就占用视口高度的百分之一。
    这个单位使得前端开发更加灵活，可以适应不同大小的视口，提高用户体验。-->
    <a-layout style="min-height: 100vh">
      <!--固定header，offset-top距离窗口顶部达到指定偏移量后触发-->
      <a-affix :offsetTop="0">
        <a-layout-header class="header">
          <GlobalHeader />
        </a-layout-header>
      </a-affix>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer">
        OJ网站 ©2023 by
        <a-link href="https://github.com/codehev" target="_blank"
          >codehev
        </a-link>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import GlobalHeader from "@/components/GlobalHeader.vue";
</script>

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
  /*background: linear-gradient(to right, #bbb, #fff);*/
  /*background-color: #dcd4d4;*/
  margin-bottom: 16px;
  padding: 20px;
}

#basicLayout .footer {
  background: #efefef;
  text-align: center;
  padding: 8px;

  /*position: sticky;它使得元素在页面滚动时相对于视口（viewport）固定，直到某个位置（距离窗口顶部（或底部）达到指定偏移量后触发）。
  这种行为类似于position: relative;和position: fixed;的组合。
  当一个元素被设置为position: sticky;时，它基于用户的滚动位置在相对定位和固定定位之间切换。
  此处的作用是固定在底部*/
  /*position: sticky;*/
  /*检索或设置对象与其最近一个具有定位设置的父对象左边相关的位置。
  此属性仅仅在对象的定位( position )属性被设置时可用。否则，此属性设置会被忽略。*/
  /*  bottom: 0;
    left: 0;
    right: 0;*/
}
</style>
