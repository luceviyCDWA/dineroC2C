import React, { PropsWithChildren, useEffect, useState } from "react";
import classNames from "classnames";
import { LeftOutline } from "antd-mobile-icons";

import Styles from "./index.module.less";


interface RightPageCompProps {
  className?: string;
  show: boolean;
  onClose: () => void;
  title?: string;
  rightBtnNode?: React.ReactElement;
}

const RightPage: React.FC<PropsWithChildren<RightPageCompProps>> = ({
  className = '',
  show,
  onClose,
  title = '',
  rightBtnNode,
  
  children
}) => {
  const [innerShow, setInnerShow] = useState(false);

  useEffect(() => {
    setInnerShow(show);
  }, [show]);

  const onTransEnd = () => {
    if (!innerShow) {
      onClose();
    }
  };

  const onBack = () => {
    setInnerShow(false);
  };
  
  return (
    <div
      className={classNames(Styles["right__panel"], className, {
        [Styles["show"]]: innerShow,
      })}
      onTransitionEnd={onTransEnd}
    >
      <div className={Styles["right__panel-header"]}>
        <div className={Styles["back"]} onClick={onBack}>
          <LeftOutline />
        </div>
        <div className={Styles["title"]}>{title}</div>
        <div className={Styles["btns"]}>{rightBtnNode}</div>
      </div>
      <div className={Styles["right__panel-content"]}>{children}</div>
    </div>
  );
};
export default RightPage;
