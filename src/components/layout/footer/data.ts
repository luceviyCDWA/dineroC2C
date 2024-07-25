import HomeIcon from '@/assets/imgs/layout/home.png';
import HomeActiveIcon from "@/assets/imgs/layout/home_active.png";

import MarketIcon from "@/assets/imgs/layout/market.png";
import MarketActiveIcon from "@/assets/imgs/layout/market_active.png";

import MessageIcon from "@/assets/imgs/layout/message.png";
import MessageActiveIcon from "@/assets/imgs/layout/message_active.png";

import MeIcon from "@/assets/imgs/layout/me.png";
import MeActiveIcon from "@/assets/imgs/layout/me_active.png";


export const enum NAV_TYPE {
  HOME,
  MARKET,
  MESSAGE,
  ME,
}

export interface INavItem {
  type: NAV_TYPE,
  title: string;
  icon: string;
  activeIcon: string;
  path: string;
}

export const NAV_LIST: Record<NAV_TYPE, INavItem> = {
  [NAV_TYPE.HOME]: {
    type: NAV_TYPE.HOME,
    title: "Home",
    icon: HomeIcon,
    activeIcon: HomeActiveIcon,
    path: "/",
  },
  [NAV_TYPE.MARKET]: {
    type: NAV_TYPE.MARKET,
    title: "Market",
    icon: MarketIcon,
    activeIcon: MarketActiveIcon,
    path: "/market",
  },
  [NAV_TYPE.MESSAGE]: {
    type: NAV_TYPE.MESSAGE,
    title: "Message",
    icon: MessageIcon,
    activeIcon: MessageActiveIcon,
    path: "/message",
  },
  [NAV_TYPE.ME]: {
    type: NAV_TYPE.ME,
    title: "Me",
    icon: MeIcon,
    activeIcon: MeActiveIcon,
    path: "/me",
  },
};