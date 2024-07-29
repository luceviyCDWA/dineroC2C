import request from '@/utils/request';

export const login = (
  from: string,
  hex: string,
  msg: string,
  signType?: "evm" | "btc",
  inviteCode?: string,
) => {
  return request.post("/apis/v1/login/wallet_sign", {
    from,
    hex,
    msg,
    sign_type: signType || 'evm',
    inviteCode
  });
};

export const getHotCoinList = () => {
  return request.get("/apis/v1/dinero/get_hot_list");
}