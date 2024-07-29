import React, { useEffect, useRef, useState } from "react";
import { Input } from "antd-mobile";
import { useAccount, useSignMessage } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import dayjs from "dayjs";

import RightPage from "../rightPage";
import useLoginModalStore from "@/store/useLoginModalStore";

import WalletIcon from '@/assets/imgs/wallet.png';

import Styles from './index.module.less';
import { login } from "@/api";
import useUserStore from "@/store/useUserStore";


const LoginModal: React.FC = () => {
  const showModal = useLoginModalStore(state => state.showModal);
  const onHideLogin = useLoginModalStore(state => state.onHideLogin);
  const afterLogin = useUserStore((state) => state.afterLogin);

  const [inviteCode, setInviteCode] = useState('');
  const [manualConnect, setManualConnect] = useState(false);
  const [doConnect, setDoConnect] = useState<object>();

  const signMsgRef = useRef<string>(
    `You're signing into Dinero using your wallet on time: ${dayjs()
      .utc()
      .format("MMM DD HH:mm (UTC+0)")}`,
  );

  const {
    address,
    isConnected,
  } = useAccount({
    onConnect: () => {
      (async () => {
        if (manualConnect) {
          signMsgRef.current = `You're signing into Dinero using your wallet on time: ${dayjs()
            .utc()
            .format("MMM DD HH:mm (UTC+0)")}`;
          signMessage({
            message: signMsgRef.current,
          });
        }
      })();
    },
  });

  const { signMessage } = useSignMessage({
    // sign callback
    onSuccess(data) {
      (async () => {
        const res = await login(
          address as string,
          data,
          signMsgRef.current,
          "evm",
          inviteCode,
        );

        afterLogin(res.bearer_token);
      })();
    },
  });

  const { openConnectModal } = useConnectModal();

  useEffect(() => {
    if (!doConnect) return;
    if (isConnected) {
      signMsgRef.current = `You're signing into Dinero using your wallet on time: ${dayjs()
        .utc()
        .format("MMM DD HH:mm (UTC+0)")}`;
      signMessage({
        message: signMsgRef.current,
      });
    } else {
      if (openConnectModal) {
        openConnectModal();
        setManualConnect(true);
      }
    }
  }, [doConnect]);

  const onConnectWallet = () => {
    // force update connection status
    setDoConnect({});
  };

  return (
    <RightPage show={showModal} onClose={onHideLogin}>
      <div className={Styles["login__panel"]}>
        <div className={Styles["login__panel-header"]}>Log in to Dinero</div>

        <div className={Styles["login__panel-invite"]}>
          <div className={Styles["bg"]}></div>
          <div className={Styles["content"]}>
            <span className={Styles["label"]}>
              <span className={Styles["text"]}>invite code (if exist)</span>
            </span>
            <Input value={inviteCode} onChange={setInviteCode} />
          </div>
        </div>

        <div className={Styles["login__panel-list"]}>
          <div className={Styles["login-item"]} onClick={onConnectWallet}>
            <img className={Styles["icon"]} src={WalletIcon} alt="wallet" />
            Wallet
          </div>
        </div>
      </div>
    </RightPage>
  );
}
export default LoginModal;
