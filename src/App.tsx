import { Helmet } from "react-helmet";
import Router from "@/router";
import usePublicDataStore from "./store/usePublicDataStore";
import { useEffect } from "react";

function App() {
  const initPublicData = usePublicDataStore((state) => state.initPublicData);

  useEffect(() => {
    initPublicData();
  }, []);
  
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
