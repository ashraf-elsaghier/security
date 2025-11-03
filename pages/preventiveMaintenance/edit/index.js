import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Edit from "components/preventiveMaintenance/Edit";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useTranslation } from "next-i18next";

const EditPreventive = () => {
  const [optionsMaintenanceType, setOptionsMaintenanceType] = useState({});

  const router = useRouter();
  const { id } = router.query;
  const { t } = useTranslation(["preventiveMaintenance"]);

  // data for select boxes
  const fetchPeriodTypes = async () => {
    try {
      const response = await axios.get(
        "dashboard/management/maintenance/types"
      );

      let periodOptions = {};
      response.data.forEach((ele) => {
        periodOptions[`${ele.ID}`] = ele.Name;
      });

      setOptionsMaintenanceType(periodOptions);
    } catch (error) {
      toast.error("cannot fetch period types right now!");
    }
  };
  useEffect(() => {
    fetchPeriodTypes();
  }, []);
  return (
    <>
      {Object.keys(optionsMaintenanceType).length > 0 && (
        <Edit
          model={false}
          id={id}
          optionsMaintenanceType={optionsMaintenanceType}
        />
      )}
    </>
  );
};

export default EditPreventive;

// translation ##################################
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "main",
        "preventiveMaintenance",
      ])),
    },
  };
}
// translation ##################################
