import { Helmet } from "react-helmet";
import Router from "@/router";

function App() {
  return (
    <>
      <Helmet>
        <title>AI合规检测</title>
        {/* <link rel="icon" type="image/svg+xml" href={faviconStr} /> */}
      </Helmet>
      <div className={`App`}>
        <Router />
      </div>
    </>
  );
}

export default App;
