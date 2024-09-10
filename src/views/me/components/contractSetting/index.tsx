import React, { useEffect, useState } from "react";
import { Input, Toast } from "antd-mobile";

import RightPage from "@/components/rightPage";

import TelegramIcon from '@/assets/imgs/settings/telegram.webp';
import DiscordIcon from "@/assets/imgs/settings/discord.png";
import WhatsappIcon from "@/assets/imgs/settings/whatapp.webp";

import Styles from './index.module.less';
import { getContractInfo, saveContractInfo } from "@/api/setting";
import _ from "lodash";

interface ContractSettingCompProps {
  showPanel: boolean;
  onClose: (hasSubmit?: boolean) => void;
}

const ContractSetting: React.FC<ContractSettingCompProps> = ({
  showPanel,
  onClose
}) => {
  const [telegram, setTelegram] = useState('');
  const [discord, setDiscord] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  useEffect(() => {
    if (showPanel) {
      initContractSetting();
    }
  }, [showPanel]);

  async function initContractSetting() {
    Toast.show({
      duration: 0,
      icon: "loading",
      content: "Loading...",
    });

    try {
      const { telegram, discord, whatsapp } = await getContractInfo();

      setTelegram(telegram || '');
      setDiscord(discord || '');
      setWhatsapp(whatsapp || '')
    } finally {
      Toast.clear();
    }
  }

  const onSave = _.debounce(async () => {
    Toast.show({
      duration: 0,
      icon: "loading",
      content: "Loading...",
    });

    try {
      await saveContractInfo({
        telegram,
        discord,
        whatsapp,
      });

      Toast.clear();

      Toast.show({
        icon: "success",
        content: "Saved Successfully!",
      });

      setTelegram("");
      setDiscord("");
      setWhatsapp("");

      onClose(true);
    } catch (e) {
      Toast.clear();
    }
  }, 200);

  return (
    <RightPage show={showPanel} title="Contract Information" onClose={onClose}>
      <div className={Styles["setting-panel"]}>
        <div className={Styles["input__item"]}>
          <div className={Styles["input__item-title"]}>Telegram</div>
          <div className={Styles["input__item-input"]}>
            <img className={Styles["input-icon"]} src={TelegramIcon} />
            <Input
              value={telegram}
              placeholder="Please enter"
              onChange={(e) => setTelegram(e)}
            />
          </div>
        </div>

        <div className={Styles["input__item"]}>
          <div className={Styles["input__item-title"]}>Discord</div>
          <div className={Styles["input__item-input"]}>
            <img className={Styles["input-icon"]} src={DiscordIcon} />
            <Input
              value={discord}
              placeholder="Please enter"
              onChange={(e) => setDiscord(e)}
            />
          </div>
        </div>

        <div className={Styles["input__item"]}>
          <div className={Styles["input__item-title"]}>WhatsApp</div>
          <div className={Styles["input__item-input"]}>
            <img className={Styles["input-icon"]} src={WhatsappIcon} />
            <Input
              value={whatsapp}
              placeholder="Please enter"
              onChange={(e) => setWhatsapp(e)}
            />
          </div>
        </div>

        <div className={Styles["save-btn"]} onClick={onSave}>
          <div className={Styles["btn"]}>Save</div>
        </div>
      </div>
    </RightPage>
  );
}
export default ContractSetting;
