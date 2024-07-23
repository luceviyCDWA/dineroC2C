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
        path: 'test',
        element: React.createElement(lazy(() => import("@/views/test"))),
      },
    ],
  },
];

export default routesList;