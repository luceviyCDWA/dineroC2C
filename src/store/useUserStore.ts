import { create } from "zustand";

import { setStore } from "@/utils/storage";

interface UserState {
  isLogin: boolean;
  shareTicket?: string;
  isRegister?: boolean;
  hasLogined?: boolean;
  setIsLogin: (status: boolean) => void;
  setIsRegister: (isRegister: boolean) => void;
  setHasLogined: (newState: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userLoginSuccess: (res: any) => Promise<unknown>;
  userInfo: {
    id: string;
    avatar: string;
    phone: string;
    name: string;
    tenantId: string;
    tenantName: string;
    isTenantAdmin: boolean;
    deptName: string;
    roleList: Array<{
      roleName: string;
      id: string;
    }>;
  };
  getUserInfo: () => Promise<void>;
  setShareTicket: (shareTicket: string) => void;
}

const useUserStore = create<UserState>((set) => ({
  isLogin: false,
  hasLogined: false,
  shareTicket: "",
  userInfo: {
    id: "",
    avatar: "",
    phone: "",
    name: "",
    tenantId: "",
    tenantName: "",
    isTenantAdmin: false,
    deptName: "",
    roleList: [],
  },
  setShareTicket: (shareTicket: string) =>
    set(() => ({
      shareTicket: shareTicket,
    })),
  setIsLogin: (status: boolean) =>
    set(() => ({
      isLogin: status,
    })),
  setIsRegister: (isRegister: boolean) =>
    set(() => ({
      isRegister,
    })),
  setHasLogined: (newState: boolean) =>
    set(() => ({
      hasLogined: newState,
    })),
  userLoginSuccess: (res) =>
    // eslint-disable-next-line no-async-promise-executor
    new Promise(async (resolve, reject) => {
      const { accessToken, refreshToken } = res;
      if (accessToken && refreshToken) {
        await setStore({
          name: "accessToken",
          content: accessToken,
        });
        await setStore({
          name: "refreshToken",
          content: refreshToken,
        });
        set(() => ({
          isLogin: true,
          isRegister: true,
        }));
        return resolve("");
      } else {
        return reject("");
      }
    }),
  getUserInfo: async () => {
    // const res = await getUserInfo();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = {} as any;

    set(() => ({
      userInfo: {
        id: res.userId,
        name: res.name,
        phone: res.phone,
        avatar: res.avatar || "",
        tenantId: res.tenantId || "",
        tenantName: res.tenantName || "",
        isTenantAdmin: res.isAdmin,
        deptName: res.deptName || "",
        roleList: res.roleList || [],
      },
    }));
  },
}));

export default useUserStore;
