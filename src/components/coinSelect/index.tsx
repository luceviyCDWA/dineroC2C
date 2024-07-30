import React, { useState } from "react";
import { Popup } from "antd-mobile";
import { DownOutline } from "antd-mobile-icons";

import { ICoinInfo } from "@/views/market/components/coinItem/types";

import Styles from "./index.module.less";


interface CoinSelectCompProps {
  curCoinInfo?: ICoinInfo;
  coinList: ICoinInfo[];
  onSelectCoin: (coinId: string) => void;
}

const CoinSelect: React.FC<CoinSelectCompProps> = ({
  curCoinInfo,
}) => {
  const [showPopup, setShowPopup] = useState(false);

  const onHidePopup = () => {
    setShowPopup(false);
  }

  return (
    <div className={Styles["coin__select"]}>
      <div className={Styles["coin__select-cur"]} onClick={() => setShowPopup(true)}>
        <div className={Styles["coin-info"]}>
          {curCoinInfo && (
            <>
              <img className={Styles["coin-icon"]} src={curCoinInfo.icon} />
              <div className={Styles["coin-name"]}>{curCoinInfo.name}</div>
            </>
          )}
        </div>
        <DownOutline />
      </div>

      <Popup
        visible={showPopup}
        onMaskClick={onHidePopup}
        bodyStyle={{
          borderTopLeftRadius: "15px",
          borderTopRightRadius: "15px",
          background: "#15161B",
          minHeight: "50vh",
        }}
      >
        123
      </Popup>
    </div>
  );
}
export default CoinSelect;
