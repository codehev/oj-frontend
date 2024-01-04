<template>
  <div id="userLayout">
    <!--vh是前端开发中的一个动态单位，表示相对于视口（Viewport）的高度。
    系统会将视口的宽度和高度分为100份，1vh就占用视口高度的百分之一。
    这个单位使得前端开发更加灵活，可以适应不同大小的视口，提高用户体验。-->
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <!--a-space组件可以提供不同大小的间距，并且支持响应式布局。
        这意味着间距可以根据屏幕尺寸进行自适应调整，以在不同设备上提供良好的用户体验。-->
        <a-space>
          <img src="../assets/logo.jpeg" class="logo" />
          <div style="font-weight: 600; font-size: 33px">OJ</div>
        </a-space>
        <div
          style="color: rgba(0, 0, 0, 0.65); font-size: 14px; margin-top: 8px"
        >
          一个编程题目评测系统
        </div>
      </a-layout-header>
      <a-layout-content class="content">
        <router-view />
      </a-layout-content>
      <a-layout-footer class="footer"
        >OJ网站 ©2023 by
        <a-link href="https://github.com/codehev" target="_blank"
          >codehev
        </a-link>
      </a-layout-footer>
    </a-layout>
  </div>
</template>
<style scoped>
/*scoped样式只在当前vue文件下起作用*/

#userLayout {
  text-align: center;
  background-image: url("https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr");
  background-size: 100% 100%;
  /*background: url("https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png")*/
  /*  0% 0% / 100% 100%;*/
}

#userLayout .header {
  /*background: red;*/
  margin-top: 16px;
  /*margin-bottom: 16px;*/
  /*阴影*/
  /*box-shadow: #eee 1px 1px 5px;*/
}

#userLayout .logo {
  width: 32px;
}

#userLayout .content {
  /*渐变色*/
  /*background: linear-gradient(to right, #bbb, #fff);*/
  margin-bottom: 16px;
  padding: 20px;
}

#userLayout .footer {
  /*background: #efefef;*/
  padding: 8px;
  text-align: center;
  /*position: sticky;它使得元素在页面滚动时相对于视口（viewport）固定，直到某个位置。
  这种行为类似于position: relative;和position: fixed;的组合。
  当一个元素被设置为position: sticky;时，它基于用户的滚动位置在相对定位和固定定位之间切换。*/
  /*  position: sticky;
    bottom: 0;
    left: 0;
    right: 0;*/
}
</style>
