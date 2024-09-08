import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { InfiniteScroll, PullToRefresh, Toast } from "antd-mobile";
import dayjs from "dayjs";

import { INIT_PAGE } from "@/config/env";

import { getOrderList, getScoreDetailList } from "@/api/user";
import MessageDetail from "@/views/message/components/messageDetail";
import RightPage from "@/components/rightPage";

import { ScoreDetail, TaskIconHash } from "./types";
import { TaskTitleHash, TaskType } from "../taskItem/types";
import { ActionType, IContractInfo, IOrderDetail } from "@/types";

import Styles from "./index.module.less";
import { getOrderDetail } from "@/api/order";

interface HistoryListCompProps {
  showPanel: boolean;
  onClose: () => void;
}

const HistoryList: React.FC<HistoryListCompProps> = ({
  showPanel,
  onClose
}) => {
  const [tab, setTab] = useState<'score' | 'order'>('order');
  const [detailList, setDetailList] = useState<ScoreDetail[]>([]);

  const [orderList, setOrderList] = useState<IOrderDetail[]>([]);
  const [orderPage, setOrderPage] = useState(INIT_PAGE - 1);
  const [orderHasMore, setOrderHasMore] = useState(true);

  const [showDetail, setShowDetail] = useState(false);
  const [curMsgDetail, setCurMsgDetail] = useState<IOrderDetail | null>(null);
  const [curContractInfo, setCurContractInfo] = useState<IContractInfo>();

  useEffect(() => {
    if (tab === 'score') {
      initDetailList();
    } else if (tab === 'order') {
      initOrderList();
    }
  }, [tab]);

  async function initDetailList() {
    const res = await getScoreDetailList();

    setDetailList(
      res.map((item) => ({
        type: item.task_id,
        title: TaskTitleHash[item.task_id as TaskType],
        addScore: item.score,
        nowScore: item.current_score,
        date: item.created_at.split("T")[0],
      })),
    );
  }

  async function initOrderList() {
    setOrderList([]);
    setOrderPage(INIT_PAGE - 1);
    setOrderHasMore(true);
  }

  async function getNextPageOrderList(isReset?: boolean) {
    if (!isReset && !orderHasMore) {
      return;
    }

    const page = isReset ? INIT_PAGE : orderPage + 1;
    const prevList = isReset ? [] : [...orderList];

    const { total, list } = await getOrderList(page);
    const curList = [...prevList, ...list];

    setOrderList(curList);
    setOrderPage(page);
    setOrderHasMore(total > curList.length);
  }

  async function onSelectOrder(orderDetail: IOrderDetail) {
    Toast.show({
      duration: 0,
      icon: "loading",
      content: "Loading...",
    });

    try {
      const { order, user_contact} = await getOrderDetail(orderDetail.id);

      setCurMsgDetail(order);
      setCurContractInfo(user_contact);
      setShowDetail(true);

      Toast.clear();
    } catch (e) {
      Toast.clear();
      Toast.show({
        icon: "fail",
        content: "Fail to get message detail",
      });
    }
  }

  const onDetailClose = () => {
    setShowDetail(false);
    getNextPageOrderList(true);
  };

  return (
    <>
      <RightPage show={showPanel} title="History" onClose={onClose}>
        <div className={Styles["history__panel"]}>
          <div className={Styles["history__panel-title"]}>
            <div className={Styles["tabs"]}>
              <div
                className={classNames(Styles["tab-item"], {
                  [Styles["active"]]: tab === "order",
                })}
                onClick={() => setTab("order")}
              >
                Order
              </div>
              <div
                className={classNames(Styles["tab-item"], {
                  [Styles["active"]]: tab === "score",
                })}
                onClick={() => setTab("score")}
              >
                Score
              </div>
            </div>
          </div>

          {tab === "order" && (
            <div className={Styles["history__panel-list"]}>
              <PullToRefresh
                canReleaseText="Release to refresh"
                completeText="Refresh successful"
                pullingText="Pull to refresh"
                refreshingText="Loading..."
                onRefresh={async () => {
                  getNextPageOrderList(true);
                }}
              >
                <div className={Styles["detail__list"]}>
                  {orderList.map((orderInfo) => (
                    <div
                      key={orderInfo.id}
                      className={Styles["detail__item"]}
                      onClick={() => onSelectOrder(orderInfo)}
                    >
                      <img
                        src={orderInfo.category_image}
                        alt="detail"
                        className={Styles["detail__item-icon"]}
                      />
                      <div className={Styles["detail__item-main"]}>
                        <div className={Styles["detail__item-title"]}>
                          {orderInfo.type === ActionType.Buy ? "Buy" : "Sell"}
                        </div>
                        <div className={Styles["detail__item-date"]}>
                          {dayjs(orderInfo.created_at).format(
                            "YYYY-MM-DD HH:mm:ss",
                          )}
                        </div>
                      </div>
                      <div className={Styles["detail__item-score"]}>
                        <div className={Styles["detail__item-add"]}>
                          {orderInfo.total_count} {orderInfo.category_name}
                        </div>
                        <div className={Styles["detail__item-total"]}>
                          {orderInfo.total_price} {orderInfo.payment_name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <InfiniteScroll
                  loadMore={getNextPageOrderList}
                  hasMore={orderHasMore}
                >
                  {(orderHasMore) => (
                    <div>{orderHasMore ? "Loading..." : "This is the end"}</div>
                  )}
                </InfiniteScroll>
              </PullToRefresh>
            </div>
          )}
          {tab === "score" && (
            <div className={Styles["history__panel-list"]}>
              <PullToRefresh
                canReleaseText="Release to refresh"
                completeText="Refresh successful"
                pullingText="Pull to refresh"
                refreshingText="Loading..."
                onRefresh={async () => {
                  initDetailList();
                }}
              >
                <div className={Styles["detail__list"]}>
                  {detailList.map((detail) => (
                    <div className={Styles["detail__item"]}>
                      <img
                        src={TaskIconHash[detail.type]}
                        alt="detail"
                        className={Styles["detail__item-icon"]}
                      />
                      <div className={Styles["detail__item-main"]}>
                        <div className={Styles["detail__item-title"]}>
                          {detail.title}
                        </div>
                        <div className={Styles["detail__item-date"]}>
                          {detail.date}
                        </div>
                      </div>
                      <div className={Styles["detail__item-score"]}>
                        <div className={Styles["detail__item-add"]}>
                          +{detail.addScore}
                        </div>
                        <div className={Styles["detail__item-total"]}>
                          {detail.nowScore}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <InfiniteScroll
                  loadMore={() => new Promise((resolve) => resolve())}
                  hasMore={false}
                >
                  <div>This is the end</div>
                </InfiniteScroll>
              </PullToRefresh>
            </div>
          )}
        </div>
      </RightPage>

      {curMsgDetail && (
        <MessageDetail
          showPanel={showDetail}
          msgDetail={curMsgDetail}
          contractInfo={curContractInfo}
          onClose={onDetailClose}
        />
      )}
    </>
  );
};
export default HistoryList;
