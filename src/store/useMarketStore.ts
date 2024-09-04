import { create } from "zustand";

interface MarketStoreState {
  curCoinId: string;
  setCurCoinId: (coinId: string) => void;
}

const useMarketStore = create<MarketStoreState>((set) => ({
  curCoinId: "",

  setCurCoinId: async (coinId) => {
    set((state) => ({
      ...state,
      curCoinId: coinId,
    }));
  },
}));

export default useMarketStore;
