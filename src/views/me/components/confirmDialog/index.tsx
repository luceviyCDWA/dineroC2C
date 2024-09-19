import React from "react";

import Styles from './index.module.less';

interface ConfirmDialogProps {
  onClose: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  onClose
}) => {
  return (
    <div className={Styles["confirm__dialog"]}>
      <div className={Styles["bg"]}></div>
      <div className={Styles["content"]}>
        <div className={Styles["title"]}>
          Attention: The server is very busy, so Twitter verification may take
          effect after 30 minutes.Please be patient.
        </div>

        <div className={Styles["check__btns"]}>
          <div className={Styles["agree-btn"]} onClick={onClose}>
            Got it
          </div>
        </div>
      </div>
    </div>
  );
};
export default ConfirmDialog;
