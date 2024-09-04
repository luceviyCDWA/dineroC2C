import HomeIcon from '@/assets/imgs/layout/home.png';
import HomeActiveIcon from "@/assets/imgs/layout/home_active.png";

import MarketIcon from "@/assets/imgs/layout/market.png";
import MarketActiveIcon from "@/assets/imgs/layout/market_active.png";

import MessageIcon from "@/assets/imgs/layout/message.png";
import MessageActiveIcon from "@/assets/imgs/layout/message_active.png";

import MeIcon from "@/assets/imgs/layout/me.png";
import MeActiveIcon from "@/assets/imgs/layout/me_active.png";


export const enum PageTabType {
  HOME = "index",
  MARKET = "market",
  PUBLISH = "publish",
  MESSAGE = "message",
  ME = "me",
}


export interface INavItem {
  type: PageTabType;
  title: string;
  icon: string;
  activeIcon: string;
}

export const NAV_LIST: Record<PageTabType, INavItem> = {
  [PageTabType.HOME]: {
    type: PageTabType.HOME,
    title: "Home",
    icon: HomeIcon,
    activeIcon: HomeActiveIcon,
  },
  [PageTabType.MARKET]: {
    type: PageTabType.MARKET,
    title: "Market",
    icon: MarketIcon,
    activeIcon: MarketActiveIcon,
  },
  [PageTabType.PUBLISH]: {
    type: PageTabType.PUBLISH,
    title: "Publish",
    icon: '',
    activeIcon: '',
  },
  [PageTabType.MESSAGE]: {
    type: PageTabType.MESSAGE,
    title: "Message",
    icon: MessageIcon,
    activeIcon: MessageActiveIcon,
  },
  [PageTabType.ME]: {
    type: PageTabType.ME,
    title: "Me",
    icon: MeIcon,
    activeIcon: MeActiveIcon,
  },
};