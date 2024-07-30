import TaskIcon1 from "@/assets/imgs/me/task_1.png";
import TaskIcon2 from "@/assets/imgs/me/task_2.png";
import TaskIcon3 from "@/assets/imgs/me/task_3.png";

export const enum TaskType {
  DAILY = 1,
  INVITE = 2,
  FOLLOW = 3,
  BIND = 4,
}

export const TaskIconHash = {
  [TaskType.DAILY]: TaskIcon1,
  [TaskType.BIND]: TaskIcon1,
  [TaskType.INVITE]: TaskIcon2,
  [TaskType.FOLLOW]: TaskIcon3,
} as const;

export const TaskTitleHash = {
  [TaskType.DAILY]: "Daily Sign",
  [TaskType.INVITE]: "Invite friend tasks",
  [TaskType.FOLLOW]: "Joining Dinero group earns 5 points.",
  [TaskType.BIND]: "Bind Telegram Account",
} as const;

export const TaskDescHash = {
  [TaskType.DAILY]: [],
  [TaskType.INVITE]: [
    "Inviting 1 friend earns 2 points.",
    "Inviting 2 friend earns 5 points.",
    "Inviting 3 friend earns 8 points.",
  ],
  [TaskType.FOLLOW]: [],
  [TaskType.BIND]: [],
} as const;

export interface TaskItem {
  type: TaskType;
  title: string;
  content: string[];
  tips?: string;
}

export const JOIN_TASK_GROUP_URL = "https://t.me/DineroLabs";
export const GROUP_CHAT_ID = "-1002237895362";
export const GROUP_NAME = "DineroLabs";
