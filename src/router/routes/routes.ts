import { RouteRecordRaw } from "vue-router";
import ACCESS_ENUM from "@/enum/AccessEnum";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: () => import("@/layouts/BasicLayout.vue"),
    children: [
      {
        path: "",
        name: "首页",
        component: () => import("@/views/HomeView.vue"),
        meta: {
          icon: "home",
        },
      },
      {
        path: "questions",
        name: "题目",
        component: () => import("@/views/question/QuestionsView.vue"),
        meta: {
          icon: "code",
        },
      },
      {
        path: "question_submit",
        name: "状态",
        component: () => import("@/views/question/QuestionSubmitView.vue"),
        meta: {
          access: ACCESS_ENUM.USER,
          icon: "dashboard",
        },
      },
      {
        path: "match",
        name: "比赛",
        component: () => import("@/views/match/MatchView.vue"),
        meta: {
          icon: "trophy",
        },
      },
      {
        path: "post",
        name: "帖子",
        component: () => import("@/views/post/view/PostView.vue"),
        meta: {
          icon: "message",
        },
      },
      {
        path: "post/detail",
        name: "帖子详情",
        component: () => import("@/views/post/detail/PostDetailView.vue"),
        meta: {
          hideInMenu: true,
        },
      },
      {
        path: "manage/question",
        name: "题目管理",
        component: () => import("@/views/question/ManageQuestionView.vue"),
        meta: {
          access: ACCESS_ENUM.ADMIN,
          icon: "apps",
        },
      },
      {
        path: "add/question",
        name: "创建题目",
        component: () => import("@/views/question/AddQuestionView.vue"),
        meta: {
          access: ACCESS_ENUM.USER,
          hideInMenu: true,
        },
      },
      {
        path: "update/question",
        name: "更新题目",
        component: () => import("@/views/question/AddQuestionView.vue"),
        meta: {
          access: ACCESS_ENUM.ADMIN,
          hideInMenu: true,
        },
      },
      {
        path: "manage/post",
        name: "帖子管理",
        component: () => import("@/views/post/manage/ManagePost.vue"),
        meta: {
          access: ACCESS_ENUM.ADMIN,
          icon: "message",
        },
      },
      {
        path: "add/post",
        name: "创建帖子",
        component: () => import("@/views/post/manage/components/edit-post.vue"),
        meta: {
          access: ACCESS_ENUM.USER,
          hideInMenu: true,
        },
      },
      {
        path: "update/post",
        name: "更新帖子",
        component: () => import("@/views/post/manage/components/edit-post.vue"),
        meta: {
          access: ACCESS_ENUM.ADMIN,
          hideInMenu: true,
        },
      },
      {
        path: "manage/user",
        name: "用户管理",
        component: () => import("@/views/user/UserManagementView.vue"),
        meta: {
          access: ACCESS_ENUM.ADMIN,
          icon: "user",
        },
      },
      {
        path: "about",
        name: "关于",
        component: () => import("@/views/AboutView.vue"),
        meta: {
          icon: "file",
          hideInMenu: true,
        },
      },
      {
        path: "noAuth",
        name: "无权限",
        component: () => import("@/views/exception/NoAuthView.vue"),
        meta: {
          hideInMenu: true,
        },
      },
    ],
  },
  {
    path: "/user",
    component: () => import("@/layouts/UserLayout.vue"),
    children: [
      {
        path: "login",
        name: "用户登录",
        component: () => import("@/views/user/UserLoginView.vue"),
      },
      {
        path: "register",
        name: "用户注册",
        component: () => import("@/views/user/UserRegisterView.vue"),
      },
      {
        path: "home/:id",
        name: "我的主页",
        component: () => import("@/views/user/UserHomeView.vue"),
        props: true,
      },
      {
        path: "oauth/success",
        name: "第三方登录成功",
        component: () => import("@/views/user/OAuthResultView.vue"),
        meta: {
          hideInMenu: true,
        },
      },
      {
        path: "oauth/error",
        name: "第三方登录失败",
        component: () => import("@/views/user/OAuthResultView.vue"),
        meta: {
          hideInMenu: true,
        },
      },
    ],
  },
  {
    path: "/view",
    component: () => import("@/layouts/QuestionLayout.vue"),
    children: [
      {
        path: "question/:id",
        name: "在线题目",
        component: () =>
          import("@/views/question/doQuestion/DoQuestionView.vue"),
        props: true,
        meta: {
          access: ACCESS_ENUM.USER,
        },
      },
    ],
  },
];
