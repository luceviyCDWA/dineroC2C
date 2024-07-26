import { create } from 'zustand';

interface LayoutStoreState {
  pageTitle: string;

  setPageTitle: (pageTitle: string) => void;
}

const useLayoutStore = create<LayoutStoreState>((set) => ({
  pageTitle: "Dinero",

  setPageTitle: (pageTitle) => {
    set((state) => ({ ...state, pageTitle }));
  },
}));

export default useLayoutStore;
