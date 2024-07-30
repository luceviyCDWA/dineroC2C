import React, { useEffect, useState } from "react";
import { InfiniteScroll, PullToRefresh } from "antd-mobile";

import CoinIcon from '@/assets/imgs/example/coin.png';
import DetailIcon1 from '@/assets/imgs/example/detail-1.png';
import DetailIcon2 from "@/assets/imgs/example/detail-2.png";
import DetailIcon3 from "@/assets/imgs/example/detail-3.png";
import DetailIcon4 from "@/assets/imgs/example/detail-4.png";
import DetailIcon5 from "@/assets/imgs/example/detail-5.png";
import CurrencyIcon from '@/assets/imgs/example/usdt.png';

import useListData from "@/hooks/useListData";

import { ActionType } from "@/types";
import { ICoinInfo } from "./components/coinItem/types";
import { type IMarketItem } from "./components/marketItem/types";

import CoinItem from "./components/coinItem";
import MarketItem from "./components/marketItem";

import Styles from './index.module.less';
import { getHotCoinList } from "@/api";
import CoinSelect from "@/components/coinSelect";



const Market: React.FC = () => {
  const [coinList, setCoinList] = useState<ICoinInfo[]>([]);
  const [curCoin, setCurCoin] = useState<ICoinInfo | null>(null);

  const { dataList, page, totalPage, getNextPageList, resetData } =
    useListData<IMarketItem>({
      api: "/api/test",
      type: "get",
      dataFormat: async (list, curPage) => {
        return list.map((_, index) => ({
          id: `${curPage * 10 + index}`,
          name: `10,000 SEND Point ${curPage * 10 + index}`,
          coinIcon: CoinIcon,
          hasGuarantee: index % 2 > 0,
          marketType: ActionType.Buy,
          unitPrice: "0.000001",
          totalPrice: "100",
          currencyName: "USDT",
        }));
      }
    });

  useEffect(() => {
    // 获取所有coinList
    initHotCoinList();
    const res: ICoinInfo[] = [
      {
        id: "1",
        name: "SEND",
        icon: CoinIcon,
        detailIcon: [
          DetailIcon1,
          DetailIcon2,
          DetailIcon3,
          DetailIcon4,
          DetailIcon5,
        ],
        currency: "USDT",
        currencyIcon: CurrencyIcon,
      },
    ];

    if (res.length > 0) {
      setCoinList(res);
      setCurCoin(res[0]);
      getNextPageList(page + 1);
    }
  }, []);

  const initHotCoinList = async () => {
    const res = await getHotCoinList();

    console.log(res);
  }

  const onLoadMore = async () => {
    await getNextPageList(page + 1);
  }
  return (
    <div className={Styles["market-page"]}>
      {curCoin && <CoinItem coinInfo={curCoin} />}

      <div className={Styles["order-filter"]}>
        <CoinSelect curCoinId={curCoin?.id} onSelectCoin={() => {}} />
      </div>

      <div className={Styles["order-list"]}>
        <PullToRefresh
          canReleaseText="Release to refresh"
          completeText="Refresh successful"
          pullingText="Pull to refresh"
          refreshingText="Loading..."
          onRefresh={async () => {
            await resetData();
          }}
        >
          <div className={Styles["order-list-wrapper"]}>
            {dataList.map((marketItem) => (
              <MarketItem key={marketItem.id} marketItemInfo={marketItem} />
            ))}
          </div>

          <InfiniteScroll loadMore={onLoadMore} hasMore={totalPage > page} />
        </PullToRefresh>
      </div>
    </div>
  );
}
export default Market;
