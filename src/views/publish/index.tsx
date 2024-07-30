import { getCoinList, getHotCoinList } from "@/api/order";
import { ICoinItem, IHotItem } from "@/types";
import React, { ReactNode, useEffect, useState } from "react";

const PublishPage: React.FC = () => {
  const [coinList, setCoinList] = useState<ICoinItem[]>([]);
  const [hotList, setHotList] = useState<IHotItem[]>([]);

  useEffect(() => {
    initHotList();
    initCoinList();
  }, []);

  const initHotList = async () => {
    const list = await getHotCoinList();

    setHotList(list || []);
  }

  const initCoinList = async () => {
    const coinList = await getCoinList('');

    setCoinList(coinList);
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
    <></>
  );
}
export default PublishPage;
