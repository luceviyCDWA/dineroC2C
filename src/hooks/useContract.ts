import { erc20ABI, PublicClient, useContractRead } from "wagmi";
import { useAccount, usePublicClient, useWalletClient, useContractWrite } from "wagmi";
import { useEffect, useRef } from "react";
import { GetWalletClientResult } from "wagmi/actions";
import { DineroAbi } from "@/utils/abi";
import { Toast } from "antd-mobile";
import { ActionType } from "@/types";
import { buyerConfirmOrder, getOrderDetail, getSignByOrderOnChainId, updateOrderTx } from "@/api/order";
import usePublicDataStore from "@/store/usePublicDataStore";
import { cancelOrderValidate, confirmOrderValidate, createOrderValidate, payOrderValidate } from "@/utils/orderValidate";

export interface Ipurchase {
  value: bigint[];
  recipients: string[];
  referrers: string[];
  keyManagers: string[];
  data: string[] | ["0x"];
}

export const USDT_ADDRESS = "0xe24ff3d398ec931a22076608a16e85edbaacd4a4";
export const CONTRACT_ADDRESS = "0x320881d4f14876e9331c0fba04fb947d83e7f7f0";

export default function useContract(orderId: string, orderOnChainId: string) {
  // current connect account add network
  const publicClient = usePublicClient();
  const account = useAccount();

  const usePublicClientRef = useRef<PublicClient | null>(null);
  const useWalletClientRef = useRef<GetWalletClientResult | undefined>();
  const { data: walletClient } = useWalletClient();

  const chainList = usePublicDataStore(state => state.chainList);

  const { writeAsync: writeApprove } = useContractWrite({
    address: USDT_ADDRESS,
    abi: erc20ABI,
    functionName: "approve",
    account: account.address,
  });

  const { writeAsync: writeCreateOrder } = useContractWrite({
    abi: DineroAbi,
    address: CONTRACT_ADDRESS,
    functionName: "createOrder",
  });

  const { writeAsync: writePayOrder } = useContractWrite({
    abi: DineroAbi,
    address: CONTRACT_ADDRESS,
    functionName: "payOrder",
  });

  const { writeAsync: writeCancelOrder } = useContractWrite({
    abi: DineroAbi,
    address: CONTRACT_ADDRESS,
    functionName: "cancelOrder",
  });

  const { writeAsync: writeConfirm } = useContractWrite({
    abi: DineroAbi,
    address: CONTRACT_ADDRESS,
    functionName: "finishOrderBySeller",
  });

  const { refetch } = useContractRead({
    abi: DineroAbi,
    address: CONTRACT_ADDRESS,
    functionName: "orderList",
    args: [orderOnChainId],
  });

  useEffect(() => {
    if (publicClient) {
      usePublicClientRef.current = publicClient;
    }
  }, [publicClient]);

  useEffect(() => {
    if (walletClient) {
      useWalletClientRef.current = walletClient;
    }
  }, [walletClient]);

  const approve = async (
    unLockAddress: `0x${string}`,
    amount: bigint,
  ) => {
    if (!usePublicClientRef.current || !useWalletClientRef.current) {
      return;
    }

    let hash

    try {
      const res = await writeApprove({
        args: [unLockAddress, amount],
      });

      hash = res.hash;

      await usePublicClientRef.current?.waitForTransactionReceipt({
        hash,
      });
    } catch (err) {
      console.log(err);
    }

    return hash;
  };

  // 创建订单
  const createOrder = async (totalPrice: number, actionType: ActionType) => {
    if (!orderId) {
      return;
    }

    Toast.show({
      duration: 0,
      icon: "loading",
      content: "Loading...",
    });

    try {
      const orderInfoFromBE = await getOrderDetail(orderId);
      const { data } = await refetch();
      const [, , , , status] = data as [
        unknown,
        unknown,
        bigint,
        bigint,
        bigint,
      ];

      if (
        !createOrderValidate(orderInfoFromBE.status) ||
        !createOrderValidate(Number(status))
      ) {
        return payOrder(totalPrice, actionType);
      }

      await approve(
        CONTRACT_ADDRESS as `0x${string}`,
        BigInt(Number(totalPrice) * Math.pow(10, 18)),
      );

      const res = await writeCreateOrder({
        args: [
          orderOnChainId,
          Number(totalPrice) * Math.pow(10, 18),
          actionType,
        ],
      });

      await updateOrderTx({
        id: orderId,
        type: actionType === ActionType.Buy ? ActionType.Sell : ActionType.Buy,
        address: account.address as string,
        chain_id: chainList[0].chain_id,
        tx: res.hash,
      });

      Toast.clear();
    } catch (e) {
      Toast.clear();
      Toast.show({
        icon: "fail",
        content: "Pay Failed",
      });

      throw new Error('pay failed');
    }
  }

  // 支付订单
  const payOrder = async (totalPrice: number, actionType: ActionType) => {
    if (!orderId) {
      return;
    }

    Toast.show({
      duration: 0,
      icon: "loading",
      content: "Loading...",
    });

    try {
      const orderInfoFromBE = await getOrderDetail(orderId);
      const { data } = await refetch();
      const [, , , , status] = data as [
        unknown,
        unknown,
        bigint,
        bigint,
        bigint,
      ];

      if (
        !payOrderValidate(orderInfoFromBE.status, actionType) ||
        !payOrderValidate(Number(status), actionType)
      ) {
        throw new Error("status is not valid");
      }

      await approve(
        CONTRACT_ADDRESS as `0x${string}`,
        BigInt(Number(totalPrice) * Math.pow(10, 18)),
      );

      const res = await writePayOrder({
        args: [
          orderOnChainId,
          Number(totalPrice) * Math.pow(10, 18),
          actionType,
        ],
      });

      await updateOrderTx({
        id: orderId,
        type: actionType === ActionType.Buy ? ActionType.Sell : ActionType.Buy,
        address: account.address as string,
        chain_id: chainList[0].chain_id,
        tx: res.hash,
      });

      Toast.clear();
    } catch (e) {
      Toast.clear();
      Toast.show({
        icon: "fail",
        content: "Pay Failed",
      });

      throw new Error("pay failed");
    }
  }

  // 取消
  const cancelOrder = async (actionType: ActionType) => {
    if (!orderId) {
      return;
    }

    Toast.show({
      duration: 0,
      icon: "loading",
      content: "Loading...",
    });

    try {
      const orderInfoFromBE = await getOrderDetail(orderId);
      const { data } = await refetch();
      const [, , , , status] = data as [
        unknown,
        unknown,
        bigint,
        bigint,
        bigint,
      ];

      if (
        !cancelOrderValidate(orderInfoFromBE.status, actionType) ||
        !cancelOrderValidate(Number(status), actionType)
      ) {
        throw new Error("status is not valid");
      }

      const res = await writeCancelOrder({
        args: [orderOnChainId],
      });

      await updateOrderTx({
        id: orderId,
        type: actionType === ActionType.Buy ? ActionType.Sell : ActionType.Buy,
        address: account.address as string,
        chain_id: chainList[0].chain_id,
        tx: res.hash,
      });

      Toast.clear();
    } catch (e) {
      Toast.clear();
      Toast.show({
        icon: "fail",
        content: "Cancel Failed",
      });

      throw new Error("Cancel failed");
    }
  };

  // 确认
  const confirmOrder = async (
    orderOnChainId: string,
    actionType: ActionType,
  ) => {
    if (!orderId) {
      return;
    }

    Toast.show({
      duration: 0,
      icon: "loading",
      content: "Loading...",
    });

    try {
      const orderInfoFromBE = await getOrderDetail(orderId);
      const { data } = await refetch();
      const [, , , , status] = data as [
        unknown,
        unknown,
        bigint,
        bigint,
        bigint,
      ];

      if (
        !confirmOrderValidate(orderInfoFromBE.status, actionType) ||
        !confirmOrderValidate(Number(status), actionType)
      ) {
        throw new Error("status is not valid");
      }

      const { signature } = await getSignByOrderOnChainId(
        orderOnChainId,
        account.address as string,
      );

      await writeConfirm({
        args: [orderOnChainId, signature],
      });

      if (actionType === ActionType.Buy) {
        await buyerConfirmOrder(orderId);
      }
      
      Toast.clear();
    } catch (e) {
      Toast.clear();
      Toast.show({
        icon: "fail",
        content: "Confirm Failed",
      });

      throw new Error("Confirm failed");
    }
  };

  return {
    approve,
    createOrder,
    payOrder,
    cancelOrder,
    confirmOrder,
    account: account.address,
    USDT_ADDRESS,
    CONTRACT_ADDRESS,
  };
}
