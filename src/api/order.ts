import request from "@/utils/request";

import { ICoinItem, IHotItem } from "@/types";

export const getHotCoinList = () => {
  return request.get<unknown, IHotItem[]>("/apis/v1/dinero/get_hot_list");
};

export const getCoinList = (keyword: string) => {
  return request.post<unknown, ICoinItem[]>(
    "/apis/v1/dinero/get_publish_list",
    { keyword },
  );
}