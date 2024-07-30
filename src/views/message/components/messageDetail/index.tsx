import React, { useEffect, useState } from "react";
import classNames from "classnames";

import { getTimeStrBySec } from "@/utils";
import RightPage from "@/components/rightPage";

import TipsIcon from '@/assets/imgs/tips.png';

import { ActionType, DealerByActionType, OrderStatus, OrderStatusTitleHash } from "@/types";
import {
  IMessageDetail,
} from "@/views/message/types";

import Styles from './index.module.less';

interface MessageDetailCompProps {
  showPanel: boolean;
  msgDetail: IMessageDetail,
  onClose: () => void;
}

const MessageDetail: React.FC<MessageDetailCompProps> = ({
  showPanel,
  msgDetail,
  onClose,
}) => {
  const {
    coinIcon,
    coinName,
    actionType,
    total,
    totalPrice,
    unitPrice,
    currencyName,
    status,
    guaranteeDeposit,
    deadline,
  } = msgDetail;

  const [leftTime, setLeftTime] = useState(0);

  useEffect(() => {
    setLeftTime(deadline);
  }, [deadline]);

  useEffect(() => {
    if (leftTime > 0) {
      setTimeout(() => {
        setLeftTime(leftTime - 1);
      }, 1000);
    }
  }, [leftTime]);


  return (
    <RightPage
      show={showPanel}
      title="Order Detail"
      rightBtnNode={<div className={Styles["btns"]}>Appeal</div>}
      onClose={onClose}
    >
      <div className={Styles["detail__panel-main"]}>
        <div className={Styles["coin__detail"]}>
          <img
            className={Styles["coin__detail-icon"]}
            src={coinIcon}
            alt="coin"
          />

          <div className={Styles["coin__detail-main"]}>
            <div className={Styles["coin__detail-title"]}>{coinName}</div>
            <div className={Styles["coin__detail-type"]}>
              <span
                className={classNames({
                  [Styles["active"]]: actionType === ActionType.Buy,
                })}
              >
                Buy
              </span>
              /
              <span
                className={classNames({
                  [Styles["active"]]: actionType === ActionType.Sell,
                })}
              >
                Sell
              </span>
            </div>
          </div>

          <div className={Styles["coin__detail-rule"]}>Rules</div>
        </div>

        <div className={Styles["detail__item"]}>
          <div className={Styles["detail__item-title"]}>Total</div>
          <div className={Styles["detail__item-content"]}>{total}</div>
        </div>

        <div className={Styles["detail__item"]}>
          <div className={Styles["detail__item-title"]}>Total Price</div>
          <div className={Styles["detail__item-content"]}>
            {totalPrice} {currencyName}
          </div>
        </div>

        <div className={Styles["detail__item"]}>
          <div className={Styles["detail__item-title"]}>Unit price</div>
          <div className={Styles["detail__item-content"]}>
            {unitPrice} {currencyName}
          </div>
        </div>

        <div className={Styles["detail__item"]}>
          <div className={Styles["detail__item-title"]}>Status</div>
          <div className={Styles["detail__item-content"]}>
            {OrderStatusTitleHash[status]}
          </div>
        </div>

        <div className={Styles["detail__item"]}>
          <div className={Styles["detail__item-title"]}>Guarantee deposit</div>
          <div className={Styles["detail__item-content"]}>
            {guaranteeDeposit}
          </div>
        </div>

        {leftTime > 0 && (
          <div className={Styles["tips"]}>
            <div className={Styles["tips-icon"]}>
              <img className={Styles["icon"]} src={TipsIcon} alt="tips" />
            </div>

            <div className={Styles["tips-content"]}>
              The {DealerByActionType[actionType]} has made the payment. Please
              pay the deposit within{" "}
              <span className={Styles["left-time"]}>
                {getTimeStrBySec(leftTime)}s
              </span>
            </div>
          </div>
        )}
      </div>

      {status === OrderStatus.InitState && (
        // createOrder
        <div className={Styles["detail__panel-btn"]}>
          <div className={Styles["btn"]}>Go to pay</div>
        </div>
      )}

      {status === OrderStatus.WaitForBuyer &&
        (actionType === ActionType.Buy ? (
          // payOrder
          <div className={Styles["detail__panel-btn"]}>
            <div className={Styles["btn"]}>Go to pay</div>
          </div>
        ) : (
          <div className={Styles["detail__panel-btn"]}>
            <div className={Styles["btn"]}>Cancel</div>
          </div>
        ))}

      {status === OrderStatus.WaitForSeller &&
        (actionType === ActionType.Sell ? (
          // payOrder
          <div className={Styles["detail__panel-btn"]}>
            <div className={Styles["btn"]}>Go to pay</div>
          </div>
        ) : (
          <div className={Styles["detail__panel-btn"]}>
            <div className={Styles["btn"]}>Cancel</div>
          </div>
        ))}

      {status === OrderStatus.BothPaid &&
        (actionType === ActionType.Buy ? (
          // payOrder
          <div className={Styles["detail__panel-btn"]}>
            <div className={Styles["btn"]}>Confirm</div>
          </div>
        ) : (
          <div className={Styles["detail__panel-btn"]}>
            <div className={Styles["btn"]}>Cancel</div>
          </div>
        ))}

      {status === OrderStatus.CancelWithBuyer &&
        actionType === ActionType.Sell && (
          // payOrder
          <div className={Styles["detail__panel-btn"]}>
            <div className={Styles["btn"]}>Cancel</div>
          </div>
        )}

      {status === OrderStatus.CancelWithSeller &&
        actionType === ActionType.Buy && (
          // payOrder
          <div className={Styles["detail__panel-btn"]}>
            <div className={Styles["btn"]}>Cancel</div>
          </div>
        )}

      {status === OrderStatus.Withdrawal &&
        actionType === ActionType.Sell && (
          // payOrder
          <div className={Styles["detail__panel-btn"]}>
            <div className={Styles["btn"]}>Confirm</div>
          </div>
        )}
    </RightPage>
  );
};
export default MessageDetail;
