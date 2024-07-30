const baseUrl = import.meta.env.VITE_BASE_URL;
const codeUrl = `${window.location.origin}/code`
const actUrl = `${window.location.origin}/act/modeler.html?modelId=`
const smsKey = import.meta.env.VITE_SMS_KEY;
const passwordKey = import.meta.env.VITE_PASSWORD_KEY;
const smsKeyTEST = import.meta.env.VITE_SMS_KEY_TEST;
const passwordKeyTEST = import.meta.env.VITE_PASSWORD_KEY_TEST;
const smsKeyPRE = import.meta.env.VITE_SMS_KEY_PRE;
const passwordKeyPRE = import.meta.env.VITE_PASSWORD_KEY_PRE;
const smsKeyJX = import.meta.env.VITE_SMS_KEY_JX;
const passwordKeyJX = import.meta.env.VITE_PASSWORD_KEY_JX;
const smsKeyNL = import.meta.env.VITE_SMS_KEY_NL;
const passwordKeyNL = import.meta.env.VITE_PASSWORD_KEY_NL;
const smsKeySS = import.meta.env.VITE_SMS_KEY_SS;
const passwordKeySS = import.meta.env.VITE_PASSWORD_KEY_SS;
const smsKeyGQC = import.meta.env.VITE_SMS_KEY_GQC;
const passwordKeyGQC = import.meta.env.VITE_PASSWORD_KEY_GQC;

const INIT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;

export {
  baseUrl,
  codeUrl,
  actUrl,
  smsKey,
  passwordKey,
  smsKeyTEST,
  passwordKeyTEST,
  smsKeyPRE,
  passwordKeyPRE,
  smsKeyJX,
  passwordKeyJX,
  smsKeyNL,
  passwordKeyNL,
  smsKeySS,
  passwordKeySS,
  smsKeyGQC,
  passwordKeyGQC,

  INIT_PAGE,
  DEFAULT_PAGE_SIZE
};
