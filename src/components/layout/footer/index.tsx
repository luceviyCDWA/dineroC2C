import React from "react";

import NavItem from "./navItem";
import { NAV_LIST, NAV_TYPE } from "./data";
import useUserStore from "@/store/useUserStore";

import PublishIcon from '@/assets/imgs/layout/publish.png';

import Styles from "./index.module.less";
import useLoginModalStore from "@/store/useLoginModalStore";

const Footer: React.FC = () => {
  const isLogin = useUserStore(state => state.isLogin);
  const onShowLogin = useLoginModalStore((state) => state.onShowLogin);

  const onPublish = async () => {
    if (!isLogin) {
      await onShowLogin();
      console.log('### ok');
    }
  }

  return (
    <div className={Styles["footer"]}>
      <NavItem className={Styles["home"]} navInfo={NAV_LIST[NAV_TYPE.HOME]} />
      <NavItem
        className={Styles["market"]}
        navInfo={NAV_LIST[NAV_TYPE.MARKET]}
      />
      <div className={Styles["publish"]} onClick={onPublish}>
        <div className={Styles["publish-btn"]}>
          <img className={Styles["icon"]} src={PublishIcon} alt="publish" />
        </div>
        {/* <div className={Styles["bg"]}></div> */}
      </div>
      <NavItem
        className={Styles["message"]}
        navInfo={NAV_LIST[NAV_TYPE.MESSAGE]}
      />
      <NavItem className={Styles["me"]} navInfo={NAV_LIST[NAV_TYPE.ME]} />
    </div>
  );
}
export default Footer;
