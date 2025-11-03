import { useState, useEffect } from "react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import CustomizedSteppers from "components/stepper";
import { useRouter } from "next/router";
import { fetchScheduledReport } from "services/scheduledReports";
import { toast } from "react-toastify";

const EditScheduledReports = () => {
  const router = useRouter();
  const { id } = router.query;

  const [reportData, setReportData] = useState({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const response = await fetchScheduledReport(id);
        setReportData(response.report[0]);
      } catch (error) {
        toast.error("error fetching report data");
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
    return () => {
      setReportData([]);
    };
  }, [id]);

  const { t } = useTranslation(["scheduledReports", "common", "main"]);
  return (
    <div className="container mt-5">
      {!loading && reportData && <CustomizedSteppers reportData={reportData} />}
    </div>
  );
};

export default EditScheduledReports;

// translation ##################################
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        "scheduledReports",
        "common",
        "main",
      ])),
    },
  };
}
// translation ##################################
export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
