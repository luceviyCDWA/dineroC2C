import React, { Suspense, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
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
import {
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

import useUserStore from "@/store/useUserStore";

import Header from "./header";
import Footer from "./footer";

import "./index.less";
import LoginModal from "../login";


const Layout: React.FC = () => {
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

  const getUserInfoFromToken = useUserStore(
    (state) => state.getUserInfoFromToken,
  );
  

  useEffect(() => {
    getUserInfoFromToken();
  }, []);

  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          <div className="layout">
            <Header />
            <div className="content">
              <Suspense fallback={<div></div>}>
                <Outlet></Outlet>
              </Suspense>
            </div>
            <Footer />
          </div>

          <LoginModal />
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
};

export default Layout;
