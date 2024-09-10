import React from "react";
import classNames from "classnames";

import RightPage from "@/components/rightPage";

import {
  ActionType,
  IContractInfo,
  IOrderDetail,
  OrderStatus,
  OrderStatusTitleHash,
} from "@/types";

import Styles from './index.module.less';
import useContract from "@/hooks/useContract";
import { Toast } from "antd-mobile";
import website from "@/config/website";
import copy from "copy-to-clipboard";
import useLoginModalStore from "@/store/useLoginModalStore";
import { useAccount } from "wagmi";
import useUserStore from "@/store/useUserStore";
import _ from "lodash";
import useSelector from "@/hooks/useSelector";

interface MessageDetailCompProps {
  showPanel: boolean;
  msgDetail: IOrderDetail;
  contractInfo?: IContractInfo;
  onClose: () => void;
}

const MessageDetail: React.FC<MessageDetailCompProps> = ({
  showPanel,
  msgDetail,
  contractInfo,
  onClose,
}) => {
  const {
    id,
    order_onchain_id,
    category_image,
    category_name,
    total_count,
    total_price,
    unit_price,
    payment_name,
    status,
    seller,
    is_mortgage,
  } = msgDetail;
  const { createOrder, payOrder, cancelOrder, confirmOrder } = useContract(id, order_onchain_id);

  const onShowLogin = useLoginModalStore((state) => state.onShowLogin);
  const { isConnected } = useAccount();
  const { isLogin, userInfo } = useUserStore(useSelector(["isLogin", "userInfo"]));
  const userId = userInfo?.id;
  const type = userId === seller ? ActionType.Sell : ActionType.Buy;

  const checkLogin = async () => {
    if (!isConnected || !isLogin) {
      await onShowLogin();
    }
  }

  const onCreateOrder = _.debounce(async () => {
    await checkLogin();
    await createOrder(Number(total_price), type);
    onClose();
  }, 200);

  const onPayOrder = _.debounce(async () => {
    await checkLogin();
    await payOrder(Number(total_price), type);
    onClose();
  }, 200);

  const onCancelOrder = _.debounce(async () => {
    await checkLogin();
    await cancelOrder(type);
    onClose();
  }, 200);

  const onConfirmOrder = _.debounce(async () => {
    await checkLogin();
    await confirmOrder(order_onchain_id, type);
    onClose();
  }, 200);

  const onJumpAppeal = () => {
    location.href = "https://t.me/DineroSupporter";
  }

  const onShareOrder = () => {
    if (!id) {
      return;
    }

    copy(`${website.hostUrl}?quickOrderId=${id}`);

    Toast.show({
      icon: "success",
      content: "share url was copied!",
    });
  };

  function onCopy(content: string) {
    if (!content) {
      return;
    }

    copy(content);

    Toast.show({
      icon: "success",
      content: "opied!",
    });
  }

  return (
    <RightPage
      show={showPanel}
      title="Order Detail"
      rightBtnNode={
        <div className={Styles["btns"]} onClick={onJumpAppeal}>
          Appeal
        </div>
      }
      onClose={onClose}
    >
      <div className={Styles["detail__panel-main"]}>
        <div className={Styles["coin__detail"]}>
          <img
            className={Styles["coin__detail-icon"]}
            src={category_image}
            alt="coin"
          />

          <div className={Styles["coin__detail-main"]}>
            <div className={Styles["coin__detail-title"]}>{category_name}</div>
            <div className={Styles["coin__detail-type"]}>
              <span
                className={classNames({
                  [Styles["active"]]: type === ActionType.Buy,
                })}
              >
                Buy
              </span>
              /
              <span
                className={classNames({
                  [Styles["active"]]: type === ActionType.Sell,
                })}
              >
                Sell
              </span>
            </div>
          </div>

          <div className={Styles["coin__detail-rule"]}>Rules</div>
        </div>

        <div className={Styles["message-main"]}>
          <div className={Styles["main-container"]}>
            <div className={Styles["detail__item"]}>
              <div className={Styles["detail__item-title"]}>Total Count</div>
              <div className={Styles["detail__item-content"]}>
                {total_count}
              </div>
            </div>

            <div className={Styles["detail__item"]}>
              <div className={Styles["detail__item-title"]}>Total Price</div>
              <div className={Styles["detail__item-content"]}>
                {total_price} {payment_name}
              </div>
            </div>

            <div className={Styles["detail__item"]}>
              <div className={Styles["detail__item-title"]}>Unit price</div>
              <div className={Styles["detail__item-content"]}>
                {unit_price} {payment_name}
              </div>
            </div>

            <div className={Styles["detail__item"]}>
              <div className={Styles["detail__item-title"]}>Status</div>
              <div className={Styles["detail__item-content"]}>
                {OrderStatusTitleHash[status]}
              </div>
            </div>

            <div className={Styles["detail__item"]}>
              <div className={Styles["detail__item-title"]}>
                Guarantee deposit
              </div>
              <div className={Styles["detail__item-content"]}>
                {is_mortgage ? "Paid" : "Pending"}
              </div>
            </div>

            {contractInfo?.telegram ? (
              <div
                className={Styles["detail__item"]}
                onClick={() => onCopy(contractInfo.telegram || "")}
              >
                <div className={Styles["detail__item-title"]}>Telegram</div>
                <div className={Styles["detail__item-content"]}>
                  {contractInfo.telegram || ""}
                </div>
              </div>
            ) : null}

            {contractInfo?.discord ? (
              <div
                className={Styles["detail__item"]}
                onClick={() => onCopy(contractInfo.discord || "")}
              >
                <div className={Styles["detail__item-title"]}>Discord</div>
                <div className={Styles["detail__item-content"]}>
                  {contractInfo.discord || ""}
                </div>
              </div>
            ) : null}

            {contractInfo?.whatsapp ? (
              <div
                className={Styles["detail__item"]}
                onClick={() => onCopy(contractInfo.whatsapp || "")}
              >
                <div className={Styles["detail__item-title"]}>WhatsApp</div>
                <div className={Styles["detail__item-content"]}>
                  {contractInfo.whatsapp || ""}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {status === OrderStatus.InitState && (
        // createOrder
        <div className={Styles["detail__panel-btn"]}>
          <div className={Styles["btn"]} onClick={onCreateOrder}>
            Go to pay
          </div>
          <div
            className={`${Styles["btn"]} ${Styles["btn-txt"]}`}
            onClick={onShareOrder}
          >
            <span className={Styles["content"]}>Share</span>
          </div>
        </div>
      )}

      {status === OrderStatus.WaitForBuyer &&
        (type === ActionType.Buy ? (
          // payOrder
          <div className={Styles["detail__panel-btn"]}>
            <div className={Styles["btn"]} onClick={onPayOrder}>
              Go to pay
            </div>
            <div
              className={`${Styles["btn"]} ${Styles["btn-txt"]}`}
              onClick={onShareOrder}
            >
              <span className={Styles["content"]}>Share</span>
            </div>
          </div>
        ) : (
          <div className={Styles["detail__panel-btn"]}>
            <div className={Styles["btn"]} onClick={onCancelOrder}>
              Cancel
            </div>
            <div
              className={`${Styles["btn"]} ${Styles["btn-txt"]}`}
              onClick={onShareOrder}
            >
              <span className={Styles["content"]}>Share</span>
            </div>
          </div>
        ))}

      {status === OrderStatus.WaitForSeller &&
        (type === ActionType.Sell ? (
          // payOrder
          <div className={Styles["detail__panel-btn"]}>
            <div className={Styles["btn"]} onClick={onPayOrder}>
              Go to pay
            </div>
            <div
              className={`${Styles["btn"]} ${Styles["btn-txt"]}`}
              onClick={onShareOrder}
            >
              <span className={Styles["content"]}>Share</span>
            </div>
          </div>
        ) : (
          <div className={Styles["detail__panel-btn"]}>
            <div className={Styles["btn"]} onClick={onCancelOrder}>
              Cancel
            </div>
            <div
              className={`${Styles["btn"]} ${Styles["btn-txt"]}`}
              onClick={onShareOrder}
            >
              <span className={Styles["content"]}>Share</span>
            </div>
          </div>
        ))}

      {status === OrderStatus.BothPaid &&
        (type === ActionType.Buy ? (
          // payOrder
          <div className={Styles["detail__panel-btn"]} onClick={onConfirmOrder}>
            <div className={Styles["btn"]}>Confirm</div>
          </div>
        ) : (
          <div className={Styles["detail__panel-btn"]} onClick={onCancelOrder}>
            <div className={Styles["btn"]}>Cancel</div>
          </div>
        ))}

      {status === OrderStatus.CancelWithBuyer && type === ActionType.Sell && (
        <div className={Styles["detail__panel-btn"]} onClick={onCancelOrder}>
          <div className={Styles["btn"]}>Cancel</div>
        </div>
      )}

      {status === OrderStatus.CancelWithSeller && type === ActionType.Buy && (
        <div className={Styles["detail__panel-btn"]} onClick={onCancelOrder}>
          <div className={Styles["btn"]}>Cancel</div>
        </div>
      )}

      {status === OrderStatus.Withdrawal && type === ActionType.Sell && (
        <div className={Styles["detail__panel-btn"]} onClick={onConfirmOrder}>
          <div className={Styles["btn"]}>Confirm</div>
        </div>
      )}
    </RightPage>
  );
};
export default MessageDetail;
