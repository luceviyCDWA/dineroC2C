import React from "react";

import { IMessageItem } from "@/views/message/types";
import Styles from './index.module.less';

interface MessageItemCompProps {
  msgInfo: IMessageItem;
  onSelect: (targetId: string) => void;
}

const MessageItem: React.FC<MessageItemCompProps> = ({ msgInfo, onSelect }) => {
  const { id, icon, hasRead, title, createTime, content } = msgInfo;

  const onClickMsg = () => {
    onSelect(id);
  }

  return (
    <div className={Styles["message__item"]} onClick={onClickMsg}>
      <div className={Styles["message__item-icon"]}>
        <img className={Styles["icon"]} src={icon} alt="icon" />
        {!hasRead && <span className={Styles["dot"]}></span>}
      </div>

      <div className={Styles["message__item-detail"]}>
        <div className={Styles["message__item-main"]}>
          <div className={Styles["message__item-title"]}>{title}</div>
          <div className={Styles["message__item-time"]}>{createTime}</div>
        </div>
        <div className={Styles["message__item-content"]}>{content}</div>
      </div>
    </div>
  );
};
export default MessageItem;
