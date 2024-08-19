import { erc20ABI, PublicClient } from "wagmi";
import { useAccount, usePublicClient, useWalletClient, useContractWrite } from "wagmi";
import { useEffect, useRef } from "react";
import { GetWalletClientResult } from "wagmi/actions";
import { DineroAbi } from "@/utils/abi";
import { Toast } from "antd-mobile";
import { ActionType } from "@/types";
import { buyerConfirmOrder, getSignByOrderOnChainId, updateOrderTx } from "@/api/order";
import usePublicDataStore from "@/store/usePublicDataStore";

export interface Ipurchase {
  value: bigint[];
  recipients: string[];
  referrers: string[];
  keyManagers: string[];
  data: string[] | ["0x"];
}
export default function useContract() {
  const USDT_ADDRESS = "0xe24ff3d398ec931a22076608a16e85edbaacd4a4";
  const CONTRACT_ADDRESS = "0x463bb171cd640d53ef915700de31c9a1deff6566";
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
  const createOrder = async (orderId: string, totalPrice: number, actionType: ActionType) => {
    Toast.show({
      duration: 0,
      icon: "loading",
      content: "Loading...",
    });

    try {
      await approve(
        CONTRACT_ADDRESS as `0x${string}`,
        BigInt(Number(totalPrice) * Math.pow(10, 18)),
      );

      const res = await writeCreateOrder({
        args: [orderId, Number(totalPrice) * Math.pow(10, 18), actionType],
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
        icon: "error",
        content: "Pay Failed",
      });

      throw new Error('pay failed');
    }
  }

  // 支付订单
  const payOrder = async (orderId: string, totalPrice: number, actionType: ActionType) => {
    Toast.show({
      duration: 0,
      icon: "loading",
      content: "Loading...",
    });

    try {
      await approve(
        CONTRACT_ADDRESS as `0x${string}`,
        BigInt(Number(totalPrice) * Math.pow(10, 18)),
      );

      const res = await writePayOrder({
        args: [orderId, Number(totalPrice) * Math.pow(10, 18), actionType],
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
        icon: "error",
        content: "Pay Failed",
      });

      throw new Error("pay failed");
    }
  }

  // 取消
  const cancelOrder = async (orderId: string) => {
    Toast.show({
      duration: 0,
      icon: "loading",
      content: "Loading...",
    });

    try {
      await writeCancelOrder({
        args: [orderId],
      });
      Toast.clear();
    } catch (e) {
      Toast.clear();
      Toast.show({
        icon: "error",
        content: "Cancel Failed",
      });

      throw new Error("Cancel failed");
    }
  }

  // 确认
  const confirmOrder = async (
    orderId: string,
    orderOnChainId: string,
    actionType: ActionType,
  ) => {
    Toast.show({
      duration: 0,
      icon: "loading",
      content: "Loading...",
    });

    try {
      const { signature } = await getSignByOrderOnChainId(
        orderOnChainId,
        account.address as string,
      );

      await writeConfirm({
        args: [orderId, signature],
      });

      if (actionType === ActionType.Buy) {
        await buyerConfirmOrder(orderId);
      }
      
      Toast.clear();
    } catch (e) {
      Toast.clear();
      Toast.show({
        icon: "error",
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
