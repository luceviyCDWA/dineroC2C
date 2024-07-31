import { getCoinList, getHotCoinList } from "@/api/order";
import OrderEdit from "@/components/orderEdit";
import useChainListStore from "@/store/useChainListStore";
import { ICoinItem, IHotItem } from "@/types";
import React, { ReactNode, useEffect, useState } from "react";

const PublishPage: React.FC = () => {
  const [coinList, setCoinList] = useState<ICoinItem[]>([]);
  const [hotList, setHotList] = useState<IHotItem[]>([]);

  const [curCoinId, setCurCoinId] = useState('');
  const [showOrderCreate, setShowOrderCreate] = useState(false);

  const getChainList = useChainListStore((state) => state.getChainList);

  useEffect(() => {
    initHotList();
    initCoinList();

    getChainList();
  }, []);

  const initHotList = async () => {
    const list = await getHotCoinList();

    setHotList(list || []);
  }

  const initCoinList = async () => {
    const coinList = await getCoinList('');

    setCoinList(coinList);
  }

  const onPublishCoin = (coinId: string) => {
    setCurCoinId(coinId);
    setShowOrderCreate(true);
  }

  const groupList: Array<{
    brief: ReactNode;
    title: ReactNode;
    list: IHotItem[];
  }> = [];
  const charCodeOfA = 'A'.charCodeAt(0);

  groupList.push({
    brief: <img />,
    title: (
      <div>Hot</div>
    ),
    list: hotList,
  });

  groupList.push(
    ...Array(26)
      .fill("")
      .map((_, i) => {
        const letter = String.fromCharCode(charCodeOfA + i);

        return {
          brief: letter,
          title: letter,
          list: coinList.filter(
            (coin) =>
              coin.name.startsWith(letter) ||
              coin.name.startsWith(letter.toLowerCase()),
          ),
        };
      }),
  );

  return (
    <>
      {groupList.map((group, index) => (
        <div key={index}>
          {group.brief}
          {group.list.map((coin) => (
            <div key={coin.id} onClick={() => onPublishCoin(coin.id)}>
              <img src={coin.image} />
              {coin.name}
            </div>
          ))}
        </div>
      ))}

      <OrderEdit
        showPanel={showOrderCreate}
        coinId={curCoinId}
        onClose={() => setShowOrderCreate(false)}
      />
    </>
  );
}
export default PublishPage;
