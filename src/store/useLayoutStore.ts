import { ReactNode } from 'react';
import { create } from 'zustand';

import { PageTabType } from "@/components/layout/footer/data";

interface LayoutStoreState {
  activeTab: PageTabType;
  isHorizontal: boolean;
  pageTitle: string;
  showHeader: boolean;
  showBack: boolean;
  subTitle?: ReactNode;

  setActiveTab: (newTab: PageTabType) => void;
  setIsHorizontal: (isHorizontal: boolean) => void;
  setPageTitle: (pageTitle: string) => void;
  setShowHeader: (showHeader: boolean) => void;
  setShowBack: (showBack: boolean) => void;
  setSubTitle: (subTitle?: ReactNode) => void;
}

const useLayoutStore = create<LayoutStoreState>((set) => ({
  activeTab: PageTabType.HOME,
  isHorizontal: false,
  pageTitle: "Dinero",
  showBack: false,
  showHeader: true,

  setActiveTab: (newTab) => {
    set((state) => ({ ...state, activeTab: newTab }));
  },

  setIsHorizontal: (isHorizontal) => {
    set((state) => ({ ...state, isHorizontal }));
  },

  setPageTitle: (pageTitle) => {
    set((state) => ({ ...state, pageTitle }));
  },

  setShowHeader: (showHeader) => {
    set((state) => ({ ...state, showHeader }));
  },

  setShowBack: (showBack: boolean) => {
    set((state) => ({ ...state, showBack }));
  },

  setSubTitle: (subTitle?: ReactNode) => {
    set((state) => ({ ...state, subTitle }));
  },
}));

export default useLayoutStore;
