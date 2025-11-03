import dynamic from "next/dynamic";
import { lazy } from "react";

const AddModalGeofence = dynamic(() => import("./AddModalGeofence"), {
  ssr: false,
});

const EditModalGeofence = lazy(() => import("./EditModalGeofence"));
const ShowGeofence = lazy(() => import("./ShowGeofence"));

const GeofenceInfo = ({
  Styles,
  setData_table,
  ID,
  Data_table,
  locale,
  setID,

  showViewFencModal,
  setShowViewFencModal,
  showAddFencModal,
  setShowAddFencModal,
  showEditFencModal,
  setShowEditFencModal,
}) => {
  return (
    <>
      {showAddFencModal && (
        <div
          className={`position-fixed ${Styles.ShowGeofence} ${Styles.trans}`}
          style={{
            left: locale === "ar" ? "20px" : "auto",
            right: locale === "ar" ? "auto" : "20px",
          }}
        >
          <AddModalGeofence
            showAddFencModal={showAddFencModal}
            setData_table={setData_table}
            setShowViewFencModal={setShowViewFencModal}
            setShowAddFencModal={setShowAddFencModal}
          />
        </div>
      )}

      {showEditFencModal && (
        <div
          className={`position-fixed ${Styles.ShowGeofence} ${Styles.trans}`}
          style={{
            left: locale === "ar" ? "20px" : "auto",
            right: locale === "ar" ? "auto" : "20px",
          }}
        >
          <EditModalGeofence
            ID={ID}
            setData_table={setData_table}
            Data_table={Data_table}
            showEditFencModal={showEditFencModal}
            setShowEditFencModal={setShowEditFencModal}
            setShowViewFencModal={setShowViewFencModal}
          />
        </div>
      )}

      {showViewFencModal ? (
        <div
          className={`position-fixed ${Styles.ShowGeofence} ${Styles.show} ${Styles.trans}`}
          style={{
            left: locale === "ar" ? "20px" : "auto",
            right: locale === "ar" ? "auto" : "20px",
          }}
        >
          <ShowGeofence
            Data_table={Data_table}
            setData_table={setData_table}
            setID={setID}
            setShowViewFencModal={setShowViewFencModal}
            setShowAddFencModal={setShowAddFencModal}
            setShowEditFencModal={setShowEditFencModal}
          />
        </div>
      ) : null}
    </>
  );
};

export default GeofenceInfo;
