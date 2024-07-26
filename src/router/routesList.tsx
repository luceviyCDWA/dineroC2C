import React from "react";
import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";

const Layout = lazy(() => import("@/components/layout"));

const routesList: RouteObject[] = [
  {
    path: "/",
    element: (
      <>
        <Suspense fallback={<div></div>}>
          <Layout />
        </Suspense>
      </>
    ),
    children: [
      {
        index: true,
        element: React.createElement(lazy(() => import("@/views/index"))),
      },
      {
        path: "/market",
        element: React.createElement(lazy(() => import("@/views/market"))),
      },
      {
        path: "/publish",
        element: React.createElement(lazy(() => import("@/views/publish"))),
      },
      {
        path: "/message",
        element: React.createElement(lazy(() => import("@/views/message"))),
      },
      {
        path: "/me",
        element: React.createElement(lazy(() => import("@/views/me"))),
      },
    ],
  },
];

export default routesList;