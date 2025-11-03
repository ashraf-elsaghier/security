import dynamic from "next/dynamic";
import { lazy } from "react";

const AddModalWarnings = dynamic(() => import("./AddModalWarnings"), {
  ssr: false,
});

const ShowWarnings = lazy(() => import("./ShowWarnings"));

const WarningsInfo = ({
  Styles,
  setData_table,
  Data_table,
  locale,
  //////
  showViewWarningModal,
  setShowViewWarningModal,
  setShowAddWarningModal,
  showAddWarningModal,
}) => {
  return (
    <>
      {showAddWarningModal && (
        <div
          className={`position-fixed ${Styles.ShowGeofence} ${Styles.trans}`}
          style={{
            left: locale === "ar" ? "20px" : "auto",
            right: locale === "ar" ? "auto" : "20px",
          }}
        >
          <AddModalWarnings
            setData_table={setData_table}
            showAddWarningModal={showAddWarningModal}
            setShowViewWarningModal={setShowViewWarningModal}
            setShowAddWarningModal={setShowAddWarningModal}
          />
        </div>
      )}

      {showViewWarningModal ? (
        <div
          className={`position-fixed ${Styles.ShowGeofence} ${Styles.show} ${Styles.trans}`}
          style={{
            left: locale === "ar" ? "20px" : "auto",
            right: locale === "ar" ? "auto" : "20px",
          }}
        >
          <ShowWarnings
            Data_table={Data_table}
            setData_table={setData_table}
            setShowViewWarningModal={setShowViewWarningModal}
            setShowAddWarningModal={setShowAddWarningModal}
          />
        </div>
      ) : null}
    </>
  );
};

export default WarningsInfo;
