import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import queryString from "query-string";

import useQuickOrderStore from "@/store/useQuickOrderStore";

export default function useInitQuickOrder() {
  const getOrderInfoAndShow = useQuickOrderStore(
    (state) => state.getOrderInfoAndShow,
  );

  const location = useLocation();
  const { quickOrderId } = queryString.parse(location.search);

  useEffect(() => {
    quickOrderId && getOrderInfoAndShow(quickOrderId as string);
    location.search = '';
  }, [quickOrderId]);
}
