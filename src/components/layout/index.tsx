import React from "react";
import { WagmiConfig } from "wagmi";
import {
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";

import Header from "./header";
import Footer from "./footer";
import LayoutContent from "./content";
import LoginModal from "../login";
import QuickOrder from "../quickOrder";

import useInitWallet from "./hooks/useInitWallet";
import useInitUserInfo from "./hooks/useInitUserInfo";
import useInitQuickOrder from "./hooks/useInitQuickOrder";

import "./index.less";

const Layout: React.FC = () => {
  
  const { chains, wagmiConfig } = useInitWallet();

  // 初始化UserInfo
  useInitUserInfo();

  // 初始化快速订单（url中参数）
  useInitQuickOrder();

  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider chains={chains}>
          <div className="layout">
            <Header />
            <LayoutContent />
            <Footer />
          </div>

          {/* 全局组件 */}
          <LoginModal />
          <QuickOrder />
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  );
};

const LayoutMemo = React.memo(Layout);

export default LayoutMemo;
