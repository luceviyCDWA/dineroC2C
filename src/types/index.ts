export const enum ActionType {
  Buy = "buy",
  Sell = "sell",
}

export const DealerByActionType: Record<ActionType, string> = {
  [ActionType.Buy]: "seller",
  [ActionType.Sell]: "buyer",
};

export const BtnNameByActionType: Record<ActionType, string> = {
  [ActionType.Buy]: "Buy",
  [ActionType.Sell]: "Sell",
};


// 个人信息
export interface IUserInfo {
  token: string;
}

// 热门
export interface IHotItem {
  id: string;
  name: string;
  image: string;
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

