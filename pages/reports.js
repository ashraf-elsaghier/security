import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import NoReport from "icons/NoReport";
import ReportsContent from "components/history/ReportsContent";
import { useSelector } from "react-redux";
import { useSession } from "next-auth/client";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import axios from "axios";

const Reports = () => {
  const [treeData, setTreeData] = useState([]);
  const [dataSideBar, setDataSideBar] = useState([]);
  const [error, setError] = useState(null);

  const VehFullData = useSelector((state) => state.streamData.VehFullData);
  const { darkMode } = useSelector((state) => state.config);

  const [session] = useSession();

  useEffect(() => {
    setTreeData(VehFullData);
  }, [VehFullData]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios(`/dashboard/management/users/reports`);

        const reportData = await response.data;
        const groupedReports = {};

        reportData?.reports.forEach((report, index) => {
          const {
            ReportCategory,
            imgGreen,
            imgWhite,
            ReportName,
            ReportApi,
            DateStatus,
            ReportId,
          } = report;

          if (!groupedReports[ReportCategory]) {
            groupedReports[ReportCategory] = {
              id: index + 1,
              imgGreen,
              imgWhite,
              title: `${ReportCategory}_reports_key`,
              subTitle: [],
            };
          }

          groupedReports[ReportCategory].subTitle.push({
            id: ReportId,
            name: ReportName,
            api: ReportApi,
            dateStatus: DateStatus ? "two" : "one",
            pagination: true,
          });
        });

        const reportsData = Object.values(groupedReports).sort(
          (a, b) => a.id - b.id
        );
        reportsData.forEach((report) =>
          report.subTitle.sort((a, b) => a.id - b.id)
        );

        setDataSideBar(reportsData);
      } catch (err) {
        console.error("Error fetching report data:", err);
        setError(err.message);
      }
    };

    fetchReports();
  }, [session]);

  if (error || !dataSideBar?.length) {
    return (
      <Container
        className="mt-5 p-0 d-flex justify-content-center w-50"
        style={{ height: "500px" }}
      >
        <div className="text-center mt-5">
          <NoReport
            mainColor={darkMode ? "#41414B" : "#D9D9DE"}
            secondaryColor={darkMode ? "#91939f" : "#91939F"}
            shadowMainColor={darkMode ? "#22273899" : "#d9d9de"}
            shadowSecondaryColor={darkMode ? "#13151f00" : "#fff"}
          />
          <h6 className="fs-5 mb-1">There are no reports assigned to you</h6>
          <p className="fs-6">At this time, there are no reports available.</p>
        </div>
      </Container>
    );
  }

  return (
    <div id="reports">
      <ReportsContent
        dataSideBar={dataSideBar}
        treeData={treeData}
        setTreeData={setTreeData}
      />
    </div>
  );
};

export default Reports;

export async function getServerSideProps(context) {
  return {
    props: {
      locale: context.locale,
      ...(await serverSideTranslations(context.locale, [
        "reports",
        "preventiveMaintenance",
        "Table",
        "main",
        "Tour",
        "common",
      ])),
    },
  };
}
