import { getChainList, getCoinList, getHotCoinList } from "@/api/order";
import { IChainItem, ICoinItem, IHotItem } from "@/types";
import { create } from "zustand";

interface ChainListStoreState {
  // 链
  chainList: IChainItem[];
  // 货币分类
  coinList: ICoinItem[];
  // 热门货币分类
  hotList: IHotItem[];

  getChainList$: Promise<IChainItem[]> | null;
  getChainList: () => Promise<IChainItem[]>;

  getCoinList$: Promise<ICoinItem[]> | null;
  getCoinList: () => Promise<ICoinItem[]>;

  getHotList$: Promise<IHotItem[]> | null;
  getHotList: () => Promise<IHotItem[]>;

  initPublicData: () => Promise<void>;
}

const usePublicDataStore = create<ChainListStoreState>((set, get) => ({
  chainList: [],
  coinList: [],
  hotList: [],

  getChainList$: null,
  getChainList: () => {
    const { getChainList$ } = get();

    if (getChainList$) {
      return getChainList$;
    }

    const fetchPromise = getChainList();
    
    fetchPromise.then(res => {
      set((state) => ({
        ...state,
        chainList: res,
        getChainList$: null,
      }));
    });
    
    set((state) => ({
      ...state,
      getChainList$: fetchPromise,
    }));

    return fetchPromise;
  },

  getCoinList$: null,
  getCoinList: async () => {
    const {getCoinList$} = get();

    if (getCoinList$) {
      return getCoinList$;
    }

    const fetchPromise = getCoinList("");

    fetchPromise.then(res => {
      set((state) => ({
        ...state,
        coinList: res || [],
        getCoinList$: null,
      }));
    });
    
    set((state) => ({
      ...state,
      getCoinList$: fetchPromise,
    }));

    return fetchPromise;
  },

  getHotList$: null,
  getHotList: async () => {
    const { getHotList$ } = get();

    if (getHotList$) {
      return getHotList$.then();
    }

    const fetchPromise = getHotCoinList();

    fetchPromise.then((res) => {
      set((state) => ({
        ...state,
        hotList: res || [],
        getHotList$: null,
      }));
    });

    set((state) => ({
      ...state,
      getHotList$: fetchPromise,
    }));

    return fetchPromise;
  },

  initPublicData: async () => {
    const { getChainList, getCoinList, getHotList } = get();

    await Promise.all([getChainList(), getCoinList(), getHotList()]);
  }
}));

export default usePublicDataStore;
