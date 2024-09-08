import React, { useCallback, useEffect, useState } from "react";
import { Toast } from "antd-mobile";

import { getTaskInfo, getTaskList } from "@/api/user";
import useLayoutStore from "@/store/useLayoutStore";
import useUserStore from "@/store/useUserStore";
import useSelector from "@/hooks/useSelector";

import HistoryList from "./components/history";
import RightPage from "@/components/rightPage";
import TaskItemComp from "./components/taskItem";
import { TaskType, type TaskItem } from "./components/taskItem/types";
import DailyItem from "./components/dailyItem";

import SettingIcon from '@/assets/imgs/me/setting.png';
import ScoreIcon from '@/assets/imgs/me/score.png';
import NextIcon from "@/assets/imgs/me/next.png";

import Styles from './index.module.less';
import ContractSetting from "./components/contractSetting";

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
  const { setShowHeader, activeTab } = useLayoutStore(useSelector(["setShowHeader", "activeTab"]));
  const clearAll = useUserStore(state => state.clearAll);

  const [score, setScore] = useState(0);
  const [inviteCode, setInviteCode] = useState('');
  const [hasSigned, setHasSigned] = useState(0);
  const [todayHasSigned, setTodayHasSigned] = useState(false);
  const [taskList, setTaskList] = useState<TaskItem[]>([]);

  const [showHistory, setShowHistory] = useState(false);
  const [showSetting, setShowSetting] = useState(false);
  const [showContractSetting, setShowContractSetting] = useState(false);

  useEffect(() => {
    if (activeTab === 'me') {
      setShowHeader(false);

      initTaskInfo();
      initTaskList();
    } else {
      setShowHeader(true);
    }
  }, [activeTab]);

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

  const onShowContractSetting = () => {
    setShowContractSetting(true);
  }

  const onLogout = () => {
    clearAll();
    setShowSetting(false);

    Toast.show('Logged out');

    setTimeout(() => {
      window.location.replace('/');
    }, 500);
  }

  return (
    <div className={Styles["task"]}>
      <div className={Styles["custom__header"]}>
        <img
          className={Styles["setting"]}
          src={SettingIcon}
          onClick={() => setShowSetting(true)}
        />
        <div className={Styles["score"]}>
          <img className={Styles["score-icon"]} src={ScoreIcon} />
          {score} points
        </div>
        <div className={Styles["history"]} onClick={() => setShowHistory(true)}>
          History
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

      <div className={Styles["tab"]}>
        <div className={`${Styles["tab-item"]} ${Styles["active"]}`}>Task</div>
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

      {showHistory && (
        <HistoryList
          showPanel={showHistory}
          onClose={() => setShowHistory(false)}
        />
      )}

      <RightPage
        title="Setting"
        show={showSetting}
        onClose={() => setShowSetting(false)}
      >
        <div className={Styles["setting-list"]}>
          <div className={Styles["setting"]} onClick={onShowContractSetting}>
            Contact Information
            <img className={Styles["next-icon"]} src={NextIcon} alt="btn" />
          </div>
        </div>
        <div className={Styles["logout"]}>
          <div className={Styles["logout-btn"]} onClick={onLogout}>
            Log Out
          </div>
        </div>
      </RightPage>

      <ContractSetting
        showPanel={showContractSetting}
        onClose={() => setShowContractSetting(false)}
      />
    </div>
  );
};

export default TaskComp;
