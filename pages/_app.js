import "../styles/globals.scss";
import store from "../lib";
import { Provider } from "react-redux";
import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import Router from "next/router";
import SSRProvider from "react-bootstrap/SSRProvider";
import NextNprogress from "nextjs-progressbar";
import { appWithTranslation } from "next-i18next";
import { ThemeProvider } from "react-bootstrap";
import AuthGuard from "../components/authGuard";
import { GTMPageView } from "../utils/gtm.ts";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import "../helpers/plugins/fullscreen/Control.FullScreen.css";
import "../helpers/plugins/markercluster/MarkerCluster.css";
import "../helpers/plugins/markercluster/MarkerCluster.Default.css";
import "rsuite/dist/rsuite.min.css";
import "../styles/scss/custom/plugins/Resizebox.css";
import { ToastContainer } from "react-toastify";
import { useSession } from "next-auth/client";

import TagManager from "react-gtm-module";

function MyApp({ Component, pageProps }) {
  const [, setLoading] = useState(false);
  const [session] = useSession();
  const settBtnRef = useRef();

  useEffect(() => {
    const handleStart = (url) => {
      url !== Router.pathname ? setLoading(true) : setLoading(false);
    };
    const handleComplete = () => setLoading(false);

    Router.events.on("routeChangeStart", handleStart);
    Router.events.on("routeChangeComplete", handleComplete);
    Router.events.on("routeChangeError", handleComplete);
    const setSize = function () {
      const docStyle = document.documentElement.style;
      window.innerWidth < 425
        ? (docStyle.fontSize = `${((window.innerWidth * 0.1122) / 3).toFixed(
            1
          )}px`)
        : (docStyle.fontSize = "16px");
    };
    setSize();
    window.addEventListener("resize", setSize);
    window.addEventListener("orientationchange", setSize);

    const handleRouteChange = (url) => GTMPageView(url);
    Router.events.on("routeChangeComplete", handleRouteChange);

    const gtmDataLayer = {
      userId: session?.user?.user?.id ?? "Guest",
      userProject: "FMS",
      page: "index",
    };
    const gtmArgs = {
      gtmId: "GTM-5CZKSQH",
      dataLayer: gtmDataLayer,
      dataLayerName: "PageDataLayer",
      auth: "11BzXoFtHApa1UPqFsboNQ",
      preview: "env-1",
    };
    TagManager.initialize(gtmArgs);

    return () => {
      Router.events.off("routeChangeComplete", handleRouteChange);
      // Router.events.off("routeChangeStart", handleStart);
      Router.events.off("routeChangeComplete", handleComplete);
      // Router.events.off("routeChangeError", handleComplete);

      // window.removeEventListener("resize", setSize);
      // window.removeEventListener("orientationchange", setSize);
    };
  }, []);

  return (
    <ThemeProvider>
      <SSRProvider>
        <Provider store={store}>
          <NextNprogress
            color="#0E6395"
            startPosition={0.3}
            stopDelayMs={200}
            height={3}
            showOnShallow={true}
          />
          <Script
            defer
            src="https://maps.googleapis.com/maps/api/js?key=AIzaSyC-qWPc8xQrA-D8TSiNBpjLYBBsS29oU0U&callback=Function.prototype"></Script>

          <AuthGuard settBtnRef={settBtnRef}>
            <ToastContainer
              position="top-center"
              autoClose={4000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              pauseOnFocusLoss
              draggable
              pauseOnHover
            />
            <Component {...pageProps} settBtnRef={settBtnRef} />
            {/* {process.env.NODE_ENV === "production" && (
              <div id="development">{`You may find some mistakes because it's still under development`}</div>
            )} */}
          </AuthGuard>
        </Provider>
      </SSRProvider>
    </ThemeProvider>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["main"])),
    },
  };
}
// export default MyApp
export default appWithTranslation(MyApp);
