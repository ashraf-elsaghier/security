import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Edit from "components/management/VehicleManagement/Edit";

const EditVehicle = ({ query }) => {
  const id = query.editId;

  return <Edit model={false} id={id} />;
};

export default EditVehicle;
// translation ##################################
export async function getServerSideProps({ locale, query }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["main", "Management"])),
      query,
    },
  };
}
// translation ##################################
