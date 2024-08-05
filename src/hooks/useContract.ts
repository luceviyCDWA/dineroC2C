import {
  BaseError,
  ContractFunctionRevertedError,
} from "viem";
import { erc20ABI, PublicClient } from "wagmi";
import { useAccount, usePublicClient, useWalletClient, useContractWrite } from "wagmi";
import { useEffect, useRef } from "react";
import { getContract, GetWalletClientResult } from "wagmi/actions";
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
  const CONTRACT_ADDRESS = "0x3be0cd01d9801546ebf77e8915f2c10e03c34724";
  // current connect account add network
  const publicClient = usePublicClient();
  const account = useAccount();

  const usePublicClientRef = useRef<PublicClient | null>(null);
  const useWalletClientRef = useRef<GetWalletClientResult | undefined>();
  const { data: walletClient } = useWalletClient();

  const chainList = usePublicDataStore(state => state.chainList);

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

  // const { write, isSuccess, isLoading } = useContractWrite({
  //   abi: DineroAbi,
  //   address:CONTRACT_ADDRESS,
  //   functionName: "createOrder",
  //   args: ["5", Number(totalPrice) * Math.pow(10, 18), actionType],
  // });

  // const { write, isSuccess, isLoading } = useContractWrite({
  //   abi: DineroAbi,
  //   address:CONTRACT_ADDRESS,
  //   functionName: "payOrder",
  //   args: ["5", Number(totalPrice) * Math.pow(10, 18), actionType],
  // });

  // const { write, isSuccess, isLoading } = useContractWrite({
  //   abi: DineroAbi,
  //   address:CONTRACT_ADDRESS,
  //   functionName: "cancelOrder",
  //   args: ["5"],
  // });

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
    tokenAddress: `0x${string}`,
    unLockAddress: `0x${string}`,
    amount: bigint,
  ) => {
    if (!usePublicClientRef.current || !useWalletClientRef.current) {
      return;
    }

    let hash;
    try {
      const token0 = getContract({
        address: tokenAddress,
        abi: erc20ABI,
        publicClient: usePublicClientRef.current,
        walletClient: useWalletClientRef.current,
      });

      hash = await token0.write.approve({
        account: account.address,
        args: [unLockAddress, amount],
      });

      // const { request } = await usePublicClientRef.current.simulateContract({
      //   abi: erc20ABI,
      //   address: tokenAddress,
      //   functionName: "approve",
      //   args: [unLockAddress, amount],
      //   account: account.address,
      // });
      // hash = await useWalletClientRef.current?.writeContract(request);

      // wati tx
      await usePublicClientRef.current?.waitForTransactionReceipt({
        hash,
      });
    } catch (err) {
      console.log(err);
      if (err instanceof BaseError) {
        const revertError = err.walk(
          (err) => err instanceof ContractFunctionRevertedError,
        );
        if (revertError instanceof ContractFunctionRevertedError) {
          const errorName = revertError.data?.errorName ?? "";
          // do something with `errorName`
          console.log(errorName);
          if (errorName) {
            Toast.show({
              icon: "error",
              content: errorName,
            });
          }
        }
      }
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
        USDT_ADDRESS as `0x${string}`,
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
        content: (e as object).toString(),
      });
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
        USDT_ADDRESS as `0x${string}`,
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
        content: (e as object).toString(),
      });
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
        content: (e as object).toString(),
      });
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
        content: (e as object).toString(),
      });
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
