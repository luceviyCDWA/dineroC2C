import { create } from "zustand";
import { Toast } from "antd-mobile";

import { ActionType, IOrderDetail } from "@/types";
import { getOrderDetail } from "@/api/order";

interface QuickOrderStore {
  showQuickOrder: boolean;
  orderInfo: IOrderDetail | null;

  quickOrderResolver: () => void;
  quickOrderRejecter: () => void;

  setShowQuickOrder: (show: boolean) => void;
  getOrderInfoAndShow: (
    orderId: string,
    orderType: ActionType,
  ) => Promise<void>;
}

const useQuickOrderStore = create<QuickOrderStore>((set) => ({
  showQuickOrder: false,
  orderInfo: null,

  quickOrderResolver: () => {},
  quickOrderRejecter: () => {},

  setShowQuickOrder: (showQuickOrder) => {
    set((state) => ({
      ...state,
      showQuickOrder,
    }));
  },

  getOrderInfoAndShow: async (orderId: string, orderType: ActionType) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise<void>(async (resolve, reject) => {
      Toast.show({
        duration: 0,
        icon: "loading",
        content: "Loading...",
      });

      try {
        const orderDetail = await getOrderDetail(orderId);

        // 覆盖类型
        orderDetail.type = orderType;

        set((state) => ({
          ...state,
          orderInfo: orderDetail,
          // 显示弹窗
          showQuickOrder: true,

          // 记录reolve和reject
          quickOrderResolver: resolve,
          quickOrderRejecter: reject,
        }));

        Toast.clear();
      } catch (e) {
        Toast.clear();
        Toast.show({
          icon: "fail",
          content: "Fetch OrderDetail Failed",
        });

        reject();
      }
    });
  }
}));

export default useQuickOrderStore;
