import { DEFAULT_PAGE_SIZE } from "@/config/env";
import { IOrderDetail } from "@/types";
import request from "@/utils/request";

export function getTaskInfo() {
  return request.get<
    unknown,
    {
      id: number;
      invite_code: string;
      total_score: number;
    }
  >("/apis/v1/task/get_user_task_info");
}

export function getTaskList() {
  return request.get<
    unknown,
    Array<{
      finish_count: number;
      today_finished?: 0 | 1;
      task_info: {
        id: number;
        name: string;
        description: string;
        detail_url: string;
        icon: string;
        tip_text: string;
      };
    }>
  >("/apis/v1/task/get_user_task_list");
}

export function completeTask(taskId: number) {
  return request.post("/apis/v1/task/user_set_task", {
    task_id: taskId,
  });
}

export function getScoreDetailList() {
  return request.get<
    unknown,
    Array<{
      created_at: string;
      current_score: number;
      id: number;
      score: number;
      task_id: number;
      updated_at: string;
      user_id: number;
    }>
  >("/apis/v1/task/get_user_task_log_list");
}

export function getOrderList(page: number) {
  return request.post<
    unknown,
    {
      total: number;
      list: Array<IOrderDetail>;
    }
  >("/apis/v1/dinero/get_my_order_list", {
    offset: page,
    limit: DEFAULT_PAGE_SIZE,
  });
}
