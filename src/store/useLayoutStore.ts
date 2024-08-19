import { ReactNode } from 'react';
import { create } from 'zustand';

interface LayoutStoreState {
  pageTitle: string;
  showBack: boolean;
  subTitle?: ReactNode;

  setPageTitle: (pageTitle: string) => void;
  setShowBack: (showBack: boolean) => void;
  setSubTitle: (subTitle?: ReactNode) => void;
}

const useLayoutStore = create<LayoutStoreState>((set) => ({
  pageTitle: "Dinero",
  showBack: false,

  setPageTitle: (pageTitle) => {
    set((state) => ({ ...state, pageTitle }));
  },

  setShowBack: (showBack: boolean) => {
    set((state) => ({ ...state, showBack }));
  },

  setSubTitle: (subTitle?: ReactNode) => {
    set((state) => ({ ...state, subTitle }));
  }
}));

export default useLayoutStore;
