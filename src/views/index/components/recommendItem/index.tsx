import React from "react";

import { IHotItem } from "@/types";

import Styles from './index.module.less';

interface RecommendItemCompProps {
  info: IHotItem
}

const RecommendItem: React.FC<RecommendItemCompProps> = ({
  info,
}) => {
  const { image, name, payment_name, sell_price, buy_price } = info;

  return (
    <div className={Styles["recommend__item"]}>
      <img className={Styles["icon"]} src={image} />
      <span className={Styles["name"]}>{name}</span>
      <div className={Styles["detail"]}>
        <span>
          Buy:{buy_price} {payment_name}
        </span>
        <span>
          Sell:{sell_price} {payment_name}
        </span>
      </div>
    </div>
  );
}
export default RecommendItem;
