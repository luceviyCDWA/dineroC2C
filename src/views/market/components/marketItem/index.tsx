import React from "react";

import GuaranteeIcon from '@/assets/imgs/guarantee.png';

import { IMarketItem } from "./types";

import Styles from './index.module.less';
import { BtnNameByActionType } from "@/types";

interface MarketItemCompProps {
  marketItemInfo: IMarketItem
}

const MarketItem: React.FC<MarketItemCompProps> = ({
  marketItemInfo
}) => {
  const { coinIcon, name, hasGuarantee, marketType, unitPrice, totalPrice, currencyName } = marketItemInfo;
  return (
    <div className={Styles["market__item"]}>
      <div className={Styles["market__item-info"]}>
        <img className={Styles["coin-icon"]} src={coinIcon} alt="coin" />
        <div className={Styles["info-main"]}>
          <div className={Styles["name"]}>{name}</div>
          {hasGuarantee && (
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
          {BtnNameByActionType[marketType]}
        </div>
      </div>

      <div className={Styles["market__item-deal"]}>
        <div className={Styles["deal-item"]}>
          <div className={Styles["title"]}>Unit Price</div>
          <div className={Styles["content"]}>
            {unitPrice} {currencyName}
          </div>
        </div>

        <div className={Styles["deal-item"]}>
          <div className={Styles["title"]}>Total Price</div>
          <div className={Styles["content"]}>
            {totalPrice} {currencyName}
          </div>
        </div>
      </div>
    </div>
  );
}
export default MarketItem;
