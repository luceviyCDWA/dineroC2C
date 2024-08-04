import { create } from "zustand";

import { getRecommendList } from "@/api/order";
import usePublicDataStore from "./usePublicDataStore";

import { IBannerList } from "@/views/index/components/recommendItem/types";

interface HomeStoreState {
  bannerList: IBannerList[];

  hasInitData: boolean;
  initData: () => Promise<void>;
}

const useHomeStore = create<HomeStoreState>((set) => ({
  bannerList: [],
  hasInitData: false,

  initData: async () => {
    const { getHotList } = usePublicDataStore.getState();
    const [bannerList] = await Promise.all([getRecommendList(), getHotList()]);

    set((state) => ({
      ...state,
      hasInitData: true,
      bannerList,
    }));
  },
}));

export default useHomeStore;
