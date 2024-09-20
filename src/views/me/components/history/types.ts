import { TaskType } from "../taskItem/types";

import TaskIcon3 from "@/assets/imgs/me/bind.png";
import TaskIcon4 from "@/assets/imgs/me/daily.png";
import TaskIcon1 from "@/assets/imgs/me/follow.png";
import TaskIcon2 from "@/assets/imgs/me/invite.png";

export interface ScoreDetail {
  type: TaskType;
  title: string;
  addScore: number;
  nowScore: number;
  date: string;
}

export const TaskIconHash = {
  [TaskType.DAILY]: TaskIcon4,
  [TaskType.INVITE]: TaskIcon2,
  [TaskType.FOLLOW]: TaskIcon3,
  [TaskType.BIND]: TaskIcon1,
  [TaskType.TWITTER]: ''
} as const;