import React from "react";

import { IHotItem } from "@/types";

import Styles from './index.module.less';
import { useNavigate } from "react-router-dom";

interface RecommendItemCompProps {
  info: IHotItem
}

const RecommendItem: React.FC<RecommendItemCompProps> = ({
  info,
}) => {
  const { id, image, name, payment_name, sell_price, buy_price } = info;

  const navigator = useNavigate();

  const onJumpToMarket = () => {
    navigator("/market", { state: { curCoidId: id } });
  }

  return (
    <div className={Styles["recommend__item"]} onClick={onJumpToMarket}>
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
