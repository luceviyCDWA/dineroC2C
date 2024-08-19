import React, { useState } from "react";
import { Popup } from "antd-mobile";

import { ICoinItem } from "@/types";

import ArrowIcon from "@/assets/imgs/arrow.png";

import Styles from "./index.module.less";
import usePublicDataStore from "@/store/usePublicDataStore";

interface CoinSelectCompProps {
  curCoinInfo?: ICoinItem;
  onSelectCoin: (coinInfo: ICoinItem) => void;
}

const CoinSelect: React.FC<CoinSelectCompProps> = ({
  curCoinInfo,
  onSelectCoin,
}) => {
  const { coinList } = usePublicDataStore((state) => ({
    coinList: state.coinList,
  }));

  const [showPopup, setShowPopup] = useState(false);

  const onHidePopup = () => {
    setShowPopup(false);
  };

  const onSelect = (coinInfo: ICoinItem) => {
    setShowPopup(false);

    if (coinInfo.id !== curCoinInfo?.id) {
      onSelectCoin(coinInfo);
    }
  };

  return (
    <div className={Styles["coin__select"]}>
      <div
        className={Styles["coin__select-cur"]}
        onClick={() => setShowPopup(true)}
      >
        <div className={Styles["coin-info"]}>
          {curCoinInfo && (
            <>
              <img className={Styles["coin-icon"]} src={curCoinInfo.image} />
              <div className={Styles["coin-name"]}>{curCoinInfo.name}</div>
            </>
          )}
        </div>
        <img className={Styles["arrow"]} src={ArrowIcon} />
      </div>

      <Popup
        visible={showPopup}
        onMaskClick={onHidePopup}
        bodyStyle={{
          height: "60vh",
          background: "#15161B",
          borderRadius: "15px 15px 0px 0px",
        }}
      >
        <div className={Styles["coin__list"]}>
          <div className={Styles["coin__list-prefix"]}></div>

          <div className={Styles["list-container"]}>
            {coinList.map((coin) => (
              <div
                className={Styles["coin-item"]}
                key={coin.id}
                onClick={() => onSelect(coin)}
              >
                <img className={Styles["icon"]} src={coin.image} />
                {coin.name}
              </div>
            ))}
          </div>
        </div>
      </Popup>
    </div>
  );
};
export default CoinSelect;
