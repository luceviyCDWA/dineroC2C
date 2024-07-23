import ReactDOM from "react-dom/client";
import { ConfigProvider } from "antd";
import locale from "antd/locale/zh_CN";

import App from "./App.tsx";
import './index.css'

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
  <ConfigProvider locale={locale}>
    <App />
  </ConfigProvider>
);
