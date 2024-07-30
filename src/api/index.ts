import request from '@/utils/request';

export const login = (
  from: string,
  hex: string,
  msg: string,
  signType?: "evm" | "btc",
  inviteCode?: string,
) => {
  return request.post<
    unknown,
    {
      bearer_token: string;
    }
  >("/apis/v1/login/wallet_sign", {
    from,
    hex,
    msg,
    sign_type: signType || "evm",
    inviteCode,
  });
};
