import React from "react";
import { Outlet } from "react-router-dom";
import "./index.less";
import Header from "./header";

const Layout: React.FC = () => {
  return (
    <>
      <div className="layout">
        <Header />
        <div className="content">
          <Outlet></Outlet>
        </div>
      </div>
    </>
  );
};

export default Layout;
