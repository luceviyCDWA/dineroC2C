import React from "react";

import { ICoinInfo } from "./types";

import Styles from './index.module.less';

interface CoinItemCompProps {
  coinInfo: ICoinInfo
}

const CoinItem: React.FC<CoinItemCompProps> = ({
  coinInfo
}) => {
  return (
    <div className={Styles["coin__info"]}>
      <img
        className={Styles["coin__info-icon"]}
        src={coinInfo.icon}
        alt="coin"
      />
      <div className={Styles["coin__info-main"]}>
        <div className={Styles["coin__info-name"]}>{coinInfo.name}</div>
        <div className={Styles["coin__info-detail"]}>
          {coinInfo.detailIcon.map((detailIcon) => (
            <img
              key={detailIcon}
              className={Styles["detail-icon"]}
              src={detailIcon}
              alt="detailIcon"
            />
          ))}
        </div>
      </div>
      <div className={Styles["coin__info-rules"]}>Rules</div>
    </div>
  );
}
export default CoinItem;
