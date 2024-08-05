import React, { useEffect, useState } from "react";
import { InfiniteScroll, PullToRefresh, Toast } from "antd-mobile";

import CoinItem from "./components/coinItem";
import MarketItem from "./components/marketItem";
import CoinSelect from "@/components/coinSelect";
import usePublicDataStore from "@/store/usePublicDataStore";
import { getOrderList } from "@/api/order";

import { ActionType, GuaranteeStatus, SortType, type ICoinItem, type IOrderDetail } from "@/types";

import Styles from './index.module.less';

const START_OFFSET = 1;
const PAGE_SIZE = 10;

const Market: React.FC = () => {
  const coinList = usePublicDataStore((state) => state.coinList);

  // 列表属性
  const [orderList, setOrderList] = useState<IOrderDetail[]>([]);
  const [offset, setOffset] = useState(START_OFFSET);
  const [hasMore, setHasMore] = useState(true);

  // 过滤
  const [type, setType] = useState<ActionType>(ActionType.Buy); 
  const [curCoin, setCurCoin] = useState<ICoinItem | null>(null);
  const [sortType, setSortType] = useState<SortType>(SortType.UnitPriceDown);
  const [search, setSearch] = useState('');
  const [guaranteeStatus, setGuaranteeStatus] = useState<GuaranteeStatus>(
    GuaranteeStatus.NotGuaranteed,
  );

  useEffect(() => {
    if (coinList?.length) {
      setCurCoin(coinList[0]);
    }
  }, [coinList]);

  const onGetOrderList = async (isReset?: boolean) => {
    if (!curCoin) {
      Toast.show({
        content: 'Please Select Category First',
      });
      return;
    }

    if (!isReset && !hasMore) {
      return;
    }

    const curOffset = isReset ? START_OFFSET : offset;
    const nowList = isReset ? [] : [...orderList];

    const { total, list = [] } = await getOrderList({
      category_id: curCoin?.id,
      type,
      is_mortgage: guaranteeStatus,
      keyword: search,
      sort: sortType,
      limit: PAGE_SIZE,
      offset: curOffset,
    });

    setOrderList([...nowList, ...list]);
    setOffset(curOffset + PAGE_SIZE);
    setHasMore(curOffset + PAGE_SIZE < total);
  }

  const onResetData = () => {
    onGetOrderList(true);
  }

  const onCompleteOrder = (orderId: string) => {
    setOrderList(orderList.filter(orderInfo => orderInfo.id !== orderId ));
  }

  return (
    <div className={Styles["market-page"]}>
      {curCoin && (
        <>
          <CoinItem coinInfo={curCoin} />

          {/* <div className={Styles["order-filter"]}>
            <CoinSelect curCoinInfo={curCoin} onSelectCoin={() => {}} />
          </div> */}

          <div className={Styles["order-list"]}>
            <PullToRefresh
              canReleaseText="Release to refresh"
              completeText="Refresh successful"
              pullingText="Pull to refresh"
              refreshingText="Loading..."
              onRefresh={async () => {
                onResetData();
              }}
            >
              <div className={Styles["order-list-wrapper"]}>
                {orderList.map((orderDetail) => (
                  <MarketItem
                    key={orderDetail.id}
                    marketItemInfo={orderDetail}
                    onCompleteOrder={onCompleteOrder}
                  />
                ))}
              </div>

              <InfiniteScroll loadMore={onGetOrderList} hasMore={hasMore}>
                {(hasMore) => (
                  <div>{hasMore ? "Loading..." : "This is the end"}</div>
                )}
              </InfiniteScroll>
            </PullToRefresh>
          </div>
        </>
      )}
    </div>
  );
}
export default Market;
