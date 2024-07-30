import {
  Account,
  BaseError,
  ContractFunctionRevertedError,
} from "viem";
import { erc20ABI, PublicClient } from "wagmi";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { useEffect, useRef } from "react";
import { GetWalletClientResult } from "wagmi/actions";

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
    if (!usePublicClientRef.current) {
      return;
    }

    let hash;
    try {
      const { request } = await usePublicClientRef.current.simulateContract({
        abi: erc20ABI,
        address: tokenAddress,
        functionName: "approve",
        args: [unLockAddress, amount],
        account: account as unknown as `0x${string}` | Account,
      });
      hash = await useWalletClientRef.current?.writeContract(request);

      // wati tx
      await usePublicClientRef.current?.waitForTransactionReceipt({ hash: hash! });
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
            console.error(errorName);
          }
        }
      }
    }

    return hash;
  };

  return {
    approve,
    USDT_ADDRESS: "0x17a3f74434831b32b951bae3b36507e199dfc83e",
  };
}
