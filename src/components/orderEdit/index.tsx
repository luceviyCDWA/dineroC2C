import React, { useState } from "react";

import RightPage from "../rightPage";

import Styles from './index.module.less';
import { Input } from "antd-mobile";
import { ActionType } from "@/types";
import useChainListStore from "@/store/useChainListStore";
import { createOrder } from "@/api/order";
import useUnlock from "@/hooks/useUnlock";
import { useContractWrite } from "wagmi";
import { DineroAbi } from "@/utils/abi";

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
  const chainList = useChainListStore(state => state.chainList);

  const [actionType, setActionType] = useState<ActionType>(ActionType.Buy);
  const [total, setTotal] = useState('');
  const [totalPrice, setTotalPrice] = useState('');

  const { approve, funcWithContract, USDT_ADDRESS } = useUnlock();

  const { write, isSuccess, isLoading } = useContractWrite({
    abi: DineroAbi,
    address: "0x0cB3f96E74C953610c90F12c7015B5f38102571d",
    functionName: "createOrder",
    args: ["5", Number(totalPrice) * Math.pow(10, 18), actionType],
  });

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
    //   "0x0cB3f96E74C953610c90F12c7015B5f38102571d",
    //   BigInt(Number(totalPrice) * Math.pow(10, 18)),
    // );

    // await funcWithContract(
    //   "0x0cB3f96E74C953610c90F12c7015B5f38102571d",
    //   "createOrder",
    //   ["5", Number(totalPrice) * Math.pow(10, 18), actionType],
    // );
    write();
  }


  return (
    <RightPage show={showPanel} onClose={onClose} title="Publish">
      <div className={Styles["order__publish"]}>
        <div className={Styles["order__publish-header"]}>
          <div className={Styles["tab"]}>
            <div
              className={Styles["tab-item"]}
              onClick={() => setActionType(ActionType.Buy)}
            >
              Buy
            </div>
            <div
              className={Styles["tab-item"]}
              onClick={() => setActionType(ActionType.Sell)}
            >
              Sell
            </div>
          </div>

          {actionType}

          <div className={Styles["rules"]}>Rules</div>
        </div>

        <div className={Styles["order__publish-coin"]}></div>

        <div className={Styles["order__publish-main"]}>
          Total
          <Input type="number" value={total} onChange={(e) => setTotal(e)} />
          Total Price
          <Input
            type="number"
            value={totalPrice}
            onChange={(e) => setTotalPrice(e)}
          />{" "}
          USDT
        </div>

        <div onClick={onPublish}>Publish</div>

        <div>... {isSuccess} {isLoading}</div>
      </div>
    </RightPage>
  );
};
export default OrderEdit;
