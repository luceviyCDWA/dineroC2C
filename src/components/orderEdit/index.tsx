import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { Input } from "antd-mobile";

import usePublicDataStore from "@/store/usePublicDataStore";
import { createOrder } from "@/api/order";
import useContract from "@/hooks/useContract";

import RightPage from "../rightPage";

import { ActionType } from "@/types";

import USDTImg from '@/assets/imgs/example/usdt.png';
import TitleImg from '@/assets/imgs/mask.png';

import Styles from "./index.module.less";

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
  const chainList = usePublicDataStore(state => state.chainList);

  // 订单参数
  const [actionType, setActionType] = useState<ActionType>(ActionType.Buy);
  const [total, setTotal] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [unitPrice, setUnitPrice] = useState('');

  const [orderId, setOrderId] = useState('');

  const {
    createOrder: createOrderByContract,
    CONTRACT_ADDRESS,
  } = useContract();

  useEffect(() => {
    setActionType(ActionType.Buy);
    setTotal('');
    setTotalPrice('');
    setOrderId('');
  }, [showPanel]);

  useEffect(() => {
    if (total && totalPrice) {
      setUnitPrice((Number(totalPrice) / Number(total)).toFixed(6));
    } else {
      setUnitPrice('');
    }
  }, [total, totalPrice]);

  const onPublish = async () => {
    const chainInfo = chainList[0];

    const { order_id } = await createOrder({
      total_count: Number(total),
      total_price: Number(totalPrice),
      chain_id: chainInfo.chain_id,
      chain_name: chainInfo.name,
      contract_address: CONTRACT_ADDRESS,
      category_id: coinId,
      type: actionType,
      payment_name: "USDT",
    });

    setOrderId(order_id);
  };

  const onClosePayGuarantee = () => {
    setOrderId("");
    onClose();
  }

  const onPayGuarantee = async () => {
    await createOrderByContract(orderId, Number(totalPrice), actionType);
    onClose();
  }

  return (
    <>
      <RightPage show={showPanel} onClose={onClose} title="Publish">
        <div className={Styles["order__publish"]}>
          <div className={Styles["order__publish-header"]}>
            <div className={Styles["tabs"]}>
              <div
                className={classNames(Styles["tab-item"], {
                  [Styles["active"]]: actionType === ActionType.Buy,
                })}
                onClick={() => setActionType(ActionType.Buy)}
              >
                Buy
              </div>
              <div
                className={classNames(Styles["tab-item"], {
                  [Styles["active"]]: actionType === ActionType.Sell,
                })}
                onClick={() => setActionType(ActionType.Sell)}
              >
                Sell
              </div>
            </div>

            <div className={Styles["rules"]}>Rules</div>
          </div>

          <div className={Styles["order__publish-coin"]}></div>

          <div className={Styles["order__publish-main"]}>
            <div className={Styles["input__item"]}>
              <div className={Styles["input__item-title"]}>Total</div>
              <div className={Styles["input__item-input"]}>
                <Input
                  type="number"
                  value={total}
                  placeholder="Please enter"
                  onChange={(e) => setTotal(e)}
                />
              </div>
            </div>

            <div className={Styles["input__item"]}>
              <div className={Styles["input__item-title"]}>Total Price</div>
              <div className={Styles["input__item-input"]}>
                <Input
                  type="number"
                  value={totalPrice}
                  placeholder="Please enter"
                  onChange={(e) => setTotalPrice(e)}
                />
                <img className={Styles["currency-icon"]} src={USDTImg} />
                <span className={Styles["currency-name"]}>USDT</span>
              </div>
            </div>

            <div className={Styles["input__item"]}>
              <div className={Styles["input__item-title"]}>Unit Price</div>
              <div className={Styles["input__item-input"]}>
                {unitPrice ? (
                  <span className={Styles["unit-price"]}>{unitPrice} USDT</span>
                ) : (
                  <span className={Styles["placeholder"]}>Please Enter</span>
                )}
              </div>
            </div>
          </div>

          <div className={Styles["publish-btn"]} onClick={onPublish}>
            <div className={Styles["btn"]}>Publish</div>
          </div>
        </div>
      </RightPage>

      <RightPage show={!!orderId} onClose={onClosePayGuarantee} title="Publish">
        <div className={Styles["success-page"]}>
          <div className={Styles["page-title"]}>
            <img className={Styles["icon"]} src={TitleImg} alt="title" />
            <div className={Styles["title"]}>Publish</div>
            <div className={Styles["title"]}>Successfully!</div>
          </div>

          <div className={Styles["content-2"]}>
            By paying a deposit now, your transaction success rate can increase
            by 500%!
          </div>

          <div className={Styles["content-3"]}>
            A decentralized contract will ensure the security of your funds.
          </div>
          <div className={Styles["content-3"]}>
            The deposit will be stored in a smart contract, which cannot be
            misappropriated by anyone.
          </div>
          <div className={Styles["content-3"]}>
            Funds can be retrieved in real-time from the smart contract (in the
            event of no transaction).
          </div>

          <div className={Styles["share-btn"]}>
            <span className={Styles["btn"]} onClick={onPayGuarantee}>
              Pay
            </span>
          </div>
        </div>
      </RightPage>
    </>
  );
};
export default OrderEdit;
