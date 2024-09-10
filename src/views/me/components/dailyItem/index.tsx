import React from 'react';
import classNames from "classnames";
import { Toast } from "antd-mobile";

import { completeTask } from "@/api/user";

import { TaskType } from "../taskItem/types";

import CompleteIcon from "@/assets/imgs/me/complete.png";
import TaskGift from "@/assets/imgs/me/gift.png";
import TaskGiftDisabled from "@/assets/imgs/me/gift_disabled.png";

import Styles from './index.module.less';
import _ from 'lodash';

interface DailyItemProps {
  hasSigned: number;
  todayHasSigned: boolean;
  today: number;
  onComplete: () => void;
}

const DAY_LIST = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th"];
const SCORE_LIST = [1, 1, 1, 1, 1, 1, 5];

const DailyItem: React.FC<DailyItemProps> = (props) => {
  const { hasSigned, today, todayHasSigned, onComplete } = props;

  const onClick = _.debounce(async () => {
    if (hasSigned !== today || todayHasSigned) {
      return;
    }

    const res = await completeTask(TaskType.DAILY);

    if (res.data.success) {
      onComplete();

      Toast.show({
        icon: "success",
        content: "Task Completed !",
      });
    }
  }, 200);

  const realDate = todayHasSigned ? hasSigned - 1 : hasSigned;

  return (
    <div
      className={classNames(
        Styles["daily__table-item"],
        realDate === today && Styles["today"],
      )}
      onClick={onClick}
    >
      {hasSigned > today && (
        <img
          src={CompleteIcon}
          className={Styles["daily__table-item-complete"]}
          alt="completeIcon"
        />
      )}
      <div className={Styles["daily__table-item-title"]}>Point</div>
      {realDate > today || (realDate === today && todayHasSigned) ? (
        <span className={Styles["daily__table-item-score"]}>
          {SCORE_LIST[today]}
        </span>
      ) : (
        <img
          src={realDate === today ? TaskGift : TaskGiftDisabled}
          className={Styles["daily__table-item-gift"]}
          alt="gift"
        />
      )}
      <div
        className={classNames(
          Styles["daily__table-item-info"],
          realDate === today && Styles["active"],
          realDate < today && Styles["disabled"],
        )}
      >
        {realDate === today ? "Today" : `${DAY_LIST[today]}`}
      </div>
    </div>
  );
};

export default DailyItem;
