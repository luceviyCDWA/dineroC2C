import React, { useEffect } from "react";
import { SpinLoading } from "antd-mobile";

import useHomeStore from "@/store/useHomeStore";
import usePublicDataStore from "@/store/usePublicDataStore";
import RecommendItem from "./components/recommendItem";

import HotImg from '@/assets/imgs/fire_02.png';

import Styles from "./index.module.less";

const Index: React.FC = () => {
  const hotList = usePublicDataStore((state) => state.hotList);
  const { bannerList, hasInit, initData } = useHomeStore(state => ({
    bannerList: state.bannerList,
    hasInit: state.hasInitData,
    initData: state.initData,
  }));

  useEffect(() => {
    initData();
  }, []);

  const onJumpBanner = (url?: string) => {
    if (!url) {
      return;
    }

    window.open(url);
  }

  return (
    <div className={Styles["home-page"]}>
      {hasInit ? (
        <>
          {bannerList.length > 0 && (
            <div className={Styles["banner"]}>
              <img
                className={Styles["banner-img"]}
                src={bannerList[0].image}
                onClick={() => onJumpBanner(bannerList[0].url)}
              />
            </div>
          )}

          <div className={Styles["recommend-list"]}>
            <div className={Styles["recommend-title"]}>
              <img className={Styles["title-icon"]} src={HotImg} />
              <span className={Styles["title-txt"]}>Hot</span>
            </div>

            {hotList.map((item) => (
              <RecommendItem key={item.id} info={item} />
            ))}
          </div>
        </>
      ) : (
        <div className={Styles["loading"]}>
          <SpinLoading />
        </div>
      )}
    </div>
  );
}
export default Index;
