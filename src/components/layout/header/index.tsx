import React from "react";

import useLayoutStore from "@/store/useLayoutStore";

import Styles from './index.module.less';
import { useNavigate } from "react-router-dom";
import { LeftOutline } from "antd-mobile-icons";


const Header: React.FC = () => {
  const { pageTitle, showBack, subTitle } = useLayoutStore((state) => ({
    pageTitle: state.pageTitle,
    showBack: state.showBack,
    subTitle: state.subTitle,
  }));
  const navigate = useNavigate();

  const onBack = () => {
    navigate(-1);
  }

  return (
    <div className={Styles["header"]}>
      {showBack && (
        <div className={Styles["back"]} onClick={onBack}>
          <LeftOutline />
        </div>
      )}

      <div className={Styles["title"]}>{pageTitle}</div>

      {subTitle && <div className={Styles["sub"]}>{subTitle}</div>}
    </div>
  );
}
export default Header;
