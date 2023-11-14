import { RouteRecordRaw } from "vue-router";
import ACCESS_ENUM from "@/access/accessEnum";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/user",
    name: "用户",
    component: () => import("@/layouts/UserLayout.vue"),
    meta: {
      hideInMenu: true, //仅是在菜单栏上隐藏，依旧可以通过router跳转该页面
    },
    children: [
      {
        path: "/user/login",
        name: "用户登录",
        component: () => import("@/views/user/UserLoginView.vue"),
      },
      {
        path: "/user/register",
        name: "用户注册",
        component: () => import("@/views/user/UserRegisterView.vue"),
      },
    ],
  },
  {
    path: "/",
    name: "浏览题目",
    component: () => import("@/views/question/QuestionsView.vue"),
    // redirect: "/questions",
  },
  {
    path: "/questions",
    name: "浏览题目",
    component: () => import("@/views/question/QuestionsView.vue"),
    meta: {
      hideInMenu: true, //仅是在菜单栏上隐藏，依旧可以通过router跳转该页面
    },
  },
  {
    path: "/add/question",
    name: "创建题目",
    component: () => import("@/views/question/AddQuestionView.vue"),
    meta: {
      access: ACCESS_ENUM.USER,
    },
  },
  {
    path: "/update/question",
    name: "更新题目",
    component: () => import("@/views/question/AddQuestionView.vue"),
    meta: {
      access: ACCESS_ENUM.USER,
      hideInMenu: true, //仅是在菜单栏上隐藏，依旧可以通过router跳转该页面
    },
  },
  {
    path: "/manage/question",
    name: "管理题目",
    component: () => import("@/views/question/ManageQuestionView.vue"),
    meta: {
      access: ACCESS_ENUM.ADMIN,
    },
  },
  {
    path: "/noAuth",
    name: "无权限",
    component: () => import("@/views/NoAuthView.vue"),
    meta: {
      hideInMenu: true, //仅是在菜单栏上隐藏，依旧可以通过router跳转该页面
    },
  },
  // {
  //   path: "/hide",
  //   name: "隐藏页面",
  //   component: () => import("@/views/NoAuthView.vue"),
  //   meta: {
  //     hideInMenu: true, //仅是在菜单栏上隐藏，依旧可以通过router跳转该页面
  //   },
  // },
  // {
  //   path: "/admin",
  //   name: "管理员可见",
  //   component: () => import("@/views/AdminView.vue"),
  //   meta: {
  //     access: ACCESS_ENUM.ADMIN,
  //   },
  // },
  // {
  //   path: "/about",
  //   name: "关于",
  //   component: () => import("../views/AboutView.vue"),
  // },
];
