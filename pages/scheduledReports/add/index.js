import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import CustomizedSteppers from "components/stepper";

const AddScheduledReports = () => {
  const { t } = useTranslation(["scheduledReports", "common", "main"]);
  return (
    <div className="container mt-5">
      <CustomizedSteppers />
    </div>
  );
};

export default AddScheduledReports;

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
