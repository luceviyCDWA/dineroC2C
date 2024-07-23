import { validatenull } from "./validate";
import website from "@/config/website";

const keyName = website.key + "-";
/**
 * 存储localStorage
 */
export const setStore = (params: {
  name: string;
  content: unknown;
  type?: string;
}) => {
  const { name, content, type } = params;
  const targetName = keyName + name;
  const obj = {
    dataType: typeof content,
    content: content,
    type: type,
    datetime: new Date().getTime(),
  };

  if (type) {
    window.sessionStorage.setItem(targetName, JSON.stringify(obj));
  } else {
    window.localStorage.setItem(targetName, JSON.stringify(obj));
  }
};
/**
 * 获取localStorage
 */
export const getStore = (params: { name: string; debug?: boolean }) => {
  const { name, debug } = params;
  const targetName = keyName + name;

  let storageStr = window.sessionStorage.getItem(name);
  let storageRecord: Record<string, string>;
  let content;

  if (validatenull(storageStr)) storageStr = window.localStorage.getItem(targetName);
  if (validatenull(storageStr)) return;

  try {
    storageRecord = JSON.parse(storageStr!);
  } catch (e) {
    return storageStr;
  }
  
  if (debug) {
    return storageRecord;
  }

  if (storageRecord.dataType === "string") {
    content = storageRecord.content;
  } else if (storageRecord.dataType === "number") {
    content = Number(storageRecord.content);
  } else if (storageRecord.dataType === "boolean") {
    content = eval(storageRecord.content);
  } else if (storageRecord.dataType === "object") {
    content = storageRecord.content;
  }

  return content;
};
/**
 * 删除localStorage
 */
export const removeStore = (params: { name: string; type?: string }) => {
  const { name, type } = params;
  const targetName = keyName + name;

  if (type) {
    window.sessionStorage.removeItem(targetName);
  } else {
    window.localStorage.removeItem(targetName);
  }
};

/**
 * 清空全部localStorage
 */
export const clearStore = (params: { type?: string }) => {
  const { type } = params;
  if (type) {
    window.sessionStorage.clear();
  } else {
    window.localStorage.clear();
  }
};
