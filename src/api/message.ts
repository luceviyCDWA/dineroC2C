import request from "@/utils/request";
import { DEFAULT_PAGE_SIZE } from "@/config/env";
import { IMessageItem } from "@/views/message/types";

export const getMesageList = (page: number) => {
  return request<
    unknown,
    {
      total: number;
      list: IMessageItem[];
    }
  >({
    url: "/apis/v1/dinero/get_message_list",
    method: "post",
    data: {
      offset: page,
      limit: DEFAULT_PAGE_SIZE,
    },
  });
};

export const getMessageDetail = (id: string) => {
  return request<
    unknown,
    {
      id: string,
      url: string,
    }
  >({
    url: `/apis/v1/dinero/get_message_detail/${id}`,
    method: "get",
  });
}

export const getUnreadNum = () => {
  return request<
    unknown,
    {
      unread_message_count: number;
    }
  >({
    url: "/apis/v1/dinero/get_message_count",
    method: 'get'
  });
}
