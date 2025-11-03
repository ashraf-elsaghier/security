import React, { useEffect, useState } from "react";
import VerticalNav from "./vertical-nav";
// import Scrollbar from "smooth-scrollbar";
import { useSelector, useDispatch } from "react-redux";
import { sidebarMini, toggle } from "../lib/slices/toggleSidebar";
import { useRouter } from "next/router";
import axios from "axios";
import { useSession } from "next-auth/client";
import { encryptName } from "../helpers/encryptions";
import { IoMdArrowRoundBack } from "react-icons/io";

const Sidebar = () => {
  const isActiveSideBar = useSelector((state) => state.toggleMenu.value);
  const dispatch = useDispatch();
  
  const router = useRouter();
  const [disableBtns, setDisableBtns] = useState(false);
  const { user } = useSession()[0]?.user;
  const [systemData, setSystemData] = useState({});

  const { systemConfig } = useSelector((state) => state);
  const { language } = useSelector((state) => state.config);

  useEffect(() => {
    router.events.on("routeChangeComplete", () => dispatch(sidebarMini()));
  }, [dispatch, router.events, systemConfig]);

  const handleToggleMenu = () => {
    if (!disableBtns) {
      dispatch(toggle());
    }
  };

  return (
    <>
      <aside
        className={`sidebar sidebar-default navs-rounded-all  ${
          isActiveSideBar && "sidebar-mini"
        }
         ${!disableBtns && "sidebar-hover"} `}
      >
        <div
          className={`sidebar-header d-flex align-items-center `}
          style={{ height: "91px" }}
        >
          <a
            className={`navbar-brand d-flex align-items-center mx-auto`}
            style={{ maxWidth: "100%" }}
            href={`/${language === "ar" ? language : ""}`}
          >
            <img src="/logo-sm-wzout-text.png" width={40} height={40} />
            <img
              src="/text-logo.png  "
              className="logo-title"
              width={75}
              height={40}
            />
          </a>

          <div
            className="sidebar-toggle shadow-lg rounded-circle d-flex align-items-center position-absolute"
            data-toggle="sidebar"
            data-active="true"
            onClick={handleToggleMenu}
          >
            <i
              className="icon d-flex align-items-center justify-content-center "
              style={{ width: "25px", height: "25px" }}
            >
              <IoMdArrowRoundBack size={20} />
            </i>
          </div>
        </div>
        <div
          className="sidebar-body pt-0 data-scrollbar"
          data-scroll="1"
          id="my-scrollbar"
        >
          <div className="collapse navbar-collapse" id="sidebar">
            {!disableBtns && <VerticalNav />}
          </div>
        </div>
        <div className="sidebar-footer" />
      </aside>
    </>
  );
};

export default Sidebar;
