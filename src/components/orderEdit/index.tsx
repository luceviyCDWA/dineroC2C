import React from "react";

import RightPage from "../rightPage";

import Styles from './index.module.less';

interface OrderEditCompProps {
  coinId: string;
  showPanel: boolean;
  onClose: () => void;
}

const OrderEdit: React.FC<OrderEditCompProps> = ({
  coinId,
  showPanel,
  onClose,
}) => {
  return (
    <RightPage show={showPanel} onClose={onClose} title="Publish">
      <div className={Styles["order__publish"]}>
        <div className={Styles["order__publish-header"]}>
          <div className={Styles["tab"]}>
            <div className={Styles["tab-item"]}>Buy</div>
            <div className={Styles["tab-item"]}>Sell</div>
          </div>

          <div className={Styles['rules']}>Rules</div>
        </div>

        <div className={Styles['order__publish-coin']}>
          
        </div>
      </div>
    </RightPage>
  );
};
export default OrderEdit;
