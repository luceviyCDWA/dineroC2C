import { Helmet } from "react-helmet";
import Router from "@/router";
import usePublicDataStore from "./store/usePublicDataStore";
import { useEffect } from "react";
import useHomeStore from "./store/useHomeStore";

function App() {
  const initPublicData = usePublicDataStore((state) => state.initPublicData);
  const initData = useHomeStore(state => state.initData);

  useEffect(() => {
    initPublicData();
    initData();
  }, []);
  
  return (
    <>
      <Helmet>
        <title>Dinero</title>
      </Helmet>
      <div className={`app`}>
        <Router />
      </div>
    </>
  );
}

export default App;
