import { configureChains, createConfig, PublicClient, type WebSocketPublicClient } from "wagmi";
import { type FallbackTransport } from "viem";
// common Rpc
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  bsc,
  goerli,
  scroll,
  scrollSepolia,
  sepolia,
  linea,
} from "wagmi/chains";
import { infuraProvider } from "wagmi/providers/infura";
import { publicProvider } from "wagmi/providers/public";

import { getDefaultWallets } from "@rainbow-me/rainbowkit";

export default function useInitWallet(): {
  chains: ReturnType<typeof configureChains>["chains"];
  wagmiConfig: ReturnType<
    typeof createConfig<PublicClient<FallbackTransport>, WebSocketPublicClient>
  >;
} {
  const { chains, publicClient } = configureChains(
    [
      mainnet,
      bsc,
      goerli,
      polygon,
      optimism,
      arbitrum,
      base,
      linea,
      sepolia,
      scroll,
      scrollSepolia,
    ],
    //   [ infuraProvider({ apiKey: CLIENT_KEY })]
    [
      infuraProvider({ apiKey: "57cd9ebe98034625a9381c34fdc6aed0" }),
      publicProvider(),
    ],
  );

  const { connectors } = getDefaultWallets({
    appName: "web3events",
    //walletconnect projectId
    projectId: "e960f3dd85194142e4b0783f5197769b",
    chains,
  });

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
  });

  return {
    chains,
    wagmiConfig,
  };
}
