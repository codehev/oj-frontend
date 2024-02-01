import ACCESS_ENUM from "@/enum/AccessEnum";

/**
 * 过滤菜单时使用,定义公用的权限校验方法（检查是否有权限）
 * @param loginUser 当前登录用户
 * @param needAccess 需要有的权限
 * @return boolean 有无权限
 */
const checkAccess = (
  loginUser: any,
  needAccess: string = ACCESS_ENUM.NOT_LOGIN
) => {
  // `??` 是一个逻辑操作符，被称为**空值合并操作符**（Nullish Coalescing Operator）。
  // 它的作用是检查左侧的操作数是否为`null`或`undefined`。
  // 如果左侧的操作数是`null`或`undefined`，则返回右侧的操作数；否则返回左侧的操作数。

  // 获取当前登录用户具有的权限(如果没有loginUser，则表示未登录)
  const loginUserAccess = loginUser?.userRole ?? ACCESS_ENUM.NOT_LOGIN;

  if (needAccess === ACCESS_ENUM.NOT_LOGIN) {
    return true;
  }
  //如果需要用户登录才能访问
  if (needAccess === ACCESS_ENUM.USER) {
    //如果用户没登录，那么表示无权限
    if (loginUserAccess === ACCESS_ENUM.NOT_LOGIN) {
      return false;
    }
  }
  //如果需要管理员权限
  if (needAccess === ACCESS_ENUM.ADMIN) {
    // 如果不为管理员，表示无权限
    if (loginUserAccess !== ACCESS_ENUM.ADMIN) {
      return false;
    }
  }
  return true;
};

export default checkAccess;
