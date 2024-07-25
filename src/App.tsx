import { Helmet } from "react-helmet";
import Router from "@/router";

function App() {
  return (
    <>
      <Helmet>
        <title>Dinero</title>
      </Helmet>
      <div className={`App`}>
        <Router />
      </div>
    </>
  );
}

export default App;
