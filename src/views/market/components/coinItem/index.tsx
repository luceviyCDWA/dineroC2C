import React from "react";

import DetailIcon1 from "@/assets/imgs/detail-1.png";
import DetailIcon2 from "@/assets/imgs/detail-2.png";
import DetailIcon3 from "@/assets/imgs/detail-3.png";
import DetailIcon4 from "@/assets/imgs/detail-4.png";
import DetailIcon5 from "@/assets/imgs/detail-5.png";

import { type ICoinItem } from "@/types";

import Styles from './index.module.less';

const ICON_LIST = [
  {
    icon: DetailIcon1,
    name: "rpc",
  },
  {
    icon: DetailIcon2,
    name: "website",
  },
  {
    icon: DetailIcon3,
    name: "twitter",
  },
  {
    icon: DetailIcon4,
    name: "telegram",
  },
  {
    icon: DetailIcon5,
    name: "discord",
  },
] as const;

interface CoinItemCompProps {
  coinInfo: ICoinItem
}

const CoinItem: React.FC<CoinItemCompProps> = ({
  coinInfo
}) => {
  const onClickIcon = (
    iconName: "rpc" | "website" | "twitter" | "telegram" | "discord",
  ) => {
    const url = coinInfo[iconName];

    if (url) {
      window.open(url);
    }
  };

  return (
    <div className={Styles["coin__info"]}>
      <img
        className={Styles["coin__info-icon"]}
        src={coinInfo.image}
        alt="coin"
      />
      <div className={Styles["coin__info-main"]}>
        <div className={Styles["coin__info-name"]}>{coinInfo.name}</div>
        <div className={Styles["coin__info-detail"]}>
          {ICON_LIST.map((icon) => (
            <img
              key={icon.name}
              className={Styles["detail-icon"]}
              src={icon.icon}
              alt="detailIcon"
              onClick={() => onClickIcon(icon.name)}
            />
          ))}
        </div>
      </div>
      <div className={Styles["coin__info-rules"]}>Rules</div>
    </div>
  );
}
export default CoinItem;
