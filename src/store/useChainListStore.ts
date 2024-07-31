import { getChainList } from "@/api/order";
import { IChainItem } from "@/types";
import { create } from "zustand";

interface ChainListStoreState {
  chainList: IChainItem[];
  
  getChainList: () => Promise<void>;
}

const useChainListStore = create<ChainListStoreState>((set) => ({
  chainList: [],

  getChainList: async () => {
    const res = await getChainList();

    set(state => ({
      ...state,
      chainList: res
    }));
  }
}));

export default useChainListStore;
