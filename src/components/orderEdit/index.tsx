import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { Input } from "antd-mobile";

import usePublicDataStore from "@/store/usePublicDataStore";
import { createOrder } from "@/api/order";
import useUnlock from "@/hooks/useUnlock";

import RightPage from "../rightPage";

import { ActionType, ICoinItem } from "@/types";
import { useContractWrite } from "wagmi";
import { DineroAbi } from "@/utils/abi";

import USDTImg from '@/assets/imgs/example/usdt.png';

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
  const coinList = usePublicDataStore(state => state.coinList);

  const [actionType, setActionType] = useState<ActionType>(ActionType.Buy);
  const [total, setTotal] = useState("");
  const [totalPrice, setTotalPrice] = useState("");
  const [unitPrice, setUnitPrice] = useState('');
  const [curCoinInfo, setCurCoinInfo] = useState<ICoinItem | null>(null);

  const { approve, funcWithContract, USDT_ADDRESS } = useUnlock();

  // const { write, isSuccess, isLoading } = useContractWrite({
  //   abi: DineroAbi,
  //   address:"0x3be0cd01d9801546ebf77e8915f2c10e03c34724",
  //   functionName: "createOrder",
  //   args: ["5", Number(totalPrice) * Math.pow(10, 18), actionType],
  // });

  // const { write, isSuccess, isLoading } = useContractWrite({
  //   abi: DineroAbi,
  //   address:"0x3be0cd01d9801546ebf77e8915f2c10e03c34724",
  //   functionName: "payOrder",
  //   args: ["5", Number(totalPrice) * Math.pow(10, 18), actionType],
  // });

  const { write, isSuccess, isLoading } = useContractWrite({
    abi: DineroAbi,
    address:"0x3be0cd01d9801546ebf77e8915f2c10e03c34724",
    functionName: "cancelOrder",
    args: ["5"],
  });

  useEffect(() => {
    if (coinId && coinList?.length) {
      const coinInfo = coinList.find(coin => coin.id === coinId);

      coinInfo && setCurCoinInfo(coinInfo);
    }
    
  }, [coinId, coinList]);

  useEffect(() => {
    if (total && totalPrice) {
      setUnitPrice((Number(totalPrice) / Number(total)).toFixed(6));
    } else {
      setUnitPrice('');
    }
  }, [total, totalPrice]);

  const onPublish = async () => {
    // const chainInfo = chainList[0];

    // const res = await createOrder({
    //   total_count: Number(total),
    //   total_price: Number(totalPrice),
    //   chain_id: chainInfo.chain_id,
    //   chain_name: chainInfo.name,
    //   contract_address: "0x0cB3f96E74C953610c90F12c7015B5f38102571d",
    //   category_id: coinId,
    //   type: actionType,
    //   payment_name: "USDT",
    // });

    // await approve(
    //   USDT_ADDRESS as `0x${string}`,
    //   "0x3be0cd01d9801546ebf77e8915f2c10e03c34724",
    //   BigInt(Number(totalPrice) * Math.pow(10, 18)),
    // );

    // await funcWithContract(
    //   "0x0cB3f96E74C953610c90F12c7015B5f38102571d",
    //   "createOrder",
    //   ["5", Number(totalPrice) * Math.pow(10, 18), actionType],
    // );
    write();
  };

  return (
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
  );
};
export default OrderEdit;
