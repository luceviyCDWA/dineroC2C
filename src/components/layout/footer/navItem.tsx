import React, { useEffect, useState } from "react";
import classNames from "classnames";

import history from "@/utils/history";

import { INavItem, NAV_TYPE } from "./data";

import Styles from './index.module.less';
import { useNavigate } from "react-router-dom";
import useLayoutStore from "@/store/useLayoutStore";
import useMsgStore from "@/store/useMsgStore";

interface NavItemCompProps {
  className?: string;
  navInfo: INavItem
}

const NavItem: React.FC<NavItemCompProps> = ({
  className,
  navInfo
}) => {
  const { icon, activeIcon, title, path } = navInfo;

  const naviagate = useNavigate();
  const setPageTitle = useLayoutStore((state) => state.setPageTitle);
  const unreadNum = useMsgStore(state => state.unreadNum);

  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setIsActive(history.location.pathname === path);

    if (history.location.pathname === path) {
      setPageTitle(title);
    }
  }, [history.location.pathname]);

  const onJumpNewPage = () => {
    if (isActive) {
      return;
    }

    naviagate(path);
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
        {navInfo.type === NAV_TYPE.MESSAGE && (
          <span className={Styles["unread"]}>{unreadNum > 9 ? '9+' : unreadNum}</span>
        )}
      </div>
      <div className={Styles["title"]}>{title}</div>
    </div>
  );
}
export default NavItem;
