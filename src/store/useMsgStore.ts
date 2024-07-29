import { create } from "zustand";

import { INIT_PAGE } from "@/config/env";

import { IMessageItem } from "@/views/message/types";
import { getMesageList, getUnreadNum } from "@/api/message";

interface MsgStoreState {
  msgList: IMessageItem[];
  unreadNum: number;

  page: number;
  totalPage: number;

  getNextPageData: () => Promise<void>;
  getUnReadNum: () => Promise<void>;
  resetData: () => void;
}

const useMsgStore = create<MsgStoreState>((set, get) => ({
  msgList: [],
  unreadNum: 0,

  page: INIT_PAGE - 1,
  totalPage: INIT_PAGE,

  getNextPageData: async () => {
    const {totalPage, page} = get();

    if (page >= totalPage) {
      return;
    }

    const res = await getMesageList(page + 1);

    set(state => ({
      ...state,
      page: page + 1,
      totalPage: res.total,
      msgList: [...state.msgList, ...res.list]
    }));
  },

  getUnReadNum: async () => {
    const { unread_message_count } = await getUnreadNum();

    set(state => ({
      ...state,
      unreadNum: unread_message_count
    }));
  },

  resetData: () => {
    set({
      msgList: [],
      page: INIT_PAGE - 1,
      totalPage: INIT_PAGE,
    });
  }
}));

export default useMsgStore;
