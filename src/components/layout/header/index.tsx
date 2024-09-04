import React from "react";

import useLayoutStore from "@/store/useLayoutStore";

import Styles from './index.module.less';


const Header: React.FC = () => {
  const { pageTitle, subTitle, showHeader } = useLayoutStore((state) => ({
    pageTitle: state.pageTitle,
    showBack: state.showBack,
    showHeader: state.showHeader,
    subTitle: state.subTitle,
  }));

  if (showHeader) {
    return (
      <div className={Styles["header"]}>
        <div className={Styles["title"]}>{pageTitle}</div>

        {subTitle && <div className={Styles["sub"]}>{subTitle}</div>}
      </div>
    );
  } else {
    return null;
  }
}
export default Header;
