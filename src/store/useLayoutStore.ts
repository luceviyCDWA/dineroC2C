import { ReactNode } from 'react';
import { create } from 'zustand';

interface LayoutStoreState {
  pageTitle: string;
  showHeader: boolean;
  showBack: boolean;
  subTitle?: ReactNode;

  setPageTitle: (pageTitle: string) => void;
  setShowHeader: (showHeader: boolean) => void;
  setShowBack: (showBack: boolean) => void;
  setSubTitle: (subTitle?: ReactNode) => void;
}

const useLayoutStore = create<LayoutStoreState>((set) => ({
  pageTitle: "Dinero",
  showBack: false,
  showHeader: true,

  setPageTitle: (pageTitle) => {
    set((state) => ({ ...state, pageTitle }));
  },

  setShowHeader: (showHeader) => {
    set(state => ({...state, showHeader}))
  },

  setShowBack: (showBack: boolean) => {
    set((state) => ({ ...state, showBack }));
  },

  setSubTitle: (subTitle?: ReactNode) => {
    set((state) => ({ ...state, subTitle }));
  }
}));

export default useLayoutStore;
