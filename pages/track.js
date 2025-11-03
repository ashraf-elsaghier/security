import { Suspense, useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";
import useStreamDataState from "hooks/useStreamDataState";
import Actions from "components/track/Actions";
import ConfigPopup from "components/track/ConfigPopup";
import { Button } from "react-bootstrap";
import { updateStRunning } from "lib/slices/StreamData";
import { changeRowDataKeys, convertJsonToExcel } from "../helpers/helpers";
import MenuBottom from "components/maps/menu-bottom/index";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import style from "styles/scss/custom/components/tour-step/tourStep.module.scss";
import Joyride from "react-joyride";
import { getSession, signOut } from "next-auth/client";
import useJoyride from "hooks/useJoyride";
import { fetchDriverData } from "services/driver";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { encryptName } from "helpers/encryptions";

const WidgetMenu = dynamic(() => import("components/maps/WidgetMenu"), {
  loading: () => <header />,
  // ssr: false,
});
const MapWithNoSSR = dynamic(() => import("components/maps/vector"), {
  ssr: false,
});

const Map = () => {
  const dispatch = useDispatch();
  const { myMap } = useSelector((state) => state.mainMap);
  const running = useSelector((state) => state.streamData.running);
  const darkMode = useSelector((state) => state.config.darkMode);
  const VehFullData = useSelector((state) => state.streamData.VehFullData);

  const { t } = useTranslation("Tour");
  const router = useRouter();

  const memoizedMyMap = useMemo(() => myMap, [myMap]);

  const [showConfigPopup, setShowConfigPopup] = useState(false);
  const [clusterToggle, setclusterToggle] = useState(false);
  const [allTreeData, setAllTreeData] = useState([]);
  const [selectedVehicles, setSelectedVehicles] = useState([]);
  const { trackStreamLoader } = useStreamDataState();
  // joyride tour
  const {
    handleToggleMinuTrack,
    handleJoyrideCallback,
    steps,
    toggleMinuTrack,
    stepIndex,
    tourState,
  } = useJoyride();

  useEffect(() => {
    const { vehData } =
      JSON.parse(localStorage.getItem(encryptName("userData")) ?? "[]") || [];
    setAllTreeData(VehFullData || vehData);

    return () => {
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .getRegistrations()
          .then(function (registrations) {
            for (let registration of registrations) {
              registration.unregister();
            }
          });
      }
    };
  }, [VehFullData]);

  useEffect(() => {
    if (memoizedMyMap && !running) {
      memoizedMyMap?.deselectAll();
      trackStreamLoader();
      dispatch(updateStRunning());
    }
  }, [memoizedMyMap]);

  useEffect(() => {
    const htmlTag = document.getElementsByTagName("html")[0];
    darkMode
      ? htmlTag.setAttribute("darkMode", true)
      : htmlTag.setAttribute("darkMode", false);
  }, [darkMode]);

  const handleDownLoadDataVehs = () => {
    const ids = document
      ?.getElementById("downLoadDataVehs")
      ?.getAttribute("data-id")
      .split(",")
      .map((item) => +item);

    const allData = allTreeData?.filter((item) =>
      ids.includes(+item.VehicleID)
    );

    convertJsonToExcel(changeRowDataKeys(allData), "selectedVehicles");
  };

  /// check for the driver Info
  const handleDriverInfo = async () => {
    const id = document.getElementById("DriverName-id").getAttribute("data-id");
    try {
      const driverInfo = await fetchDriverData(id);

      if (driverInfo?.driver?.length > 0 && driverInfo?.driver[0].VehicleID) {
        router.push(`/driver/${id}`);
      } else {
        toast.info("There is no data for this driver");
      }
    } catch (error) {
      if (error?.response?.data?.message == "User not found") {
        signOut();
      }
    }
  };

  return (
    <div id="map" className="mt-5 position-relative">
      <Joyride
        steps={steps}
        continuous
        callback={handleJoyrideCallback}
        run={tourState}
        stepIndex={stepIndex}
        showSkipButton
        locale={{
          skip: <span className={style["skip-tour"]}>{t("skip_tour")}</span>,
          back: <span className={style["skip-tour"]}>{t("back")}</span>,
          next: <span>{t("next")}</span>,
          last: <span>{t("last")}</span>,
        }}
        styles={{
          options: {
            primaryColor: "#2C7BC6",
            overlayColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 50000,
            width: "379px",
            backgroundColor: "#E0EAE9",
          },
        }}
      />

      <MapWithNoSSR myMap={memoizedMyMap} />

      <WidgetMenu
        selectedVehicles={selectedVehicles}
        setSelectedVehicles={setSelectedVehicles}
        toggleMinuTrack={toggleMinuTrack}
        handleToggleMinuTrack={handleToggleMinuTrack}
        setclusterToggle={setclusterToggle}
        allTreeData={allTreeData}
        setAllTreeData={setAllTreeData}
      />

      <MenuBottom
        setclusterToggle={setclusterToggle}
        clusterToggle={clusterToggle}
        setSelectedVehicles={setSelectedVehicles}
      />

      {/* this btn is related to leafletchild component in (components/maps/leafletchild) in return in itemConfig function */}
      {/* Click on ctrl and click on this link */}
      {/* file:///C:/Users/Almodather/Desktop/projects/saferoad_fms_web/components/maps/leafletchild.js#L1304 */}
      <Button
        id="DriverName-id"
        className="d-none"
        onClick={handleDriverInfo}></Button>

      {/* leafletchild actions */}

      <Actions
        allTreeData={allTreeData}
        setSelectedVehicles={setSelectedVehicles}
        selectedVehicles={selectedVehicles}
        setAllTreeData={setAllTreeData}
      />

      {/* this btn is related to leafletchild component in (components/maps/leafletchild) on var container  */}
      {/* Click on ctrl and click on this link */}
      {/* file:///C:/Users/Almodather/Desktop/projects/saferoad_fms_web/components/maps/leafletchild.js#L1380 */}

      <Suspense fallback={"loading"}>
        <Button
          id="ConfigPopup"
          className="d-none"
          onClick={() => setShowConfigPopup(true)}></Button>

        {showConfigPopup ? (
          <ConfigPopup
            vehChecked={selectedVehicles}
            show={showConfigPopup}
            setShow={setShowConfigPopup}
          />
        ) : null}
      </Suspense>

      {/* downLoadDataVehs */}
      <Suspense fallback={"loading"}>
        <Button
          id="downLoadDataVehs"
          className="d-none"
          onClick={() => handleDownLoadDataVehs()}></Button>
      </Suspense>
    </div>
  );
};
export default Map;
// translation ##################################
export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  if (session?.user?.user?.role == "support") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      ...(await serverSideTranslations(context.locale, [
        "main",
        "common",
        "Tour",
        "Dashboard",
        "Table",
      ])),
    },
  };
}
