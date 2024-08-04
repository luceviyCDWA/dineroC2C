import request from "@/utils/request";

import { ActionType, GuaranteeStatus, IChainItem, ICoinItem, IHotItem } from "@/types";

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

export const getOrderDetail = (orderId: string) => {
  return request.get<
    unknown,
    {
      id: string;
      order_onchain_id: string;
      total_price: number;
      total_count: number;
      unit_price: number;
      is_mortgage: GuaranteeStatus;
      seller: string;
      buyer: string;
      category_id: string;
      status: 1;
      chain_id: string;
      chain_name: string;
      payment_name: string;
      contract_address: string;
      type: ActionType;
      category_name: string;
      category_image: string;
      buyer_tx: string;
      seller_tx: string;
      created_at: string;
      updated_at: string;
      payment_image: "";
    }
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
  return request.post<unknown, { order_id: string }>(
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
