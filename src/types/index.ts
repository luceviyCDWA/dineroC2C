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

export interface IUserInfo {
  token: string;
}
