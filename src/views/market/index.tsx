import React, { useEffect, useState } from "react";
import { InfiniteScroll, Input, Popup, PullToRefresh, Toast } from "antd-mobile";
import classNames from "classnames";

import CoinItem from "./components/coinItem";
import MarketItem from "./components/marketItem";
import CoinSelect from "@/components/coinSelect";
import usePublicDataStore from "@/store/usePublicDataStore";
import { getOrderList } from "@/api/order";

import { ActionType, GuaranteeStatus, SORT_TITLE_HASH, SortType, type ICoinItem, type IOrderDetail } from "@/types";

import ArrowIcon from '@/assets/imgs/arrow.png';
import CheckIcon from "@/assets/imgs/check.png";
import USDTIcon from '@/assets/imgs/example/usdt.png';

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
  const [type, setType] = useState<ActionType>(ActionType.Sell); 
  const [curCoin, setCurCoin] = useState<ICoinItem | null>(null);
  const [sortType, setSortType] = useState<SortType>(SortType.UnitPriceDown);
  const [search, setSearch] = useState('');
  const [guaranteeStatus, setGuaranteeStatus] = useState<GuaranteeStatus>(
    GuaranteeStatus.NotGuaranteed,
  );

  // 排序弹窗
  const [showSortPopup, setShowSortPopup] = useState(false);

  useEffect(() => {
    if (coinList?.length) {
      setCurCoin(coinList[0]);
    }
  }, [coinList]);

  useEffect(() => {
    onGetOrderList(true);
  }, [type, curCoin, sortType, guaranteeStatus]);

  const onGetOrderList = async (isReset?: boolean) => {
    if (!curCoin) {
      return;
    }

    if (!isReset && !hasMore) {
      return;
    }

    const curOffset = isReset ? START_OFFSET : offset;
    const nowList = isReset ? [] : [...orderList];

    Toast.show({
      duration: 0,
      icon: "loading",
      content: "Loading...",
    });

    try {
      const { total, list = [] } = await getOrderList({
        category_id: curCoin?.id,
        type,
        is_mortgage: guaranteeStatus,
        keyword: search,
        sort: sortType,
        limit: PAGE_SIZE,
        offset: curOffset,
      });

      setOrderList([...nowList, ...(list || [])]);
      setOffset(curOffset + PAGE_SIZE);
      setHasMore(curOffset + PAGE_SIZE < total);
    } finally {
      Toast.clear();
    }
  }

  const onResetData = () => {
    onGetOrderList(true);
  }

  const onCompleteOrder = (orderId: string) => {
    setOrderList(orderList.filter(orderInfo => orderInfo.id !== orderId ));
  }

  const onSelectSortType = (newSortType: SortType) => {
    if (Number(newSortType) === sortType) {
      return;
    }

    setSortType(Number(newSortType));
    setShowSortPopup(false);
  }

  const onToggleGuaranteeStatus = () => {
    setGuaranteeStatus(
      guaranteeStatus === GuaranteeStatus.Guaranteed
        ? GuaranteeStatus.NotGuaranteed
        : GuaranteeStatus.Guaranteed,
    );
  }

  return (
    <div className={Styles["market-page"]}>
      {curCoin && (
        <>
          <CoinItem coinInfo={curCoin} />

          <div className={Styles["order-filter"]}>
            <div className={Styles["filter-item"]}>
              <div className={Styles["tabs"]}>
                <div
                  className={classNames(Styles["tab-item"], {
                    [Styles["active"]]: type === ActionType.Sell,
                  })}
                  onClick={() => setType(ActionType.Sell)}
                >
                  Buy
                </div>
                <div
                  className={classNames(Styles["tab-item"], {
                    [Styles["active"]]: type === ActionType.Buy,
                  })}
                  onClick={() => setType(ActionType.Buy)}
                >
                  Sell
                </div>
              </div>

              <div
                className={Styles["sort-list"]}
                onClick={() => setShowSortPopup(true)}
              >
                <div className={Styles["container"]}>
                  <div className={Styles["content"]}>
                    {SORT_TITLE_HASH[sortType]}
                  </div>
                  <img className={Styles["icon"]} src={ArrowIcon} />
                </div>
              </div>
            </div>

            <div className={Styles["filter-item"]}>
              <CoinSelect curCoinInfo={curCoin} onSelectCoin={setCurCoin} />

              <div
                className={classNames(Styles["guarantee__status"], {
                  [Styles["active"]]:
                    guaranteeStatus === GuaranteeStatus.Guaranteed,
                })}
                onClick={onToggleGuaranteeStatus}
              >
                <img className={Styles["status-img"]} src={CheckIcon} />
                Guarantee deposit
              </div>

              <div className={Styles["key__input"]}>
                <div className={Styles["container"]}>
                  <Input
                    className={Styles["key__input-input"]}
                    type="number"
                    placeholder="amount"
                    onChange={setSearch}
                    onEnterPress={onResetData}
                  />

                  <img className={Styles["key__input-icon"]} src={USDTIcon} />
                  <span className={Styles["key__input-title"]}>USDT</span>
                </div>
              </div>
            </div>
          </div>

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

          <Popup
            visible={showSortPopup}
            onMaskClick={() => {
              setShowSortPopup(false);
            }}
            onClose={() => {
              setShowSortPopup(false);
            }}
            bodyStyle={{
              height: "60vh",
              background: "#15161B",
              borderRadius: "15px 15px 0px 0px",
            }}
          >
            <div className={Styles["sort__list"]}>
              <div className={Styles["sort__list-prefix"]}></div>
              <div className={Styles["sort__list-title"]}>
                <span>Sort By</span>
              </div>

              <div className={Styles["list-container"]}>
                {(Object.keys(SORT_TITLE_HASH) as unknown as SortType[]).map(
                  (type) => (
                    <div
                      className={classNames(Styles["list-item"], {
                        [Styles["active"]]: Number(type) === sortType,
                      })}
                      key={Number(type)}
                      onClick={() => onSelectSortType(Number(type))}
                    >
                      <div className={Styles["container"]}>
                        <span>{SORT_TITLE_HASH[type]}</span>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </div>
          </Popup>
        </>
      )}
    </div>
  );
}
export default Market;
