import { createBrowserRouter, Navigate, RouteObject } from "react-router-dom";

import Layout from "@/components/layout";

const routesList: RouteObject[] = [
  {
    path: "/",
    element: (
      <>
        <Layout />
      </>
    ),
  },
  {
    path: "*",
    element: <Navigate replace to='/' />,
  },
];

const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter(routesList);

export default router;