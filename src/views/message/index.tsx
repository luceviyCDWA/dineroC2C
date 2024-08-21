import React, { useCallback, useState } from "react";
import { InfiniteScroll, PullToRefresh, Toast } from "antd-mobile";

import { getMessageDetail } from "@/api/message";
import { getOrderDetail } from "@/api/order";

import useMsgStore from "@/store/useMsgStore";
import MessageItem from "./components/messageItem";
import MessageDetail from "./components/messageDetail";

import Styles from "./index.module.less";
import { type IOrderDetail } from "@/types";

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
  const [curMsgDetail, setCurMsgDetail] = useState<IOrderDetail | null>(null);

  const onLoadMore = async () => {
    await getNextPageData();
  }

  const onSelectDetail = useCallback(async (selectId: string) => {
    Toast.show({
      duration: 0,
      icon: "loading",
      content: "Loading...",
    });

    try {
      const { url } = await getMessageDetail(selectId);
      const orderInfo = await getOrderDetail(url);

      setShowDetail(true);
      setCurMsgDetail(orderInfo);

      Toast.clear();
    } catch (e) {
      Toast.clear();
      Toast.show({
        icon: "fail",
        content: "Fail to get message detail",
      });
    }
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
