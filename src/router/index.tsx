import { useEffect, useLayoutEffect, useState } from "react";
import { Router, useRoutes } from "react-router-dom";
import history from "@/utils/history";

import routesList from "./routesList";

const WrapperRoutes = () => {
  return useRoutes(routesList);
}

const IndexRouter = () => {
  const [state, setState] = useState({
    action: history.action,
    location: history.location,
  });

  useLayoutEffect(() => history.listen(setState), [history]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [history.location.pathname]);

  return (
    <Router
      basename="/"
      location={state.location}
      navigationType={state.action}
      navigator={history}
    >
      <WrapperRoutes />
    </Router>
  );
}

export default IndexRouter;