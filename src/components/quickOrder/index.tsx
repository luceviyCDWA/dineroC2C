import React from "react";
import classNames from "classnames";

import RightPage from "../rightPage";

import useSelector from "@/hooks/useSelector";
import useQuickOrderStore from "@/store/useQuickOrderStore";

import USDTImg from "@/assets/imgs/example/usdt.png";

import { ActionType, BtnNameByActionType } from "@/types";

import Styles from "./index.module.less";

const QuickOrder: React.FC = () => {
  const {
    showQuickOrder,
    orderInfo,
    setShowQuickOrder
  } = useQuickOrderStore(useSelector(['showQuickOrder', 'orderInfo', 'setShowQuickOrder']));

  function onClose () {
    setShowQuickOrder(false);
  }

  function onPay () {

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
                  {orderInfo.total_price}
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
