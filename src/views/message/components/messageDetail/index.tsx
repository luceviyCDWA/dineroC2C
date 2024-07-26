import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { LeftOutline } from 'antd-mobile-icons';

import TipsIcon from '@/assets/imgs/tips.png';

import {
  ActionType,
  DealerByActionType,
  IMessageDetail,
  OrderStatusTxtHash,
} from "@/views/message/types";

import Styles from './index.module.less';
import { getTimeStrBySec } from "@/utils";

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

  const [innerShow, setInnerShow] = useState(false);
  const [leftTime, setLeftTime] = useState(0);

  useEffect(() => {
    if (showPanel) {
      setInnerShow(true);
    }
  }, [showPanel]);

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

  const onTransEnd = () => {
    if (!innerShow) {
      onClose();
    }
  };

  const onBack = () => {
    setInnerShow(false);
  }

  return (
    <div
      className={classNames(Styles["detail__panel"], {
        [Styles["show"]]: innerShow,
      })}
      onTransitionEnd={onTransEnd}
    >
      <div className={Styles["detail__panel-header"]}>
        <div className={Styles["back"]} onClick={onBack}>
          <LeftOutline />
        </div>
        <div className={Styles["title"]}>Order Detail</div>
        <div className={Styles["btns"]}>Appeal</div>
      </div>

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
            {OrderStatusTxtHash[status]}
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
              <span className={Styles['left-time']}>{getTimeStrBySec(leftTime)}s</span>
            </div>
          </div>
        )}
      </div>

      {
        leftTime > 0 && (
          <div className={Styles['detail__panel-btn']}>
            <div className={Styles['btn']}>
              Go to pay
            </div>
          </div>
        )
      }
    </div>
  );
};
export default MessageDetail;
