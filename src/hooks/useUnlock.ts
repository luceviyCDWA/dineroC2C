import {
  Account,
  BaseError,
  ContractFunctionRevertedError,
} from "viem";
import { erc20ABI, PublicClient } from "wagmi";
import { useAccount, usePublicClient, useWalletClient, useContractWrite } from "wagmi";
import { useEffect, useRef } from "react";
import { getContract, GetWalletClientResult } from "wagmi/actions";
import { DineroAbi } from "@/utils/abi";
import { Toast } from "antd-mobile";

export interface Ipurchase {
  value: bigint[];
  recipients: string[];
  referrers: string[];
  keyManagers: string[];
  data: string[] | ["0x"];
}
export default function useUnlock() {
  // current connect account add network
  const publicClient = usePublicClient();
  const account = useAccount();

  const usePublicClientRef = useRef<PublicClient | null>(null);
  const useWalletClientRef = useRef<GetWalletClientResult | undefined>();
  const { data: walletClient } = useWalletClient();

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

      const approveTx = await token0.write.approve({
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
      // await usePublicClientRef.current?.waitForTransactionReceipt({ hash: hash! });
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
              icon: 'error',
              content: errorName,
            })
          }
        }
      }
    }

    return hash;
  };

  const funcWithContract = async (
    contractAddress: string,
    funcName: string,
    args: Array<unknown>,
  ) => {
    if (!usePublicClientRef.current) {
      return;
    }

    let hash;
    try {
      const rx = useContractWrite({
        abi: DineroAbi,
        address: contractAddress as `0x${string}`,
        functionName: funcName,
        args: [...args]
      });
      // const token0 = getContract({
      //   address: contractAddress,
      //   abi: DineroAbi,
      //   publicClient: usePublicClientRef.current,
      //   walletClient: useWalletClientRef.current,
      // });

      // const approveTx = await token0.write[funcName]({
      //   account: account.address,
      //   args: [...args],
      // });

      // const { request } = await usePublicClientRef.current.simulateContract({
      //   abi: DineroAbi,
      //   address: contractAddress as `0x${string}`,
      //   functionName: funcName,
      //   args: [...args],
      //   account: account as unknown as `0x${string}` | Account,
      // });
      // hash = await useWalletClientRef.current?.writeContract(request);

      // wati tx
      // const receipt =
        // await usePublicClientRef.current?.waitForTransactionReceipt({ hash });
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

  return {
    approve,
    funcWithContract,
    USDT_ADDRESS: "0xe24ff3d398ec931a22076608a16e85edbaacd4a4",
  };
}
