import { validatenull } from "./validate";

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
 * 判断路由是否相等
 */
type IRouteRecord = Record<string, unknown>;
export const diff = (obj1: IRouteRecord, obj2: IRouteRecord): boolean => {
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
      return diff(obj1[attr] as IRouteRecord, obj2[attr] as IRouteRecord);
    } else if (obj1[attr] !== obj2[attr]) {
      return false;
    }
  }
  return true;
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc: any = document;
  return doc.isFullScreen || doc.mozIsFullScreen || doc.webkitIsFullScreen;
};

/**
 * 浏览器全屏
 */
export const reqFullScreen = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc: any = document;

  if (doc.documentElement.requestFullScreen) {
    doc.documentElement.requestFullScreen();
  } else if (doc.documentElement.webkitRequestFullScreen) {
    doc.documentElement.webkitRequestFullScreen();
  } else if (doc.documentElement.mozRequestFullScreen) {
    doc.documentElement.mozRequestFullScreen();
  }
};
/**
 * 浏览器退出全屏
 */
export const exitFullScreen = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc: any = document;

  if (doc.documentElement.requestFullScreen) {
    doc.exitFullScreen();
  } else if (doc.documentElement.webkitRequestFullScreen) {
    doc.webkitCancelFullScreen();
  } else if (doc.documentElement.mozRequestFullScreen) {
    doc.mozCancelFullScreen();
  }
};
/**
 * 递归寻找子类的父类
 */
type IMenuItem = Record<string, unknown> & {
  id: string;
  children: IMenuItem[];
};
export const findParent = (
  menu: IMenuItem[],
  id: string,
): IMenuItem | undefined => {
  for (let i = 0; i < menu.length; i++) {
    if (menu[i].children?.length) {
      for (let j = 0; j < menu[i].children.length; j++) {
        if (menu[i].children[j].id === id) {
          return menu[i];
        } else {
          if (menu[i].children[j]?.children?.length) {
            return findParent(menu[i].children[j].children, id);
          }
        }
      }
    }
  }

  return undefined;
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
export const findByvalue = (
  dic: Array<{ value: unknown; label: string }>,
  value: unknown,
) => {
  let result: string = "";
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

export const isMobile = () => {
  if (
    window.navigator.userAgent.match(
      /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i,
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

export const getEncryptionPhone = (phone: string) => {
  return `${phone?.slice(0, 3)}****${phone?.slice(-4)}`;
};

// 根据描述获取时间字符串
// 格式： xx:xx:xx
export const getTimeStrBySec = (sec: number) => {
  const secShow = sec % 60;
  const minTotal = Math.floor(sec / 60);
  const minShow = minTotal % 60;
  const hourShow = Math.floor(minTotal / 60);

  return `${getTwoDigit(hourShow)}:${getTwoDigit(minShow)}:${getTwoDigit(secShow)}`;
}

export const getTwoDigit = (num: number) => {
  if (num > 10) {
    return `${num}`;
  } else {
    return `0${num}`;
  }
}
