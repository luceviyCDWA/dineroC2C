export interface IMessageItem {
  id: string;
  icon: string;
  title: string;
  content: string;
  createTime: string;

  hasRead: boolean;
}

export const enum ActionType {
  Buy = 'buy',
  Sell = 'sell',
}

export const DealerByActionType: Record<ActionType, string> = {
  [ActionType.Buy]: 'seller',
  [ActionType.Sell]: 'buyer',
}

export const enum OrderStatus {
  Pending,
  End
}

export const OrderStatusTxtHash: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: 'Pending Order',
  [OrderStatus.End]: 'Order Ended',
};

export interface IMessageDetail {
  id: string;

  coinIcon: string;
  coinName: string;
  actionType: ActionType;

  total: number;
  totalPrice: string;
  unitPrice: string;
  currencyName: string;

  status: OrderStatus;
  guaranteeDeposit: string;

  deadline: number;
}