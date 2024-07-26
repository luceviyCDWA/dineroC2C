import React from "react";

import useLayoutStore from "@/store/useLayoutStore";

import Styles from './index.module.less';


const Header: React.FC = () => {
  const pageTitle = useLayoutStore(state => state.pageTitle);

  return (
    <div className={Styles['header']}>
      {pageTitle}
    </div>
  );
}
export default Header;
