import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ArcoVue from "@arco-design/web-vue";
import "@icon-park/vue-next/styles/index.css";
import "@arco-design/web-vue/dist/arco.css";
import "@/access/routeGuard"; //全局路由守卫
import "bytemd/dist/index.css"; //bytemd下载命令npm i @bytemd/vue-next, npm i @bytemd/plugin-gfm @bytemd/plugin-highlight

createApp(App).use(store).use(router).use(ArcoVue).mount("#app");
