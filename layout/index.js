import React, { useEffect } from "react";

//header
import Header from "./header";
//subheader
import SubHeader from "./sub-header";
//sidebar
import Sidebar from "./sidebar";
//footer
// import Footer from './footer'

import Router, { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { encryptName } from "../helpers/encryptions";

import { setConfig, setConfigOnLogin } from "../lib/slices/config";
import { VehicleProvider } from "context/VehiclesContext";

const Layout = ({ children, settBtnRef }) => {
  let router = useRouter();
  const config = useSelector((state) => state.config);
  const dispatch = useDispatch();

  // (async () => {
  //   const db = new Dexie('fmsDB');
  //   db.version(1).stores({
  //     friends: 'id', // Primary key and indexed props
  //   });
  //   await db.friends.put({
  //     name: 'Camilla',
  //     age: 25,
  //     street: 'East 13:th Street',
  //     details: {fmaily:'asdas', strong: false, date: new Date()},
  //   }, 5);

  //   await db.friends.bulkPut([{
  //     id: 6,
  //     name: 'Camilla',
  //     age: 25,
  //     street: 'East 13:th Street',
  //     details: {fmaily:'asdas', strong: false, date: new Date()},
  //   }, {
  //     id: 7,
  //     name: 'Camilla',
  //     age: 25,
  //     street: 'East 13:th Street',
  //     details: {fmaily:'asdas', strong: false, date: new Date()},
  //   }]);

  //   const oldFriends = await db.friends.where({name: 'Camilla'}).toArray();
  //   const of = await db.friends.bulkGet([5,6,7]);

  //   console.log(of);
  // })();

  useEffect(
    (_) => {
      const getConfig =
        localStorage.getItem(encryptName("config")) ||
        localStorage.getItem("lastConfig");
      if (getConfig) {
        dispatch(setConfig(JSON.parse(getConfig)));
      } else {
        dispatch(setConfigOnLogin());
      }
    },
    [config, dispatch]
  );

  return (
    <>
      {router.pathname !== "/track-sheet" && <Sidebar />}
      <main className="main-content">
        <div
          className={`position-relative ${
            router.pathname == "/track-sheet" ? "d-none" : ""
          } `}
        >
          <Header settBtnRef={settBtnRef} />
          <>
            {router.pathname !== "/track" &&
              !router.pathname.includes("map") &&
              !router.pathname.includes("support-representative") &&
              !router.pathname.includes("history") && (
                <SubHeader pageName={router.pathname} settBtnRef={settBtnRef} />
              )}
          </>
        </div>
        <VehicleProvider>
          <div
            className={
              "position-relative mt-n5 py-0 " +
              (!router.pathname.includes("track") && "content-inner")
            }
          >
            {children}
            {/*<DefaultRouter />*/}
          </div>
          {/*<Footer/>*/}
        </VehicleProvider>
      </main>
    </>
  );
};

export default Layout;
