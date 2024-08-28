import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { Input, Toast } from "antd-mobile";
import copy from "copy-to-clipboard";

import usePublicDataStore from "@/store/usePublicDataStore";
import { createOrder } from "@/api/order";
import useContract, { CONTRACT_ADDRESS } from "@/hooks/useContract";
import CoinSelect from "../coinSelect";

import RightPage from "../rightPage";

import { ActionType, ICoinItem } from "@/types";

import USDTImg from '@/assets/imgs/example/usdt.png';
import TitleImg from '@/assets/imgs/mask.png';

import Styles from "./index.module.less";
import website from "@/config/website";

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
  const { chainList, coinList } = usePublicDataStore((state) => ({
    chainList: state.chainList,
    coinList: state.coinList,
  }));

  // 订单参数
  const [curCoinInfo, setCurCoinInfo] = useState<ICoinItem>();
  const [actionType, setActionType] = useState<ActionType>(ActionType.Buy);
  const [total, setTotal] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [unitPrice, setUnitPrice] = useState('');

  const [orderId, setOrderId] = useState('');

  const {
    createOrder: createOrderByContract,
  } = useContract(orderId);

  useEffect(() => {
    if (!showPanel) {
      setActionType(ActionType.Buy);
      setTotal("");
      setTotalPrice("");
      setOrderId("");
      setCurCoinInfo(undefined);
    } else {
      setCurCoinInfo(coinList.find((target) => target.id === coinId));
    }
  }, [showPanel, coinId, coinList]);

  useEffect(() => {
    if (total && totalPrice) {
      setUnitPrice((Number(totalPrice) / Number(total)).toFixed(6));
    } else {
      setUnitPrice('');
    }
  }, [total, totalPrice]);

  const onPublish = async () => {
    const chainInfo = chainList[0];

    if (!curCoinInfo) {
      return Toast.show('Please select category first');
    }

    const { order_id } = await createOrder({
      total_count: Number(total),
      total_price: Number(totalPrice),
      chain_id: chainInfo.chain_id,
      chain_name: chainInfo.name,
      contract_address: CONTRACT_ADDRESS,
      category_id: curCoinInfo?.id,
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
    await createOrderByContract(Number(totalPrice), actionType);
    onClose();
  }

  const onShareOrder = () => {
    if (!orderId) {
      return;
    }

    copy(`${website.hostUrl}?quickOrderId=${orderId}`);

    Toast.show({
      icon: 'success',
      content: 'share url was copied!'
    });
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

          <div className={Styles["order__publish-coin"]}>
            <CoinSelect
              curCoinInfo={curCoinInfo}
              onSelectCoin={setCurCoinInfo}
            />
          </div>

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
                  <span className={Styles["placeholder"]}>0.00USDT</span>
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

            <span
              className={`${Styles["btn"]} ${Styles["btn-txt"]}`}
              onClick={onShareOrder}
            >
              <span className={Styles["content"]}>Share</span>
            </span>
          </div>
        </div>
      </RightPage>
    </>
  );
};
export default OrderEdit;
