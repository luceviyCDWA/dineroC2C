export const enum ActionType {
  Buy = 2,
  Sell = 1
}

export const BtnNameByActionType: Record<ActionType, string> = {
  [ActionType.Buy]: "Buy",
  [ActionType.Sell]: "Sell",
};

export const enum OrderCheckingStatus {
  IsProcessing = 1,
  NotProcessing = 2,
}

//waiting for buyer 2. waiting for seller 3.both are payed 4.cancel with buyer 5.cancel with seller 6.appeal with buyer 7. appeal with seller 8.cancel 9.buyer confirm 100.finish
export const enum OrderStatus {
  InitState = 0,
  WaitForBuyer = 1,
  WaitForSeller = 2,
  BothPaid = 3,
  CancelWithBuyer = 4,
  CancelWithSeller = 5,
  AppealWithBuyer = 6,
  AppealWithSeller = 7,
  Canceled = 8,
  Withdrawal = 9,
  Finish = 100,
}

export const OrderStatusTitleHash: Record<OrderStatus, string> = {
  [OrderStatus.InitState]: "Init",
  [OrderStatus.WaitForBuyer]: "Waiting for buyer",
  [OrderStatus.WaitForSeller]: "Waiting for seller",
  [OrderStatus.BothPaid]: "Both paid",
  [OrderStatus.CancelWithBuyer]: "Canceled with buyer",
  [OrderStatus.CancelWithSeller]: "Canceled with seller",
  [OrderStatus.AppealWithBuyer]: "Appealed with buyer",
  [OrderStatus.AppealWithSeller]: "Appealed with seller",
  [OrderStatus.Canceled]: "Canceld",
  [OrderStatus.Withdrawal]: "Withdrawal",
  [OrderStatus.Finish]: "Finished",
};

// 是否保证金
export const enum GuaranteeStatus {
  NotGuaranteed = 1,
  Guaranteed = 2
}

// 排序
export const enum SortType {
  UnitPriceUp = 1,
  UnitPriceDown = 2,
  TotalPriceUp = 3,
  TotalPriceDown = 4,
  Newest = 5,
  Earliest = 6,
}

export const SORT_TITLE_HASH: Record<SortType, string> = {
  [SortType.UnitPriceUp]: "Price: from low to high",
  [SortType.UnitPriceDown]: "Price: from high to low",
  [SortType.TotalPriceUp]: "Total price: from low to high",
  [SortType.TotalPriceDown]: "Total price: from high to low",
  [SortType.Newest]: "Newest",
  [SortType.Earliest]: "Earliest",
};


// 个人信息
export interface IUserInfo {
  id: string;
  token: string;
}

// 热门
export interface IHotItem {
  id: string;
  name: string;
  image: string;
  payment_name?: string;
  buy_price?: string;
  sell_price?: string;
}


// 货币分类
export interface ICoinItem {
  id: string;
  name: string;
  image: string;
  rpc: string;
  website: string;
  twitter: string;
  telegram: string;
  discord: string;
}

export interface IChainItem {
  id: string;
  name: string;
  chain_id: string;
  contract_address: string;
}

export interface IOrderDetail {
  id: string;
  name: string;
  order_onchain_id: string;
  category_name: string;
  category_image: string;
  category_id: string;
  is_mortgage: GuaranteeStatus;
  type: ActionType;

  unit_price: string;
  total_price: string;
  total_count: number;
  payment_name: string;

  seller?: string;
  buyer?: string;

  is_buying?: OrderCheckingStatus;
  is_selling?: OrderCheckingStatus;

  status: OrderStatus;

  created_at?: string;
}

export interface IContractInfo {
  telegram?: string;
  discord?: string;
  whatsapp?: string;
}
