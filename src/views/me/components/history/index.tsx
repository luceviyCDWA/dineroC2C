import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { PullToRefresh } from "antd-mobile";

import { getScoreDetailList } from "@/api/user";
import RightPage from "@/components/rightPage";

import { ScoreDetail, TaskIconHash } from "./types";
import { TaskTitleHash, TaskType } from "../taskItem/types";

import EmptyIcon from "@/assets/imgs/me/empty.png";

import Styles from "./index.module.less";

interface HistoryListCompProps {
  showPanel: boolean;
  onClose: () => void;
}

const HistoryList: React.FC<HistoryListCompProps> = ({
  showPanel,
  onClose
}) => {
  const [tab, setTab] = useState<'score' | 'order'>('score');
  const [detailList, setDetailList] = useState<ScoreDetail[]>([]);

  useEffect(() => {
    initDetailList();
  }, []);

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

  return (
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
          <div className={Styles["history__panel-list"]}></div>
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
              {detailList.length > 0 ? (
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
                        <div className={Styles['detail__item-date']}>
                          {detail.date}
                        </div>
                      </div>
                      <div className={Styles['detail__item-score']}>
                        <div className={Styles['detail__item-add']}>
                          +{detail.addScore}
                        </div>
                        <div className={Styles['detail__item-total']}>
                          {detail.nowScore}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={Styles['detail__empty']}>
                  <img
                    className={Styles['empty-img']}
                    alt="empty"
                    src={EmptyIcon}
                  />
                  <div className={Styles['empty-title']}>No detail</div>
                  <div className={Styles['empty-text']}>You have not earned</div>
                  <div className={Styles['empty-text']}>any point so far</div>
                </div>
              )}
            </PullToRefresh>
          </div>
        )}
      </div>
    </RightPage>
  );
};
export default HistoryList;
