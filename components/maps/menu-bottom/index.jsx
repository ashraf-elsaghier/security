import { useRouter } from "next/router";

import { useState, Suspense, memo } from "react";
import Styles from "styles/MenuBottom.module.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import dynamic from "next/dynamic";

import Btns from "./Btns";
const GeofenceInfo = dynamic(() => import("./GeofenceInfo"), {
  ssr: false,
});
const LandMarksInfo = dynamic(() => import("./LandMarksInfo"), {
  ssr: false,
});
const WarningsInfo = dynamic(() => import("./WarningsInfo"), {
  ssr: false,
});
const CalculateDistance = dynamic(() => import("./CalculateDistance"), {
  ssr: false,
});

const MenuBottom = ({
  clusterToggle,
  setclusterToggle,
  setSelectedVehicles,
}) => {
  const { locale } = useRouter();
  const [show, setShow] = useState(true);

  const [locateToggle, setLocateToggle] = useState(false);

  const [CalculateDistanceToggle, setCalculateDistanceToggle] = useState(false);
  const [geofencesViewToggle, setGeofencesViewToggle] = useState(false);

  // Warnings
  const [showViewWarningModal, setShowViewWarningModal] = useState(false);
  const [showAddWarningModal, setShowAddWarningModal] = useState(false);
  const [Data_tableWarnings, setData_tableWarnings] = useState([]);

  // GeofenceInfo
  const [showViewFencModal, setShowViewFencModal] = useState(false);
  const [showEditFencModal, setShowEditFencModal] = useState(false);
  const [ID, setID] = useState(0);
  const [showAddFencModal, setShowAddFencModal] = useState(false);
  const [Data_tableFenc, setData_tableFenc] = useState([]);

  // LandMarksInfo
  const [showViewMarkModal, setShowViewMarkModal] = useState(false);
  const [showAddMarkModal, setShowAddMarkModal] = useState(false);
  const [Data_tableMarks, setData_tableMarks] = useState([]);

  const [viewLandMarkstoggle, setViewLandMarkstoggle] = useState(false);

  return (
    <>
      <div
        className={`${Styles.menu_bottom_main} d-flex position-absolute `}
        style={{
          zIndex:
            showViewFencModal || showViewMarkModal || showViewWarningModal
              ? 1003
              : 1000,
        }}
      >
        <button
          type="button"
          className={`${Styles.show_btn} ${
            show && Styles.active
          } border-0 mx-1 p-2`}
          onClick={() => setShow((prev) => !prev)}
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
        <Suspense fallback={"loading"}>
          <Btns
            // GeofenceInfo
            setGeofencesViewToggle={setGeofencesViewToggle}
            setData_tableFenc={setData_tableFenc}
            setShowViewFencModal={setShowViewFencModal}
            geofencesViewToggle={geofencesViewToggle}
            Data_tableFenc={Data_tableFenc}
            // LandMarksInfo
            setViewLandMarkstoggle={setViewLandMarkstoggle}
            setData_tableMarks={setData_tableMarks}
            setShowViewMarkModal={setShowViewMarkModal}
            viewLandMarkstoggle={viewLandMarkstoggle}
            Data_tableMarks={Data_tableMarks}
            showViewMarkModal={showViewMarkModal}
            // Warnings
            showViewWarningModal={showViewWarningModal}
            setShowViewWarningModal={setShowViewWarningModal}
            //// cluster
            clusterToggle={clusterToggle}
            setclusterToggle={setclusterToggle}
            //// locate
            locateToggle={locateToggle}
            setLocateToggle={setLocateToggle}
            /// CalculateDistance
            setCalculateDistanceToggle={setCalculateDistanceToggle}
            CalculateDistanceToggle={CalculateDistanceToggle}
            //// others
            show={show}
            // L={L}
            showViewFencModal={showViewFencModal}
            setSelectedVehicles={setSelectedVehicles}
          />
        </Suspense>
        {CalculateDistanceToggle && (
          <Suspense fallback={"loading"}>
            <CalculateDistance />
          </Suspense>
        )}
        <Suspense fallback={"loading"}>
          <GeofenceInfo
            Styles={Styles}
            setData_table={setData_tableFenc}
            ID={ID}
            Data_table={Data_tableFenc}
            locale={locale}
            setID={setID}
            showViewFencModal={showViewFencModal}
            setShowViewFencModal={setShowViewFencModal}
            showAddFencModal={showAddFencModal}
            setShowAddFencModal={setShowAddFencModal}
            showEditFencModal={showEditFencModal}
            setShowEditFencModal={setShowEditFencModal}
          />
        </Suspense>

        <Suspense fallback={"loading"}>
          <LandMarksInfo
            Styles={Styles}
            setData_table={setData_tableMarks}
            Data_table={Data_tableMarks}
            locale={locale}
            showViewMarkModal={showViewMarkModal}
            setShowViewMarkModal={setShowViewMarkModal}
            setViewLandMarkstoggle={setViewLandMarkstoggle}
            showAddMarkModal={showAddMarkModal}
            setShowAddMarkModal={setShowAddMarkModal}
          />
        </Suspense>
        <Suspense fallback={"loading"}>
          <WarningsInfo
            Styles={Styles}
            setData_table={setData_tableWarnings}
            Data_table={Data_tableWarnings}
            locale={locale}
            showViewWarningModal={showViewWarningModal}
            setShowViewWarningModal={setShowViewWarningModal}
            setShowAddWarningModal={setShowAddWarningModal}
            showAddWarningModal={showAddWarningModal}
            setShowAddMarkModal={setShowAddMarkModal}
          />
        </Suspense>
      </div>
    </>
  );
};

export default memo(MenuBottom);
