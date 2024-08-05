import React, { useCallback, useEffect, useState } from "react";

import { getTaskInfo, getTaskList } from "@/api/user";

import TaskItemComp from "./components/taskItem";
import { TaskType, type TaskItem } from "./components/taskItem/types";
import DailyItem from "./components/dailyItem";

import AIScoreBtnIcon from "@/assets/imgs/me/score.png";
import AITips from "@/assets/imgs/me/score_q.png";

import Styles from './index.module.less';

const DAILY_NUM = 7;

const DAILY_NORMAL_LIST: Array<undefined> = [
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
  undefined,
];

const TaskComp: React.FC = () => {
  const [score, setScore] = useState(0);
  const [inviteCode, setInviteCode] = useState('');
  const [hasSigned, setHasSigned] = useState(0);
  const [todayHasSigned, setTodayHasSigned] = useState(false);
  const [taskList, setTaskList] = useState<TaskItem[]>([]);

  useEffect(() => {
    initTaskInfo();
    initTaskList();
  }, []);

  async function initTaskInfo() {
    try {
      const res = await getTaskInfo();

      setScore(res.total_score || 0);
      setInviteCode(res.invite_code || "");
    } catch (e) {
      console.log(e);
    }
  }

  async function initTaskList() {
    try {
      const res = await getTaskList();

      const tmpTaskList: TaskItem[] = [];

      (res || []).forEach((task) => {
        if (task.task_info.id === TaskType.DAILY) {
          setHasSigned(task?.finish_count || 0);
          setTodayHasSigned(!!task.today_finished);
        } else {
          tmpTaskList.push({
            type: task?.task_info.id,
            title: task.task_info?.name,
            content: task.task_info?.description?.split(","),
            tips: task.task_info?.tip_text,
          });
        }
      });

      setTaskList(tmpTaskList);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
    }
  }

  const handleCompleteDaily = useCallback(() => {
    setHasSigned(hasSigned + 1);
    setTodayHasSigned(true);
    initTaskInfo();
  }, [hasSigned]);

  return (
    <div className={Styles["task"]}>
      <div className={Styles["total__score"]}>
        <div className={Styles["total__score-detail"]}>
          <div className={Styles["total__score-detail-title"]}>
            AI Points
            <img
              className={Styles["total__score-detail-tips"]}
              src={AITips}
              alt="tips"
            />
          </div>
          <div className={Styles["total__score-detail-num"]}>{score}</div>
        </div>
        <div className={Styles["total__score-exchange"]}>
          <img
            className={Styles["total__score-exchange-icon"]}
            src={AIScoreBtnIcon}
            alt="score"
          />
          <span className={Styles["total__score-exchange-txt"]}>Exchange</span>
        </div>
      </div>
      <div className={Styles["daily__table"]}>
        <div className={Styles["daily__table-title"]}>
          Sign in continuously to get points
        </div>
        <div className={Styles["daily__table-list"]}>
          <div className={Styles["daily__table-sublist"]}>
            {DAILY_NORMAL_LIST.map((_, index) => (
              <DailyItem
                key={index}
                hasSigned={hasSigned}
                todayHasSigned={todayHasSigned}
                today={index}
                onComplete={handleCompleteDaily}
              />
            ))}
          </div>
          <div className={Styles["daily__table-target"]}>
            <DailyItem
              hasSigned={hasSigned}
              todayHasSigned={todayHasSigned}
              today={DAILY_NUM - 1}
              onComplete={handleCompleteDaily}
            />
          </div>
        </div>
      </div>
      <div className={Styles["task__list"]}>
        {taskList.map((task) => (
          <TaskItemComp
            key={task.type}
            taskInfo={task}
            inviteCode={inviteCode}
          />
        ))}
        <div className={Styles["more-task"]}>
          More rewards are coming soon...
        </div>
      </div>
    </div>
  );
};

export default TaskComp;
