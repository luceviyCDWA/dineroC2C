import { useEffect } from "react";

import useUserStore from "@/store/useUserStore";

export default function useInitUserInfo() {
  const getUserInfoFromToken = useUserStore(
    (state) => state.getUserInfoFromToken,
  );

  useEffect(() => {
    getUserInfoFromToken();
  }, []);
}