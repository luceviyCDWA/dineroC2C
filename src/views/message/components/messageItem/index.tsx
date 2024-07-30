import React from "react";

import { IMessageItem, IMessageStatus } from "@/views/message/types";

import MessageIcon from '@/assets/imgs/message_icon.png';

import Styles from './index.module.less';
import dayjs from "dayjs";

interface MessageItemCompProps {
  msgInfo: IMessageItem;
  onSelect: (targetId: string) => void;
}

const MessageItem: React.FC<MessageItemCompProps> = ({ msgInfo, onSelect }) => {
  const { id, status, title, created_at, content } = msgInfo;

  const onClickMsg = () => {
    onSelect(id + '');
  }

  return (
    <div className={Styles["message__item"]} onClick={onClickMsg}>
      <div className={Styles["message__item-icon"]}>
        <img className={Styles["icon"]} src={MessageIcon} alt="icon" />
        {status === IMessageStatus.UnRead && (
          <span className={Styles["dot"]}></span>
        )}
      </div>

      <div className={Styles["message__item-detail"]}>
        <div className={Styles["message__item-main"]}>
          <div className={Styles["message__item-title"]}>{title}</div>
          <div className={Styles["message__item-time"]}>
            {dayjs(created_at).format("MMM.DD YYYY HH:mm:ss")}
          </div>
        </div>
        <div className={Styles["message__item-content"]}>{content}</div>
      </div>
    </div>
  );
};
export default MessageItem;
