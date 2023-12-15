import router from "@/router"; //默认引入@/router/index.ts
import store from "@/store"; //默认引入@/store/index.ts
import ACCESS_ENUM from "@/access/accessEnum";
import checkAccess from "@/access/checkAccess";

router.beforeEach(async (to, from, next) => {
  // console.log(to);
  // console.log(store.state.user.loginUser);
  //是否需要管理员权限
  // if (to.meta?.access == "canAdmin") {
  //   //不是管理员
  //   if (store.state.user.loginUser?.role !== "admin") {
  //     // 跳转到指定路由
  //     next("/noAuth");
  //     return;
  //   }
  // }
  // // 有权限（是管理员）或不需权限放行
  // next();

  // 自动登录
  //loginUser当前登录用户信息
  let loginUser = store.state.user.loginUser;
  if (
    !loginUser ||
    !loginUser.userRole ||
    loginUser.userRole === ACCESS_ENUM.NOT_LOGIN
  ) {
    //await：等用户登录成功后，再执行后续代码；user前不能加“/”
    await store.dispatch("user/getLoginUser");
    //重新登陆了，更新loginUser
    loginUser = store.state.user.loginUser;
  }
  //needAccess：访问该页面需要的权限;as 类型断言，告诉编译器
  const needAccess = (to.meta?.access as string) ?? ACCESS_ENUM.NOT_LOGIN;
  //要跳转的页面必须要登录
  if (needAccess !== ACCESS_ENUM.NOT_LOGIN) {
    //如果没登录，跳转到登录页面
    if (
      !loginUser ||
      !loginUser.userRole ||
      loginUser.userRole === ACCESS_ENUM.NOT_LOGIN
    ) {
      //模版字符串，保留当前路径，以便登录完成后重定向回来
      next(`/user/login?redirect=${to.fullPath}`);
      return;
    }
    //如果已经登录了，但权限不足
    if (!checkAccess(loginUser, needAccess)) {
      next("/noAuth");
      return;
    }
  }
  next();
});
