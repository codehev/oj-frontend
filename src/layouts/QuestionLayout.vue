<template>
  <div id="questionLayout">
    <!--vh是前端开发中的一个动态单位，表示相对于视口（Viewport）的高度。
    系统会将视口的宽度和高度分为100份，1vh就占用视口高度的百分之一。
    这个单位使得前端开发更加灵活，可以适应不同大小的视口，提高用户体验。-->
    <a-layout style="height: 100vh; width: 99.5vw">
      <a-layout-header class="header" style="height: 5vh">
        <a-drawer
          :width="340"
          :visible="visible"
          placement="left"
          :footer="false"
          @cancel="handleCancel"
          unmountOnClose
        >
          <template #title> 题库</template>
          <div>
            You can customize modal body text by the current situation. This
            modal will be closed immediately once you press the OK button.
          </div>
        </a-drawer>
        <!--a-space组件可以提供不同大小的间距，并且支持响应式布局。
        这意味着间距可以根据屏幕尺寸进行自适应调整，以在不同设备上提供良好的用户体验。-->
        <a-space style="float: left">
          <a-popover content="返回">
            <a-button type="text" @click="router.back()">
              <IconPark type="return" theme="filled" size="20" fill="#777777" />
            </a-button>
          </a-popover>
          <a-popover content="题库">
            <a-button type="text" @click="handleClick">
              <IconPark
                type="menu-unfold-one"
                theme="filled"
                size="20"
                fill="#777777"
              />
            </a-button>
          </a-popover>
          <a-popover content="上一题">
            <a-button type="text" @click="router.back()">
              <IconPark type="left" theme="filled" size="20" fill="#777777" />
            </a-button>
          </a-popover>
          <a-popover content="下一题">
            <a-button type="text" @click="router.back()">
              <IconPark type="right" theme="filled" size="20" fill="#777777" />
            </a-button>
          </a-popover>
          <a-popover content="随机一题">
            <a-button type="text" @click="router.back()">
              <IconPark
                type="shuffle-one"
                theme="filled"
                size="16"
                fill="#777777"
              />
            </a-button>
          </a-popover>
        </a-space>
      </a-layout-header>
      <a-layout-content class="content" style="height: 95vh">
        <router-view />
      </a-layout-content>
    </a-layout>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from "vue-router";
import { IconPark } from "@icon-park/vue-next/es/all";
import { ref } from "vue";

const router = useRouter();
const visible = ref(false);

const handleClick = () => {
  visible.value = true;
};
const handleCancel = () => {
  visible.value = false;
};
</script>
<style scoped>
/*scoped样式只在当前vue文件下起作用*/

#questionLayout {
  background-color: #f0f0f0;
  margin: 0px 0px;
  padding: 0px 5px;
}

/*#questionLayout .header {
  border: 1px solid red;
}

#questionLayout .content {
  border: 1px solid blue;
  overflow: hidden;
}*/
</style>
