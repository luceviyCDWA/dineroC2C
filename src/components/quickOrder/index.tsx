import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { useAccount } from "wagmi";
import copy from "copy-to-clipboard";
import { Toast } from "antd-mobile";

import RightPage from "../rightPage";
import CoinSelect from "../coinSelect";

import useSelector from "@/hooks/useSelector";
import useQuickOrderStore from "@/store/useQuickOrderStore";
import usePublicDataStore from "@/store/usePublicDataStore";
import useUserStore from "@/store/useUserStore";
import useLoginModalStore from "@/store/useLoginModalStore";
import useContract from "@/hooks/useContract";

import USDTImg from "@/assets/imgs/example/usdt.png";
import TelegramIcon from "@/assets/imgs/settings/telegram.webp";
import DiscordIcon from "@/assets/imgs/settings/discord.png";
import WhatsappIcon from "@/assets/imgs/settings/whatapp.webp";

import { ActionType, BtnNameByActionType, ICoinItem, OrderStatus } from "@/types";

import Styles from "./index.module.less";
import _ from "lodash";

const QuickOrder: React.FC = () => {
  const { coinList } = usePublicDataStore((state) => ({
    coinList: state.coinList,
  }));
  const onShowLogin = useLoginModalStore((state) => state.onShowLogin);
  const { isConnected } = useAccount();
  const isLogin = useUserStore((state) => state.isLogin);
  const {
    showQuickOrder,
    orderInfo,
    contractInfo,
    setShowQuickOrder,
    quickOrderResolver,
  } = useQuickOrderStore(
    useSelector([
      "showQuickOrder",
      "orderInfo",
      "contractInfo",
      "setShowQuickOrder",
      "quickOrderResolver",
    ]),
  );
  const { createOrder, payOrder } = useContract(orderInfo?.id || '', orderInfo?.order_onchain_id || '');

  const [curCoinInfo, setCurCoinInfo] = useState<ICoinItem>();

  useEffect(() => {
    if (orderInfo) {
      setCurCoinInfo(
        coinList.find((target) => target.id === orderInfo?.category_id),
      );
    }
  }, [orderInfo, coinList]);

  function onClose () {
    setShowQuickOrder(false);
  }

  const onPay = _.debounce(async () => {
    if (!orderInfo) {
      return;
    }

    if (!isConnected || !isLogin) {
      await onShowLogin();
    }

    try {
      if (orderInfo.status === OrderStatus.InitState) {
        await createOrder(Number(orderInfo.total_price), orderInfo.type);
      } else {
        await payOrder(Number(orderInfo.total_price), orderInfo.type);
      }

      Toast.show({
        icon: "success",
        content: "Sell Successfully",
      });

      quickOrderResolver();
      onClose();
    } catch (e) {
      console.log(e);
    }
  }, 200);

  function onCopy (content: string) {
    if (!content) {
      return;
    }

    copy(content);

    Toast.show({
      icon: "success",
      content: "opied!",
    });
  }

  return (
    <>
      {orderInfo && (
        <RightPage
          show={showQuickOrder}
          onClose={onClose}
          title={BtnNameByActionType[orderInfo.type]}
        >
          <div className={Styles["order__publish"]}>
            <div className={Styles["order__publish-header"]}>
              <div className={Styles["tabs"]}>
                <div
                  className={classNames(Styles["tab-item"], {
                    [Styles["active"]]: orderInfo.type === ActionType.Buy,
                  })}
                >
                  Buy
                </div>
                <div
                  className={classNames(Styles["tab-item"], {
                    [Styles["active"]]: orderInfo.type === ActionType.Sell,
                  })}
                >
                  Sell
                </div>
              </div>
            </div>

            <div className={Styles["order__publish-coin"]}>
              <CoinSelect
                curCoinInfo={curCoinInfo}
                onSelectCoin={setCurCoinInfo}
                disabled
              />
            </div>

            <div className={Styles["order__publish-main"]}>
              <div className={Styles['main-container']}>
                <div className={Styles["input__item"]}>
                  <div className={Styles["input__item-title"]}>Total Count</div>
                  <div className={Styles["input__item-input"]}>
                    {orderInfo.total_count}
                  </div>
                </div>

                <div className={Styles["input__item"]}>
                  <div className={Styles["input__item-title"]}>Total Price</div>
                  <div className={Styles["input__item-input"]}>
                    <span className={Styles["content"]}>
                      {orderInfo.total_price}
                    </span>
                    <img className={Styles["currency-icon"]} src={USDTImg} />
                    <span className={Styles["currency-name"]}>USDT</span>
                  </div>
                </div>

                <div className={Styles["input__item"]}>
                  <div className={Styles["input__item-title"]}>Unit Price</div>
                  <div className={Styles["input__item-input"]}>
                    {orderInfo.unit_price ? (
                      <span className={Styles["unit-price"]}>
                        {orderInfo.unit_price} USDT
                      </span>
                    ) : (
                      <span className={Styles["placeholder"]}>0.00USDT</span>
                    )}
                  </div>
                </div>

                {contractInfo?.telegram ? (
                  <div
                    className={Styles["input__item"]}
                    onClick={() => onCopy(contractInfo.telegram || "")}
                  >
                    <div className={Styles["input__item-title"]}>Telegram</div>
                    <div className={Styles["input__item-input"]}>
                      <img
                        className={Styles["input-icon"]}
                        src={TelegramIcon}
                      />
                      <span className={Styles["content"]}>
                        {contractInfo.telegram || ""}
                      </span>
                    </div>
                  </div>
                ) : null}

                {contractInfo?.discord ? (
                  <div
                    className={Styles["input__item"]}
                    onClick={() => onCopy(contractInfo.discord || "")}
                  >
                    <div className={Styles["input__item-title"]}>Discord</div>
                    <div className={Styles["input__item-input"]}>
                      <img className={Styles["input-icon"]} src={DiscordIcon} />
                      <span className={Styles["content"]}>
                        {contractInfo.discord || ""}
                      </span>
                    </div>
                  </div>
                ) : null}

                {contractInfo?.whatsapp ? (
                  <div
                    className={Styles["input__item"]}
                    onClick={() => onCopy(contractInfo.whatsapp || "")}
                  >
                    <div className={Styles["input__item-title"]}>WhatsApp</div>
                    <div className={Styles["input__item-input"]}>
                      <img
                        className={Styles["input-icon"]}
                        src={WhatsappIcon}
                      />
                      <span className={Styles["content"]}>
                        {contractInfo.whatsapp || ""}
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>

            <div className={Styles["publish-btn"]} onClick={onPay}>
              <div className={Styles["btn"]}>Pay</div>
            </div>
          </div>
        </RightPage>
      )}
    </>
  );
};
export default QuickOrder;
