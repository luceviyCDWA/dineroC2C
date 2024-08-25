import { create } from "zustand";
import { Toast } from "antd-mobile";

import { ActionType, IOrderDetail, OrderStatus } from "@/types";
import { getOrderDetail } from "@/api/order";

interface QuickOrderStore {
  showQuickOrder: boolean;
  orderInfo: IOrderDetail | null;

  quickOrderResolver: () => void;
  quickOrderRejecter: () => void;

  setShowQuickOrder: (show: boolean) => void;
  getOrderInfoAndShow: (
    orderId: string,
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

  getOrderInfoAndShow: async (orderId: string) => {
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
        orderDetail.type =
          orderDetail.type === ActionType.Buy ? ActionType.Sell : ActionType.Buy;

        Toast.clear();

        if (
          orderDetail.status === OrderStatus.InitState ||
          (orderDetail.status === OrderStatus.WaitForBuyer &&
            orderDetail.type === ActionType.Buy) || (orderDetail.status === OrderStatus.WaitForSeller && orderDetail.type === ActionType.Sell)
        ) {
          set((state) => ({
            ...state,
            orderInfo: orderDetail,
            // 显示弹窗
            showQuickOrder: true,

            // 记录reolve和reject
            quickOrderResolver: resolve,
            quickOrderRejecter: reject,
          }));
        } else {
          Toast.show({
            icon: "fail",
            content: "Order has been paid",
          });
        }
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
