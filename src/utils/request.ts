import axios from "axios";
import NProgress from "nprogress"; // progress bar
import useUserStore from "@/store/useUserStore";

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

axios.interceptors.request.use(async (config) => {
  const { userInfo } = useUserStore.getState();
  const AUTH_TOKEN = userInfo?.token;

  if (AUTH_TOKEN) {
    config.headers.Authorization = `Bearer ${AUTH_TOKEN}`;
  }
  return config;
});

// HTTPresponse拦截
axios.interceptors.response.use((res) => {
  const { data } = res;

  if (data?.result?.code && data?.result?.data) {
    return data.result.data;
  }

  return res;
});

export default axios;
