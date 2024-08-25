import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { useAccount } from "wagmi";

import RightPage from "../rightPage";
import CoinSelect from "../coinSelect";

import useSelector from "@/hooks/useSelector";
import useQuickOrderStore from "@/store/useQuickOrderStore";
import usePublicDataStore from "@/store/usePublicDataStore";
import useUserStore from "@/store/useUserStore";
import useLoginModalStore from "@/store/useLoginModalStore";
import useContract from "@/hooks/useContract";

import USDTImg from "@/assets/imgs/example/usdt.png";

import { ActionType, BtnNameByActionType, ICoinItem, OrderStatus } from "@/types";

import Styles from "./index.module.less";
import { Toast } from "antd-mobile";

const QuickOrder: React.FC = () => {
  const { coinList } = usePublicDataStore((state) => ({
    coinList: state.coinList,
  }));
  const onShowLogin = useLoginModalStore((state) => state.onShowLogin);
  const { isConnected } = useAccount();
  const isLogin = useUserStore((state) => state.isLogin);
  const { createOrder, payOrder } = useContract();
  const {
    showQuickOrder,
    orderInfo,
    setShowQuickOrder,
    quickOrderResolver,
  } = useQuickOrderStore(
    useSelector([
      "showQuickOrder",
      "orderInfo",
      "setShowQuickOrder",
      "quickOrderResolver",
    ]),
  );

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

  async function onPay () {
    if (!orderInfo) {
      return;
    }

    if (!isConnected || !isLogin) {
      await onShowLogin();
    }

    try {
      if (orderInfo.status === OrderStatus.InitState) {
        await createOrder(
          orderInfo.id,
          Number(orderInfo.total_price),
          orderInfo.type,
        );
      } else {
        await payOrder(
          orderInfo.id,
          Number(orderInfo.total_price),
          orderInfo.type,
        );
      }

      Toast.show({
        icon: "success",
        content: 'Sell Successfully',
      });

      quickOrderResolver();
      onClose();
    } catch (e) {
      console.log(e);
    }
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
              <div className={Styles["input__item"]}>
                <div className={Styles["input__item-title"]}>Total</div>
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
