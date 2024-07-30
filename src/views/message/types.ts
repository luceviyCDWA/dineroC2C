import { ActionType } from "@/types";

export const enum IMessageStatus {
  UnRead = 1,
  Readed = 2,
}

export interface IMessageItem {
  id: string;
  title: string;
  content: string;
  created_at: string;

  status: IMessageStatus;
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