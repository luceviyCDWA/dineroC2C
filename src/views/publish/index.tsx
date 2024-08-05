import React, { ReactNode, useEffect, useState } from "react";
import { IndexBar, Input } from "antd-mobile";

import usePublicDataStore from "@/store/usePublicDataStore";
import OrderEdit from "@/components/orderEdit";

import { IHotItem } from "@/types";

import SearchIcon from '@/assets/imgs/search.png';
import HotIcon from '@/assets/imgs/hot.png';

import Styles from './index.module.less';
import { useAccount } from "wagmi";
import useUserStore from "@/store/useUserStore";
import useLoginModalStore from "@/store/useLoginModalStore";

const PublishPage: React.FC = () => {
  const { coinList, hotList } = usePublicDataStore(
    (state) => ({
      coinList: state.coinList,
      hotList: state.hotList,
    }),
  );
  const [groupList, setGroupList] = useState<
    Array<{
      brief: string;
      title: ReactNode;
      list: IHotItem[];
    }>
  >([]);

  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const [curCoinId, setCurCoinId] = useState("");
  const [showOrderCreate, setShowOrderCreate] = useState(false);

  const { isConnected } = useAccount();
  const isLogin = useUserStore(state => state.isLogin);
  const onShowLogin = useLoginModalStore((state) => state.onShowLogin);

  useEffect(() => {
    const tmpHotList = !search
      ? hotList
      : hotList.filter((item) => item.name.indexOf(search) >= 0);
    const tmpCoinList = !search
      ? coinList
      : coinList.filter((item) => item.name.indexOf(search) >= 0);

    const groupList: Array<{
      brief: string;
      title: ReactNode;
      list: IHotItem[];
    }> = [];
    const charCodeOfA = "A".charCodeAt(0);

    groupList.push({
      brief: "★",
      title: (
        <div className={Styles["hot-title"]}>
          <img className={Styles["hot-icon"]} src={HotIcon} />
          <span className={Styles["hot-txt"]}>Hot</span>
        </div>
      ),
      list: tmpHotList,
    });

    groupList.push(
      ...Array(26)
        .fill("")
        .map((_, i) => {
          const letter = String.fromCharCode(charCodeOfA + i);

          return {
            brief: letter,
            title: <div className={Styles["common-header"]}>{letter}</div>,
            list: tmpCoinList.filter(
              (coin) =>
                coin.name.startsWith(letter) ||
                coin.name.startsWith(letter.toLowerCase()),
            ),
          };
        }),
    );

    setGroupList(groupList.filter((group) => !!group.list?.length));
  }, [coinList, hotList, search]);

  const onClickSearch = () => {
    setSearch(searchInput);
  }

  const onPublishCoin = async (coinId: string) => {
    if (!isConnected || !isLogin) {
      await onShowLogin();
    }
    setCurCoinId(coinId);
    setShowOrderCreate(true);
  };

  return (
    <div className={Styles["publish-page"]}>
      <div className={Styles["search"]}>
        <img
          className={Styles["search-icon"]}
          src={SearchIcon}
          onClick={onClickSearch}
        />
        <Input
          className={Styles["search-input"]}
          placeholder="Search"
          value={searchInput}
          onChange={setSearchInput}
          onEnterPress={onClickSearch}
        />
      </div>

      {groupList.length > 0 ? (
        <IndexBar>
          {groupList.map((group) => (
            <IndexBar.Panel
              key={group.brief}
              index={group.brief}
              title={group.title}
            >
              {group.list.map((coin) => (
                <div
                  className={Styles["coin-item"]}
                  key={coin.id}
                  onClick={() => onPublishCoin(coin.id)}
                >
                  <img className={Styles["icon"]} src={coin.image} />
                  {coin.name}
                </div>
              ))}
            </IndexBar.Panel>
          ))}
        </IndexBar>
      ) : (
        <div className={Styles['empty']}>No Data...</div>
      )}

      <OrderEdit
        showPanel={showOrderCreate}
        coinId={curCoinId}
        onClose={() => setShowOrderCreate(false)}
      />
    </div>
  );
};
export default PublishPage;
