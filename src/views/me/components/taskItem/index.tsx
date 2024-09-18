import React from "react";
import classNames from "classnames";
import { Toast } from "antd-mobile";
import copy from "copy-to-clipboard";

import { JOIN_TASK_GROUP_URL, TaskDescHash, TaskIconHash, TaskItem, TaskTitleHash, TaskType } from "./types";

import NextIcon from "@/assets/imgs/me/next.png";
import TipsIcon from "@/assets/imgs/me/score_q.png";

import Styles from './index.module.less';

interface TaskItemCompProps {
  taskInfo: TaskItem;
  inviteCode: string;
}

const TaskItemComp: React.FC<TaskItemCompProps> = (props) => {
  const { taskInfo, inviteCode, } = props;
  const { type, tips } = taskInfo;

  const onCompleteJoinTask = () => {
    window.open(JOIN_TASK_GROUP_URL);
  };

  const onTaskClick = async () => {
    if (taskInfo.type === TaskType.INVITE) {
      copy(inviteCode);
      Toast.show({
        icon: "success",
        content: "invite code was copied",
      });
    } else if (taskInfo.type === TaskType.FOLLOW) {
      onCompleteJoinTask();
    }
  };

  if (!TaskIconHash[type]) {
    return null;
  }

  return (
    <div className={Styles["task__item"]} onClick={onTaskClick}>
      {type !== TaskType.DAILY && (
        <img
          src={TaskIconHash[type]}
          alt="task"
          className={Styles["task__item-icon"]}
        />
      )}
      <div className={Styles["task__item-main"]}>
        <div className={Styles["task__item-title"]}>
          <span className={Styles["task__item-title-content"]}>
            {TaskTitleHash[type]}
          </span>
          {tips && (
            <img
              src={TipsIcon}
              className={Styles["task__item-title-tips"]}
              alt="tips"
            />
          )}
        </div>
        {TaskDescHash[type].map((str) => (
          <div key={str} className={Styles["task__item-content"]}>{str}</div>
        ))}
      </div>
      <img
        className={classNames(
          Styles["task__item-next"],
          !TaskDescHash[type].length && Styles["no-content"],
        )}
        src={NextIcon}
        alt="btn"
      />
    </div>
  );
};

export default TaskItemComp;
