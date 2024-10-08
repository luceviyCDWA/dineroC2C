import React from "react";
import { useAccount } from "wagmi";

import useUserStore from "@/store/useUserStore";
import useLoginModalStore from "@/store/useLoginModalStore";

import { GuaranteeStatus, BtnNameByActionType, type IOrderDetail, ActionType } from "@/types";

import GuaranteeIcon from "@/assets/imgs/guarantee.png";

import Styles from "./index.module.less";
import useQuickOrderStore from "@/store/useQuickOrderStore";
import _ from "lodash";

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
  } = marketItemInfo;

  const { isConnected } = useAccount();
  const isLogin = useUserStore((state) => state.isLogin);
  const onShowLogin = useLoginModalStore((state) => state.onShowLogin);
  const getOrderInfoAndShow = useQuickOrderStore(
    (state) => state.getOrderInfoAndShow,
  );

  // 与当前相反
  const realType = type === ActionType.Buy ? ActionType.Sell : ActionType.Buy;

  const onClickTrade = _.debounce(async () => {
    if (!isConnected || !isLogin) {
      await onShowLogin();
    }

    await getOrderInfoAndShow(id);

    onCompleteOrder(id);
  }, 200);

  return (
    <div className={Styles["market__item"]} onClick={onClickTrade}>
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
        <div className={Styles["market-btn"]}>
          {BtnNameByActionType[realType]}
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
