import request from "@/utils/request";

import { ActionType, GuaranteeStatus, IChainItem, ICoinItem, IHotItem, IOrderDetail, SortType } from "@/types";

export const getHotCoinList = () => {
  return request.get<unknown, IHotItem[]>("/apis/v1/dinero/get_hot_list");
};

export const getCoinList = (keyword: string) => {
  return request.post<unknown, ICoinItem[]>(
    "/apis/v1/dinero/get_publish_list",
    { keyword },
  );
}

export const getChainList = () => {
  return request.get<
    unknown,
    IChainItem[]
  >("/apis/v1/dinero/get_chain_list");
}

// 获取订单列表
export const getOrderList = (data: {
  category_id: string;
  type: ActionType;
  is_mortgage: GuaranteeStatus;
  keyword: string;
  sort: SortType;
  limit: number;
  offset: number;
}) => {
  return request.post<unknown, {
    total: number;
    list: IOrderDetail[]
  }>("/apis/v1/dinero/get_order_list", data);
};

export const getOrderDetail = (orderId: string) => {
  return request.get<
    unknown,
    IOrderDetail
  >(`/apis/v1/dinero/get_order_detail/${orderId}`);
}

export const createOrder = (data: {
  total_price: number;
  total_count: number;
  category_id: string;
  type: ActionType;
  chain_id: string;
  chain_name: string;
  payment_name: string;
  contract_address: string;
}) => {
  return request.post<unknown, { order_id: string; order_onchain_id: string }>(
    "/apis/v1/dinero/create_dinero_order",
    data,
  );
};

export const getRecommendList = () => {
  return request.get<unknown, Array<{
    id: string,
    image: string;
  }>>("/apis/v1/dinero/get_recommend_list");
}

export const updateOrderTx = (data: {
  id: string;
  type: ActionType;
  address: string;
  chain_id: string;
  tx: string;
}) => {
  return request.post("/apis/v1/dinero/update_order_with_tx", data);
};

export const getSignByOrderOnChainId = (orderOnChainId: string, address: string) => {
  return request.get<
    unknown,
    {
      signature: string;
    }
  >("/apis/v1/dinero/get_privileges_sign", {
    params: {
      order_onchain_id: orderOnChainId,
      address,
    },
  });
}

export const buyerConfirmOrder = (orderId: string) => {
  return request.get(`/apis/v1/dinero/update_buyer_confirm/${orderId}`);
}
