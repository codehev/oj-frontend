// initial state
// const state = () => ({
//   loginUser: {
//     userName: "未登录",
//   },
// });

// getters
// const getters = {};

// actions，执行异步操作
// const actions = {
//   getLoginUser({ commit, state }, payload) {
//     commit("updateUser", { userName: "鱼皮" });
//   },
//   // async getAllProducts({ commit }) {
//   //   const products = await shop.getProducts();
//   //   commit("setProducts", products);
//   // },
// };

// mutations，执行同步，
// const mutations = {
//   updateUser(state: { loginUser: any }, payload: any) {
//     state.loginUser = payload;
//   },
// };

import { StoreOptions } from "vuex";
import ACCESS_ENUM from "@/enum/AccessEnum";
import { UserControllerService } from "../../generated";

export default {
  namespaced: true,
  state: () => ({
    // 存储后端返回的脱敏的用户信息，此处给出必要字段的默认值
    loginUser: {
      userName: "未登录",
      userRole: ACCESS_ENUM.NOT_LOGIN,
    },
  }),
  // getters,
  // 执行异步操作
  actions: {
    /**
     * 从远程获取登录信息，并更新vuex用户信息
     */
    async getLoginUser({ commit, state }, payload) {
      // todo 改为从远程获取登录信息（可实现自动登录），并更新vuex用户信息
      const res = await UserControllerService.getLoginUserUsingGet();
      if (res.code === 0) {
        //更新登录信息
        commit("updateUser", res.data);
        // console.log("user=" + JSON.stringify(res.data));
      } else {
        // ...展开运算符，用于展开数组元素或对象属性，进行复制、合并等操作。
        //这里，复制了 state.loginUser 的属性，并修改了 userRole 属性(已有则覆盖复制来的值，没有则添加)
        commit("updateUser", {
          ...state.loginUser,
          userRole: ACCESS_ENUM.NOT_LOGIN,
        });
      }
      // commit("updateUser", { userName: "鱼皮" });
      // commit("updateUser", payload);
    },
  },
  // 执行同步操作
  mutations: {
    updateUser(state, payload) {
      state.loginUser = payload;
    },
  },
} as StoreOptions<any>;
