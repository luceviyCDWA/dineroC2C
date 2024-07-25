import React from "react";

import { INavItem } from "./data";

import Styles from './index.module.less';
import classNames from "classnames";

interface NavItemCompProps {
  className?: string;
  navInfo: INavItem
}

const NavItem: React.FC<NavItemCompProps> = ({
  className,
  navInfo
}) => {
  const { icon, title } = navInfo;

  return (
    <div className={classNames(Styles["nav"], className)}>
      <div className={Styles["icon-container"]}>
        <img className={Styles["icon"]} src={icon} alt="icon" />
      </div>
      <div className={Styles["title"]}>{title}</div>
    </div>
  );
}
export default NavItem;
