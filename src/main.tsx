import ReactDOM from "react-dom/client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

import App from "./App.tsx";
import './index.css'

dayjs.extend(utc);

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(<App />);
