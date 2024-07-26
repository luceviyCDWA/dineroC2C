import React from "react";
import { Outlet } from "react-router-dom";

import Header from "./header";
import Footer from "./footer";

import "./index.less";


const Layout: React.FC = () => {
  return (
    <>
      <div className="layout">
        <Header />
        <div className="content">
          <Outlet></Outlet>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Layout;
