import axios, { AxiosResponse } from "axios";
import NProgress from "nprogress"; // progress bar
import qs from "qs";
import { Toast } from "antd-mobile";

import website from "@/config/website";
import { serialize } from "@/utils";
import { getStore } from "./storage";

enum ErrorCode {
  "操作太频繁，请勿重复请求" = "000",
  "当前操作没有权限" = 401,
  "资源不存在" = 404,
  "未绑定登录账号，请使用密码登录后绑定" = 417,
  "暂时无法操作，请稍后再试" = 423,
  "用户名不存在或密码错误" = 426,
  "验证码错误,请重新输入" = 428,
  "请求过于频繁，请稍后再试" = 429,
  "default" = "系统未知错误,请反馈给管理员",
}

axios.defaults.timeout = 30000;

// 返回其他状态吗
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status <= 500; // 默认的
};
// 跨域请求，允许保存cookie
axios.defaults.withCredentials = true;
// NProgress Configuration
NProgress.configure({
  showSpinner: false,
});

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

axios.interceptors.request.use(
  (config) => {
    NProgress.start(); // start progress bar

    // 请求头 Authorization 写入 clientId
    const basicAuth = "Basic " + window.btoa(website.formLoginClient);
    basicAuth && (config.headers.Authorization = basicAuth);

    const groupId = getStore({
      name: "groupId",
    });
    if (groupId && !/^\d+$/.test(groupId)) {
      config.headers["group-id"] = -1
    } else {
      config.headers["group-id"] =
        typeof groupId === "undefined" ? "999" : groupId;
    }

    // headers中配置serialize为true开启序列化
    if (config.method === "post" && config.headers.serialize) {
      config.data = serialize(config.data);
      delete config.data.serialize;
    }

    if (config.method === "get") {
      config.paramsSerializer = function (params: unknown) {
        return qs.stringify(params, { arrayFormat: "repeat" });
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// HTTPresponse拦截
axios.interceptors.response.use(
  (res: AxiosResponse<{ code: number, msg: string, data: unknown }>) => {
    NProgress.done();
    const status = Number(res.status) || 200;
    const errMsg = res.data.msg || ErrorCode[status] || ErrorCode["default"];

    // 后台定义 424 针对令牌过去的特殊响应码
    if (status === 424) {
      return res;
    }

    if (status !== 200 || res.data.code === 1) {
      if (errMsg === "登录失效，请重新登录。") {
        // 因用户租户组被修改等其他原因导致登录失效，刷新并进入登录页面
        const { host, protocol, pathname } = window.location;
        if (!pathname.includes("/login")) {
          window.open(
            `${protocol}//${host}${import.meta.env.VITE_BASE_NAME}/login`,
            "_self",
          );
        }
        Toast.show(errMsg);
        return Promise.reject(new Error(errMsg));
      }
      const { url } = res.config;
      if (url === "/admin/user/check/exist") {
        return Promise.reject(new Error(errMsg));
      }
      Toast.show(errMsg);
      return Promise.reject(new Error(errMsg));
    }

    return res;
  },
  (error) => {
    // 处理 503 网络异常
    if (error.response.status === 503) {
      Toast.show(error.response.data.msg);
    }
    NProgress.done();
    return Promise.reject(new Error(error));
  },
);

export default axios;
