import React from "react";

import useLayoutStore from "@/store/useLayoutStore";
import useSelector from "@/hooks/useSelector";

import Home from "@/views/index";
import Market from "@/views/market";
import PublishPage from "@/views/publish";
import Message from "@/views/message";
import Me from "@/views/me";
import classNames from "classnames";
import { PageTabType } from "../footer/data";


interface LayoutContentCompProps {
}

const LayoutContent: React.FC<LayoutContentCompProps>=() => {
  const { activeTab } = useLayoutStore(useSelector(["activeTab"]));

  return (
    <>
      <div
        className={classNames("content", {
          show: activeTab === PageTabType.HOME,
        })}
      >
        <Home />
      </div>

      <div
        className={classNames("content", {
          show: activeTab === PageTabType.MARKET,
        })}
      >
        <Market />
      </div>

      <div
        className={classNames("content", {
          show: activeTab === PageTabType.PUBLISH,
        })}
      >
        <PublishPage />
      </div>

      <div
        className={classNames("content", {
          show: activeTab === PageTabType.MESSAGE,
        })}
      >
        <Message />
      </div>

      <div
        className={classNames("content", {
          show: activeTab === PageTabType.ME,
        })}
      >
        <Me />
      </div>
    </>
  );
}
export default LayoutContent;
