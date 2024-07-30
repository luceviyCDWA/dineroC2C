import React, { useCallback, useState } from "react";
import { InfiniteScroll, PullToRefresh } from "antd-mobile";

import useMsgStore from "@/store/useMsgStore";
import MessageItem from "./components/messageItem";
import MessageDetail from "./components/messageDetail";

import CoinIcon from '@/assets/imgs/example/coin.png';

import { ActionType } from "@/types";
import { IMessageDetail, OrderStatus } from "./types";

import Styles from "./index.module.less";

const Message: React.FC = () => {
  const {
    msgList,
    page,
    totalPage,
    getNextPageData,
    resetData,
  } = useMsgStore(state => ({
    msgList: state.msgList,
    page: state.page,
    totalPage: state.totalPage,
    getNextPageData: state.getNextPageData,
    resetData: state.resetData
  }));

  const [showDetail, setShowDetail] = useState(false);
  const [curMsgDetail, setCurMsgDetail] = useState<IMessageDetail | null>(null);

  const onLoadMore = async () => {
    await getNextPageData();
  }

  const onSelectDetail = useCallback((selectId: string) => {
    debugger;
    
    setShowDetail(true);
    setCurMsgDetail({
      id: selectId,

      coinName: "SEND",
      coinIcon: CoinIcon,

      total: 10000,
      totalPrice: "200",
      unitPrice: "0.00192",
      currencyName: "USDT",
      actionType: ActionType.Buy,

      status: OrderStatus.Pending,
      guaranteeDeposit: "Pending",

      deadline: 1000,
    });
  }, []);

  const onDetailClose = useCallback(() => {
    setShowDetail(false);
  }, []);

  return (
    <>
      <PullToRefresh
        canReleaseText="Release to refresh"
        completeText="Refresh successful"
        pullingText="Pull to refresh"
        refreshingText="Loading..."
        onRefresh={async () => {
          await resetData();
        }}
      >
        <div className={Styles["message-wrapper"]}>
          {msgList.map((msgInfo) => (
            <MessageItem
              key={msgInfo.id}
              msgInfo={msgInfo}
              onSelect={onSelectDetail}
            />
          ))}
        </div>

        <InfiniteScroll loadMore={onLoadMore} hasMore={totalPage > page}>
          {(hasMore) => <div>{hasMore ? "Loading..." : "This is the end"}</div>}
        </InfiniteScroll>
      </PullToRefresh>

      {curMsgDetail && (
        <MessageDetail
          showPanel={showDetail}
          msgDetail={curMsgDetail}
          onClose={onDetailClose}
        />
      )}
    </>
  );
}
export default Message;
