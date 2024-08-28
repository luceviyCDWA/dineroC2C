import { ActionType, OrderStatus } from "@/types";

// 创建订单操作是否合法
export function createOrderValidate(status: OrderStatus) {
  return status === OrderStatus.InitState;
}


// 支付订单操作是否合法
export function payOrderValidate(status: OrderStatus, actionType: ActionType) {
  return (
    (status === OrderStatus.WaitForBuyer &&
      actionType === ActionType.Buy) ||
    (status === OrderStatus.WaitForSeller &&
      actionType === ActionType.Sell)
  );
}

// 取消订单操作是否合法
export function cancelOrderValidate(status: OrderStatus, actionType: ActionType) {
  return (
    (status === OrderStatus.WaitForBuyer &&
      actionType === ActionType.Sell) ||
    (status === OrderStatus.WaitForSeller &&
      actionType === ActionType.Buy) ||
    (status === OrderStatus.BothPaid &&
      actionType === ActionType.Sell) ||
    (status === OrderStatus.CancelWithBuyer &&
      actionType === ActionType.Sell) ||
    (status === OrderStatus.CancelWithSeller &&
      actionType === ActionType.Buy)
  );
}

// 确认订单操作是否合法
export function confirmOrderValidate(
  status: OrderStatus,
  actionType: ActionType,
) {
  return (
    (status === OrderStatus.BothPaid && actionType === ActionType.Buy) ||
    (status === OrderStatus.Withdrawal && actionType === ActionType.Sell)
  );
}