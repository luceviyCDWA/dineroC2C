import React, { useEffect, useState } from "react";

import TaskTwitterIcon from '@/assets/imgs/me/task_twitter.png';

import { FollowStatus, TaskItem } from "./types";

import Styles from './index.module.less';
import classNames from "classnames";
import { getTwitterTaskStatus, recordTwitterFollow } from "@/api/user";
import ConfirmDialog from "../confirmDialog";

interface TwitterTaskCompProps {
  taskInfo: TaskItem;
}

const TwitterTask: React.FC<TwitterTaskCompProps> = ({
  taskInfo
}) => {
  const { title, content, url } = taskInfo;
  const [hasInit, setHasInit] = useState(false);
  const [hasComplete, setHasComplete] = useState(false);
  const [showTips, setShowTips] = useState(false);

  useEffect(() => {
    checkCompleteStatus();
  }, []);

  async function checkCompleteStatus() {
    try {
      const { status } = await getTwitterTaskStatus();

      setHasComplete(status === FollowStatus.Followed);
    } finally {
      setHasInit(true);
    }
  }

  function onJumpToTwitter() {
    if (hasComplete || !url) {
      return;
    }

    window.open(url);

    // 记录关注
    recordTwitterFollow();
    setShowTips(true);
  }
  return (
    <>
      <div className={Styles["task__twitter"]}>
        <img className={Styles["task__twitter-img"]} src={TaskTwitterIcon} />
        <div className={Styles["task__twitter-main"]}>
          <div className={Styles["title"]}>{title}</div>
          <div className={Styles["content"]}>{content[0] || ""}</div>
          {hasInit && (
            <div
              className={classNames(Styles["btn"], {
                [Styles["done"]]: hasComplete,
              })}
              onClick={onJumpToTwitter}
            >
              {hasComplete ? "Followed" : "Follow"}
            </div>
          )}
        </div>
        <div className={Styles["task__twitter-score"]}>
          <div className={Styles["score"]}>20 Points</div>
        </div>
      </div>

      {showTips && <ConfirmDialog onClose={() => setShowTips(false)} />}
    </>
  );
}
export default TwitterTask;
