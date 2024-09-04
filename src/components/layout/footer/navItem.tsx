import React, { useEffect, useState } from "react";
import classNames from "classnames";

import { INavItem, PageTabType } from "./data";

import useSelector from "@/hooks/useSelector";

import useLayoutStore from "@/store/useLayoutStore";
import useMsgStore from "@/store/useMsgStore";
import useUserStore from "@/store/useUserStore";
import useLoginModalStore from "@/store/useLoginModalStore";

import Styles from "./index.module.less";

interface NavItemCompProps {
  className?: string;
  navInfo: INavItem
}

const NavItem: React.FC<NavItemCompProps> = ({
  className,
  navInfo
}) => {
  const { icon, activeIcon, title, type } = navInfo;

  const { setPageTitle, activeTab, setActiveTab } = useLayoutStore(
    useSelector(["setPageTitle", "setActiveTab", "activeTab"]),
  );
  const unreadNum = useMsgStore(state => state.unreadNum);
  const isLogin = useUserStore((state) => state.isLogin);
  const onShowLogin = useLoginModalStore((state) => state.onShowLogin);

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(activeTab === type);

    if (activeTab === type) {
      setPageTitle(title);
    }
  }, [activeTab]);

  const onJumpNewPage = async () => {
    if (isActive) {
      return;
    }

    if (type === PageTabType.MESSAGE || type === PageTabType.ME) {
      if (!isLogin) {
        await onShowLogin();
      }
    }

    setActiveTab(type);
  }

  return (
    <div
      className={classNames(Styles["nav"], className, {
        [Styles["active"]]: isActive,
      })}
      onClick={onJumpNewPage}
    >
      <div className={Styles["icon-container"]}>
        {isActive ? (
          <img className={Styles["icon"]} src={activeIcon} alt="icon" />
        ) : (
          <img className={Styles["icon"]} src={icon} alt="icon" />
        )}
        {navInfo.type === PageTabType.MESSAGE && unreadNum > 0 && (
          <span className={Styles["unread"]}>
            {unreadNum > 9 ? "9+" : unreadNum}
          </span>
        )}
      </div>
      <div className={Styles["title"]}>{title}</div>
    </div>
  );
}
export default NavItem;
