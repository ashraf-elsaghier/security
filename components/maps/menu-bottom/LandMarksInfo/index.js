import dynamic from "next/dynamic";
import { lazy } from "react";

const AddModalLandMarks = dynamic(() => import("./AddModalLandMarks"), {
  ssr: false,
});

const ShowLandMarks = lazy(() => import("./ShowLandMarks"));

const LandMarksInfo = ({
  Styles,
  setData_table,
  Data_table,
  locale,
  showViewMarkModal,
  setShowViewMarkModal,
  setViewLandMarkstoggle,
  showAddMarkModal,
  setShowAddMarkModal,
}) => {
  return (
    <>
      {showAddMarkModal && (
        <div
          className={`position-fixed ${Styles.ShowGeofence} ${Styles.trans}`}
          style={{
            left: locale === "ar" ? "20px" : "auto",
            right: locale === "ar" ? "auto" : "20px",
          }}
        >
          <AddModalLandMarks
            showAddMarkModal={showAddMarkModal}
            setData_table={setData_table}
            setShowViewMarkModal={setShowViewMarkModal}
            setShowAddMarkModal={setShowAddMarkModal}
          />
        </div>
      )}

      {showViewMarkModal ? (
        <div
          className={`position-fixed ${Styles.ShowGeofence} ${Styles.show} ${Styles.trans}`}
          style={{
            left: locale === "ar" ? "20px" : "auto",
            right: locale === "ar" ? "auto" : "20px",
          }}
        >
          <ShowLandMarks
            Data_table={Data_table}
            setData_table={setData_table}
            setShowViewMarkModal={setShowViewMarkModal}
            setShowAddMarkModal={setShowAddMarkModal}
            setViewLandMarkstoggle={setViewLandMarkstoggle}
          />
        </div>
      ) : null}
    </>
  );
};

export default LandMarksInfo;
