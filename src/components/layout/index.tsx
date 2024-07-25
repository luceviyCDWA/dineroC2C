import React from "react";
import { Outlet } from "react-router-dom";
import "./index.less";
import Footer from "./footer";

const Layout: React.FC = () => {
  return (
    <>
      <div className="layout">
        <div className="content">
          <Outlet></Outlet>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
