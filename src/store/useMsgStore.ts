import { create } from "zustand";

import request from "@/utils/request";
import { DEFAULT_PAGE_SIZE, INIT_PAGE } from "@/config/env";

import MsgIcon from '@/assets/imgs/example/message.png';

import { IMessageItem } from "@/views/message/types";

interface MsgStoreState {
  msgList: IMessageItem[];

  page: number;
  totalPage: number;

  getNextPageData: () => Promise<void>;
  resetData: () => void;
}

const REQUEST_URL = '/test';

const useMsgStore = create<MsgStoreState>((set, get) => ({
  msgList: [],

  page: INIT_PAGE - 1,
  totalPage: INIT_PAGE,

  getNextPageData: async () => {
    const {totalPage, page} = get();

    if (page >= totalPage) {
      return;
    }

    // const res = await request<
    //   unknown,
    //   {
    //     pageTotal: number;
    //     data: IMessageItem[];
    //   }
    // >({
    //   url: REQUEST_URL,
    //   method: "get",
    //   params: {
    //     page: page + 1,
    //     pageSize: DEFAULT_PAGE_SIZE,
    //   },
    // });

    const res = {
      page: page + 1,
      pageTotal: 100,
      data: [
        {
          id: `${page * 10 + 1}`,
          icon: MsgIcon,
          title: "Dinero",
          content:
            "Some one has pay the order, please pay the sdsdg sdf asf qfqsfa dfs ",
          createTime: "Oct. 08 2024 12:29:3",

          hasRead: false,
        },
        {
          id: `${page * 10 + 2}`,
          icon: MsgIcon,
          title: "Dinero",
          content:
            "Some one has pay the order, please pay the sdsdg sdf asf qfqsfa dfs ",
          createTime: "Oct. 08 2024 12:29:3",

          hasRead: false,
        },
        {
          id: `${page * 10 + 3}`,
          icon: MsgIcon,
          title: "Dinero",
          content:
            "Some one has pay the order, please pay the sdsdg sdf asf qfqsfa dfs ",
          createTime: "Oct. 08 2024 12:29:3",

          hasRead: false,
        },
        {
          id: `${page * 10 + 4}`,
          icon: MsgIcon,
          title: "Dinero",
          content:
            "Some one has pay the order, please pay the sdsdg sdf asf qfqsfa dfs ",
          createTime: "Oct. 08 2024 12:29:3",

          hasRead: false,
        },
        {
          id: `${page * 10 + 5}`,
          icon: MsgIcon,
          title: "Dinero",
          content:
            "Some one has pay the order, please pay the sdsdg sdf asf qfqsfa dfs ",
          createTime: "Oct. 08 2024 12:29:3",

          hasRead: false,
        },
        {
          id: `${page * 10 + 6}`,
          icon: MsgIcon,
          title: "Dinero",
          content:
            "Some one has pay the order, please pay the sdsdg sdf asf qfqsfa dfs ",
          createTime: "Oct. 08 2024 12:29:3",

          hasRead: false,
        },
        {
          id: `${page * 10 + 7}`,
          icon: MsgIcon,
          title: "Dinero",
          content:
            "Some one has pay the order, please pay the sdsdg sdf asf qfqsfa dfs ",
          createTime: "Oct. 08 2024 12:29:3",

          hasRead: false,
        },
        {
          id: `${page * 10 + 9}`,
          icon: MsgIcon,
          title: "Dinero",
          content:
            "Some one has pay the order, please pay the sdsdg sdf asf qfqsfa dfs ",
          createTime: "Oct. 08 2024 12:29:3",

          hasRead: false,
        },
      ],
    };

    set(state => ({
      ...state,
      page: page + 1,
      totalPage: res.pageTotal,
      msgList: [...state.msgList, ...res.data]
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
