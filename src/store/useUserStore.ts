import { create } from "zustand";

import { IUserInfo } from "@/types";
import { getStore, removeStore, setStore } from "@/utils/storage";
import { getUserInfo } from "@/api/user";

export const TOKEN_NAME = "dinero-token";

interface UserStore {
  isLogin: boolean;
  userInfo: IUserInfo | null;

  afterLogin: (token: string) => Promise<void>;
  getUserInfo: () => Promise<void>;
  getUserInfoFromToken: () => void;
  clearAll: () => void;
}

const useUserStore = create<UserStore>((set, get) => ({
  isLogin: false,
  userInfo: null,

  afterLogin: async (token: string) => {
    const { getUserInfo: getUserInfoStore } = get();
    const userInfo: IUserInfo = { token, id: '' };

    setStore({
      name: TOKEN_NAME,
      content: userInfo,
    });

    set((state) => ({
      ...state,
      isLogin: true,
      userInfo,
    }));

    getUserInfoStore();
  },

  getUserInfo: async () => {
    const { userInfo } = get();

    if (!userInfo) {
      return;
    }

    const { id } = await getUserInfo();

    userInfo.id = id;

    setStore({
      name: TOKEN_NAME,
      content: userInfo,
    });

    set((state) => ({
      ...state,
      isLogin: true,
      userInfo,
    }));
  },

  getUserInfoFromToken: () => {
    const { clearAll } = get();
    const userInfo = getStore({
      name: TOKEN_NAME
    });

    if (userInfo) {
      set((state) => ({
        ...state,
        isLogin: true,
        userInfo: userInfo,
      }));
    } else {
      clearAll();
    }
  },

  clearAll: () => {
    set(() => ({
      isLogin: false,
      userInfo: null,
    }));

    removeStore({
      name: TOKEN_NAME
    });
  }
}));

export default useUserStore;
