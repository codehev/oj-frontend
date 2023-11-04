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
import ACCESS_ENUM from "@/access/accessEnum";
import { UserControllerService } from "../../generated";

export default {
  namespaced: true,
  state: () => ({
    loginUser: {
      userName: "未登录",
    },
  }),
  // getters,
  // 执行异步操作
  actions: {
    async getLoginUser({ commit, state }, payload) {
      // todo 改为从远程获取登录信息，并更新vuex用户信息
      const res = await UserControllerService.getLoginUserUsingGet();
      if (res.code === 0) {
        //更新登录信息
        commit("updateUser", res.data);
      } else {
        commit("updateUser", {
          ...state.loginUser,
          userRole: ACCESS_ENUM.NOT_LOGIN,
        });
      }
      // commit("updateUser", { userName: "鱼皮" });
      // commit("updateUser", payload);
    },
    // async getAllProducts({ commit }) {
    //   const products = await shop.getProducts();
    //   commit("setProducts", products);
    // },
  },
  // 执行同步操作
  mutations: {
    updateUser(state, payload) {
      state.loginUser = payload;
    },
  },
} as StoreOptions<any>;
