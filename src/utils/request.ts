import axios, { AxiosRequestConfig } from "axios";
import NProgress from "nprogress"; // progress bar
import useUserStore from "@/store/useUserStore";
import useLoginModalStore from "@/store/useLoginModalStore";

axios.defaults.timeout = 30000;

// 返回其他状态吗
axios.defaults.validateStatus = function (status) {
  return status >= 200 && status <= 500; // 默认的
};

// NProgress Configuration
NProgress.configure({
  showSpinner: false,
});

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

axios.interceptors.request.use(async (config) => {
  const { userInfo } = useUserStore.getState();
  const AUTH_TOKEN = userInfo?.token;

  if (AUTH_TOKEN) {
    config.headers.Authorization = `Bearer ${AUTH_TOKEN}`;
  }
  return config;
});

// HTTPresponse拦截
axios.interceptors.response.use(async (res) => {
  const { data, config } = res;
  const originalRequest = config as AxiosRequestConfig & {
    _retry?: boolean;
  }; 

  if (data?.result?.code === 401 && !originalRequest._retry) {
    const { onShowLogin } = useLoginModalStore.getState();

    originalRequest._retry = true;

    await onShowLogin();

    // 重新发送请求并返回结果
    return axios(originalRequest);
  }

  if (data?.result?.code && data?.result?.data) {
    return data.result.data;
  }

  return res;
});

export default axios;
