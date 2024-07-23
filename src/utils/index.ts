import * as CryptoJS from "crypto-js";
import { message } from "antd";

import {
  passwordKey,
  passwordKeyTEST,
  passwordKeyPRE,
  passwordKeyJX,
  passwordKeyNL,
  passwordKeySS,
  passwordKeyGQC,
  smsKey,
  smsKeyTEST,
  smsKeyPRE,
  smsKeyJX,
  smsKeyNL,
  smsKeySS,
  smsKeyGQC,
} from "@/config/env";

import { getStore } from "./storage";
import request from "./request";
import { isURL, validatenull } from "./validate";
import { NavigateFunction } from "react-router-dom";


// 表单序列化
export const serialize = (data: Record<string, unknown>) => {
  const list: Array<string> = [];
  Object.keys(data).forEach((ele) => {
    list.push(`${ele}=${data[ele]}`);
  });
  return list.join("&");
};
export const getObjType = (obj: unknown) => {
  const toString = Object.prototype.toString;
  const map = {
    "[object Boolean]": "boolean",
    "[object Number]": "number",
    "[object String]": "string",
    "[object Function]": "function",
    "[object Array]": "array",
    "[object Date]": "date",
    "[object RegExp]": "regExp",
    "[object Undefined]": "undefined",
    "[object Null]": "null",
    "[object Object]": "object",
  } as const;
  if (obj instanceof Element) {
    return "element";
  }
  const key = toString.call(obj);
  return map[key as keyof typeof map];
};
/**
 * 对象深拷贝
 */
export const deepClone = (data: unknown) => {
  const type = getObjType(data);
  
  if (type === "array") {
    const obj: Array<unknown> = [];
    for (let i = 0, len = (data as Array<unknown>).length; i < len; i++) {
      (data as Array<unknown>).push(deepClone((data as Array<unknown>)[i]));
    }

    return obj;
  } else if (type === "object") {
    const obj: Record<string, unknown> = {};

    for (const key in data as Record<string, unknown>) {
      obj[key] = deepClone((data as Record<string, unknown>)[key]);
    }

    return obj;
  } else {
    // 不再具有下一层次
    return data;
  }
};
/**
 * 判断路由是否相等
 */
export const diff = (obj1: unknown, obj2: unknown): boolean => {
  delete obj1.close;
  const o1 = obj1 instanceof Object;
  const o2 = obj2 instanceof Object;
  if (!o1 || !o2) {
    /*  判断不是对象  */
    return obj1 === obj2;
  }

  if (Object.keys(obj1).length !== Object.keys(obj2).length) {
    return false;
    // Object.keys() 返回一个由对象的自身可枚举属性(key值)组成的数组,例如：数组返回下表：let arr = ["a", "b", "c"];console.log(Object.keys(arr))->0,1,2;
  }

  for (const attr in obj1) {
    const t1 = obj1[attr] instanceof Object;
    const t2 = obj2[attr] instanceof Object;
    if (t1 && t2) {
      return diff(obj1[attr], obj2[attr]);
    } else if (obj1[attr] !== obj2[attr]) {
      return false;
    }
  }
  return true;
};
/**
 * 设置灰度模式
 */
export const toggleGrayMode = (status: boolean) => {
  if (status) {
    document.body.className = document.body.className + " grayMode";
  } else {
    document.body.className = document.body.className.replace(" grayMode", "");
  }
};
/**
 * 设置主题
 */
export const setTheme = (name: string) => {
  document.body.className = name;
};

/**
 *加密处理
 */
export const encryption = (params: {
  data: object;
  type?: string;
  param: Array<any>;
  key?: unknown;
}) => {
  let { data, type, param, key } = params;
  const result = JSON.parse(JSON.stringify(data));
  if (type === "Base64") {
    param.forEach((ele) => {
      result[ele] = btoa(result[ele]);
    });
  } else {
    param.forEach((ele) => {
      var data = result[ele];
      if (data) {
        const parseKey = CryptoJS.enc.Latin1.parse(key);
        var iv = parseKey;
        // 加密
        var encrypted = CryptoJS.AES.encrypt(data, parseKey, {
          iv: iv,
          mode: CryptoJS.mode.CFB,
          padding: CryptoJS.pad.NoPadding,
        });
        result[ele] = encrypted.toString();
      }
    });
  }
  return result;
};

/**
 * 浏览器判断是否全屏
 */
export const fullscreenToggel = () => {
  if (fullscreenEnable()) {
    exitFullScreen();
  } else {
    reqFullScreen();
  }
};
/**
 * esc监听全屏
 */
export const listenfullscreen = (callback: () => void) => {
  function listen() {
    callback();
  }

  document.addEventListener("fullscreenchange", function () {
    listen();
  });
  document.addEventListener("mozfullscreenchange", function () {
    listen();
  });
  document.addEventListener("webkitfullscreenchange", function () {
    listen();
  });
  document.addEventListener("msfullscreenchange", function () {
    listen();
  });
};
/**
 * 浏览器判断是否全屏
 */
export const fullscreenEnable = () => {
  return (
    document.isFullScreen ||
    document.mozIsFullScreen ||
    document.webkitIsFullScreen
  );
};

/**
 * 浏览器全屏
 */
export const reqFullScreen = () => {
  if (document.documentElement.requestFullScreen) {
    document.documentElement.requestFullScreen();
  } else if (document.documentElement.webkitRequestFullScreen) {
    document.documentElement.webkitRequestFullScreen();
  } else if (document.documentElement.mozRequestFullScreen) {
    document.documentElement.mozRequestFullScreen();
  }
};
/**
 * 浏览器退出全屏
 */
export const exitFullScreen = () => {
  if (document.documentElement.requestFullScreen) {
    document.exitFullScreen();
  } else if (document.documentElement.webkitRequestFullScreen) {
    document.webkitCancelFullScreen();
  } else if (document.documentElement.mozRequestFullScreen) {
    document.mozCancelFullScreen();
  }
};
/**
 * 递归寻找子类的父类
 */

export const findParent = (menu, id) => {
  for (let i = 0; i < menu.length; i++) {
    if (!!menu[i]?.children?.length) {
      for (let j = 0; j < menu[i].children.length; j++) {
        if (menu[i].children[j].id === id) {
          return menu[i];
        } else {
          if (!!menu[i]?.children[j]?.children?.length) {
            return findParent(menu[i].children[j].children, id);
          }
        }
      }
    }
  }
};

/**
 * 扁平化树形结构
 */
type Item = Record<string, unknown> & { children?: Array<Item> };
export const treeToArray = (tree: Item[]) => {
  let res: Item[] = [];
  for (const item of tree || []) {
    const { children, ...i } = item;
    if (children && children.length) {
      res = res.concat(treeToArray(children));
    }
    res.push(i);
  }
  return res;
};

/**
 * 动态插入css
 */

export const loadStyle = (url: string) => {
  const link = document.createElement("link");
  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = url;
  const head = document.getElementsByTagName("head")[0];
  head.appendChild(link);
};
/**
 * 判断路由是否相等
 */
export const isObjectValueEqual = (
  a: Record<string, unknown>,
  b: Record<string, unknown>,
) => {
  let result = true;
  Object.keys(a).forEach((ele) => {
    const type = typeof a[ele];
    if (type === "string" && a[ele] !== b[ele]) result = false;
    else if (
      type === "object" &&
      JSON.stringify(a[ele]) !== JSON.stringify(b[ele])
    )
      result = false;
  });
  return result;
};
/**
 * 根据字典的value显示label
 */
export const findByvalue = (dic: Array<{ value: unknown, label: string }>, value: unknown) => {
  let result: string = '';
  if (validatenull(dic)) return value;
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    let index = 0;
    index = findArray(dic, value);
    if (index !== -1) {
      result = dic[index].label;
    } else {
      result = value.toString();
    }
  } else if (value instanceof Array) {
    let index = 0;
    const tmpResult: Array<unknown> = [];
    value.forEach((ele) => {
      index = findArray(dic, ele);
      if (index !== -1) {
        tmpResult.push(dic[index].label);
      } else {
        tmpResult.push(value);
      }
    });
    result = tmpResult.toString();
  }
  return result;
};
/**
 * 根据字典的value查找对应的index
 */
export const findArray = (dic: Array<{ value: unknown }>, value: unknown) => {
  for (let i = 0; i < dic.length; i++) {
    if (dic[i].value === value) {
      return i;
    }
  }
  return -1;
};
/**
 * 生成随机len位数字
 */
export const randomLenNum = (len: number, date: boolean) => {
  let random = "";
  random = Math.ceil(Math.random() * 100000000000000)
    .toString()
    .substr(0, len || 4);
  if (date) random = random + Date.now();
  return random;
};
/**
 * 打开小窗口
 */
// export const openWindow = (url, title, w, h) => {
//   // Fixes dual-screen position                            Most browsers       Firefox
//   const dualScreenLeft =
//     window.screenLeft !== undefined ? window.screenLeft : screen.left;
//   const dualScreenTop =
//     window.screenTop !== undefined ? window.screenTop : screen.top;

//   const width = window.innerWidth
//     ? window.innerWidth
//     : document.documentElement.clientWidth
//       ? document.documentElement.clientWidth
//       : screen.width;
//   const height = window.innerHeight
//     ? window.innerHeight
//     : document.documentElement.clientHeight
//       ? document.documentElement.clientHeight
//       : screen.height;

//   const left = width / 2 - w / 2 + dualScreenLeft;
//   const top = height / 2 - h / 2 + dualScreenTop;
//   const newWindow = window.open(
//     url,
//     title,
//     "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width=" +
//     w +
//     ", height=" +
//     h +
//     ", top=" +
//     top +
//     ", left=" +
//     left
//   );

//   // Puts focus on the newWindow
//   if (window.focus) {
//     newWindow.focus();
//   }
// };

/**
 *  <img> <a> src 处理
 * @returns {PromiseLike<T | never> | Promise<T | never>}
 */
export function handleImg(url: string, id: string) {
  return validatenull(url)
    ? null
    : request({
        url: url,
        method: "get",
        responseType: "blob",
      }).then((response) => {
        // 处理返回的文件流
        const blob = response.data;
        const img = document.getElementById(id) as HTMLImageElement;
        img.src = URL.createObjectURL(blob);
        window.setTimeout(function () {
          window.URL.revokeObjectURL(blob);
        }, 0);
      });
}

/**
 *
 * @param url 目标下载接口
 * @param query 查询参数
 * @param fileName 文件名称
 * @returns {*}
 */
export function downBlobFile(
  url: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  query: any,
  fileName: string,
  isDesigner?: boolean
) {
  return request({
    url: url,
    method: "get",
    responseType: "blob",
    params: query,
  }).then((response) => {
    // 处理返回的文件流
    const blob = response.data;
    // 设计研发平台获取源文件异常处理
    if (isDesigner && blob.type === "application/json") {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return blob.text().then((res: any) => {
        if (!JSON.parse(res).data) {
          message.error(JSON.parse(res).msg);
        }
      });
    }
    if (blob && blob.size === 0) {
      return;
    }
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    window.setTimeout(function () {
      window.URL.revokeObjectURL(blob);
      document.body.removeChild(link);
    }, 0);
  });
}

export function getQueryString(url: string, paraName: string) {
  const arrObj = url.split("?");
  if (arrObj.length > 1) {
    const arrPara = arrObj[1].split("&");
    let arr;
    for (let i = 0; i < arrPara.length; i++) {
      arr = arrPara[i].split("=");
      // eslint-disable-next-line eqeqeq
      if (arr != null && arr[0] == paraName) {
        return arr[1];
      }
    }
    return "";
  } else {
    return "";
  }
}

/**
 * 计算屏幕大小
 * @returns {number}
 */
export function calcScreen() {
  const width = document.body.clientWidth;
  
  if (width >= 1200) {
    return 3; // 大屏幕
  } else if (width >= 992) {
    return 2; // 中屏幕
  } else if (width >= 768) {
    return 1; // 小屏幕
  } else {
    return 0; // 超小屏幕
  }
}

export const getScreen = (isCollapse: boolean) => {
  if (document.body.clientWidth <= 768) {
    return !isCollapse;
  } else {
    return isCollapse;
  }
};

export const getPasswordKey = () => {
  const rootPathStore = getStore({ name: "rootPath" });
  const keyMap: Record<string, string | undefined> = {
    "/portal/test": passwordKeyTEST,
    "/portal/pre": passwordKeyPRE,
    "/portal": passwordKey,
    "/portal/jx": passwordKeyJX,
    "/portal/nl": passwordKeyNL,
    "/portal/ss": passwordKeySS,
    "/portal/gqc": passwordKeyGQC,
  };
  return keyMap[rootPathStore] || passwordKey;
};

export const getSmsKey = () => {
  const rootPathStore = getStore({ name: "rootPath" });
  const keyMap: Record<string, string | undefined> = {
    "/portal/test": smsKeyTEST,
    "/portal/pre": smsKeyPRE,
    "/portal": smsKey,
    "/portal/jx": smsKeyJX,
    "/portal/nl": smsKeyNL,
    "/portal/ss": smsKeySS,
    "/portal/gqc": smsKeyGQC,
  };
  return keyMap[rootPathStore] || smsKey;
};

export const isMobile = () => {
  if (
    window.navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    )
  ) {
    return true; // 移动端
  } else {
    return false; // PC端
  }
};

/**
 *
 * @returns
 */
export function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  // 将查询参数转换为对象形式
  const queryParams: Record<string, string> = {};
  for (const [key, value] of params.entries()) {
    queryParams[key] = value;
  }
  return queryParams;
}
/**
 * @param link 链接地址
 * 示例： https://cuysy.com/portal/app
 * 示例： /portal/app
 * 示例： /app
 * 示例： https://cuysy.com/operation/admin/setting/home
 * 示例： /operation/admin/setting/home
 * @param openType 打开方式 0当前页面 1新窗口
 * @param navigate 视图层路由navigate实例 - navigate = useNavigate()
 * @returns
 */
export const handleLinkClick = (
  link: string,
  openType: number,
  navigate: NavigateFunction,
) => {
  const linkStartReg = /^(\/portal|\/console|\/operation)/;
  if (!link) {
    return;
  }
  if (openType === 0) {
    // /portal/app | /app
    if (
      link.startsWith("/portal") ||
      (!isURL(link) && !linkStartReg.test(link))
    ) {
      //用户填写了 /portal/app 期望站内跳转
      navigate(link.replace(`/portal`, ""));
      return;
    }
    // https://cuysy.com/portal/app
    if (link.startsWith(`${window.location.origin}/portal`)) {
      //用户填写了 https://dev.cuysy.com/portal/app 期望站内跳转
      navigate(link.replace(`${window.location.origin}/portal`, ""));
      return;
    }
    window.open(link, "_self");
  } else {
    if (!isURL(link) && !linkStartReg.test(link)) {
      window.open(`/portal${link}`);
      return;
    }
    window.open(link);
  }
};

export const getEncryptionName = (name: string) => {
  if (!name || name.length === 1) {
    return name;
  } else if (name.length === 2) {
    return name.substring(0, 1) + "*"; //截取name 字符串截取第一个字符，
  } else if (name.length === 3) {
    return name.substring(0, 1) + "*" + name.substring(2, 3); //截取第一个和第三个字符
  } else if (name.length > 3) {
    const resName = name.substring(0, 10);
    const arr = [];
    for (let i = 0; i < resName.length - 2; i += 1) {
      arr.push("*");
    }
    return resName.substring(0, 1) + arr.join("") + resName.substring(-1, 1); //截取第一个和大于第4个字符
  }
};

export const getEncryptionPhone = (phone: string) => {
  return `${phone?.slice(0, 3)}****${phone?.slice(-4)}`;
};

export function desensitiveUsername(username: string | undefined) {
  if (!username) return;
  return `${username.slice(0, 1)}***${username.slice(-1)}`;
}

// 企业简称定制化需求
export function hasSimpleName() {
  const rootPathStore = getStore({ name: "rootPath" });
  return ["/portal/ss", "/portal/gqc"].includes(rootPathStore);
}

// 定制化首页
export function specialHomePage() {
  const rootPathStore = getStore({ name: "rootPath" });
  return ["/portal/ss", "/portal/gqc"].includes(rootPathStore);
}

// 右上角登录按钮文字
export function getLoginBtnText() {
  const rootPathStore = getStore({ name: "rootPath" });
  return ["/portal/ss", "/portal/gqc"].includes(rootPathStore) ? "企业侧入口" : "登录";
}