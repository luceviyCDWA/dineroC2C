import { IContractInfo } from "@/types";
import request from "@/utils/request";

export const getContractInfo = () => {
  return request.get<unknown, IContractInfo>(
    "/apis/v1/user/get_user_contact_info",
  );
}

export const saveContractInfo = (data: IContractInfo) => {
  return request.post("/apis/v1/user/update_user_contact_info", data);
};
