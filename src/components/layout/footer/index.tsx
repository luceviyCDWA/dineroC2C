import React, { useEffect } from "react";

import NavItem from "./navItem";
import { NAV_LIST, PageTabType } from "./data";
import useUserStore from "@/store/useUserStore";

import PublishIcon from '@/assets/imgs/layout/publish.png';

import Styles from "./index.module.less";
import useLoginModalStore from "@/store/useLoginModalStore";
import useMsgStore from "@/store/useMsgStore";
import useLayoutStore from "@/store/useLayoutStore";
import useSelector from "@/hooks/useSelector";

const Footer: React.FC = () => {
  const isLogin = useUserStore(state => state.isLogin);
  const onShowLogin = useLoginModalStore((state) => state.onShowLogin);
  const getUnreadNum = useMsgStore((state) => state.getUnReadNum);
  const { setPageTitle, setActiveTab } = useLayoutStore(
    useSelector(["setPageTitle", "setActiveTab"]),
  );

  useEffect(() => {
    if (isLogin) {
      getUnreadNum();
    }
  }, [isLogin]);

  const onPublish = async () => {
    if (!isLogin) {
      await onShowLogin();
    } else {
      setActiveTab(PageTabType.PUBLISH);
      setPageTitle('Publish');
    }
  }

  return (
    <div className={Styles["footer"]}>
      <NavItem
        className={Styles["home"]}
        navInfo={NAV_LIST[PageTabType.HOME]}
      />
      <NavItem
        className={Styles["market"]}
        navInfo={NAV_LIST[PageTabType.MARKET]}
      />
      <div className={Styles["publish"]} onClick={onPublish}>
        <div className={Styles["publish-btn"]}>
          <img className={Styles["icon"]} src={PublishIcon} alt="publish" />
        </div>
        {/* <div className={Styles["bg"]}></div> */}
      </div>
      <NavItem
        className={Styles["message"]}
        navInfo={NAV_LIST[PageTabType.MESSAGE]}
      />
      <NavItem className={Styles["me"]} navInfo={NAV_LIST[PageTabType.ME]} />
    </div>
  );
}
export default Footer;
