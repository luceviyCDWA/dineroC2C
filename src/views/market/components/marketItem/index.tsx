import React from "react";
import { useAccount } from "wagmi";

import useUserStore from "@/store/useUserStore";
import useLoginModalStore from "@/store/useLoginModalStore";
import useContract from "@/hooks/useContract";

import { GuaranteeStatus, BtnNameByActionType, type IOrderDetail, ActionType, OrderStatus } from "@/types";

import GuaranteeIcon from "@/assets/imgs/guarantee.png";

import Styles from "./index.module.less";

interface MarketItemCompProps {
  marketItemInfo: IOrderDetail;
  onCompleteOrder: (orderId: string) => void;
}

const MarketItem: React.FC<MarketItemCompProps> = ({
  marketItemInfo,
  onCompleteOrder,
}) => {
  const {
    id,
    category_image,
    name,
    is_mortgage,
    type,
    unit_price,
    total_price,
    payment_name,
    status,
  } = marketItemInfo;

  const { isConnected } = useAccount();
  const isLogin = useUserStore((state) => state.isLogin);
  const onShowLogin = useLoginModalStore((state) => state.onShowLogin);
  const { createOrder, payOrder } = useContract();

  const onClickTrade = async () => {
    if (!isConnected || !isLogin) {
      await onShowLogin();
    }

    // 与当前相反
    const realType = type === ActionType.Buy ? ActionType.Sell : ActionType.Buy;

    if (status === OrderStatus.InitState) {
      await createOrder(id, Number(total_price), realType);
    } else {
      await payOrder(id, Number(total_price), realType);
    }

    onCompleteOrder(id);
  };

  return (
    <div className={Styles["market__item"]}>
      <div className={Styles["market__item-info"]}>
        <img className={Styles["coin-icon"]} src={category_image} alt="coin" />
        <div className={Styles["info-main"]}>
          <div className={Styles["name"]}>{name}</div>
          {is_mortgage === GuaranteeStatus.Guaranteed && (
            <div className={Styles["guarantee-info"]}>
              <img
                className={Styles["icon"]}
                src={GuaranteeIcon}
                alt="guaranteeIcon"
              />
              Guarantee deposit
            </div>
          )}
        </div>
        <div className={Styles["market-btn"]} onClick={onClickTrade}>
          {BtnNameByActionType[type]}
        </div>
      </div>

      <div className={Styles["market__item-deal"]}>
        <div className={Styles["deal-item"]}>
          <div className={Styles["title"]}>Unit Price</div>
          <div className={Styles["content"]}>
            {Number(unit_price).toFixed(6)} {payment_name}{" "}
          </div>
        </div>

        <div className={Styles["deal-item"]}>
          <div className={Styles["title"]}>Total Price</div>
          <div className={Styles["content"]}>
            {Number(total_price).toFixed(6)} {payment_name}{" "}
          </div>
        </div>
      </div>
    </div>
  );
};
export default MarketItem;
