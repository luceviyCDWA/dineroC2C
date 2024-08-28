import { ActionType, IOrderDetail, OrderStatus } from "@/types";

// 创建订单操作是否合法
export function createOrderValidate(orderInfo: IOrderDetail) {
  return orderInfo.status === OrderStatus.InitState;
}


// 支付订单操作是否合法
export function payOrderValidate(orderInfo: IOrderDetail, actionType: ActionType) {
  return (
    (orderInfo.status === OrderStatus.WaitForBuyer &&
      actionType === ActionType.Buy) ||
    (orderInfo.status === OrderStatus.WaitForSeller &&
      actionType === ActionType.Sell)
  );
}

// 取消订单操作是否合法
export function cancelOrderValidate(orderInfo: IOrderDetail, actionType: ActionType) {
  return (
    (orderInfo.status === OrderStatus.WaitForBuyer &&
      actionType === ActionType.Sell) ||
    (orderInfo.status === OrderStatus.WaitForSeller &&
      actionType === ActionType.Buy) ||
    (orderInfo.status === OrderStatus.BothPaid &&
      actionType === ActionType.Sell) ||
    (orderInfo.status === OrderStatus.CancelWithBuyer &&
      actionType === ActionType.Sell) ||
    (orderInfo.status === OrderStatus.CancelWithSeller &&
      actionType === ActionType.Buy)
  );
}

// 确认订单操作是否合法
export function confirmOrderValidate(
  orderInfo: IOrderDetail,
  actionType: ActionType,
) {
  return (
    (orderInfo.status === OrderStatus.BothPaid &&
      actionType === ActionType.Buy) ||
    (orderInfo.status === OrderStatus.Withdrawal &&
      actionType === ActionType.Sell)
  );
}