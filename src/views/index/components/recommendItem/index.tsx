import React from "react";

import { PageTabType } from "@/components/layout/footer/data";

import useSelector from "@/hooks/useSelector";

import useLayoutStore from "@/store/useLayoutStore";

import { IHotItem } from "@/types";

import Styles from "./index.module.less";
import useMarketStore from "@/store/useMarketStore";

interface RecommendItemCompProps {
  info: IHotItem
}

const RecommendItem: React.FC<RecommendItemCompProps> = ({
  info,
}) => {
  const { id, image, name, payment_name, sell_price, buy_price } = info;
  const { setActiveTab } = useLayoutStore(useSelector("setActiveTab"));
  const { setCurCoinId } = useMarketStore(useSelector("setCurCoinId"));

  const onJumpToMarket = () => {
    setCurCoinId(id);
    setActiveTab(PageTabType.MARKET);
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
