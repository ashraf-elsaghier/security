import axios from "axios";
import { groupReportsByCategory } from "helpers/helpers";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, Spinner, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import * as _ from "lodash";

const AssignReports = ({ handleModel, reportsData, userId }) => {
  const groupReports = groupReportsByCategory(reportsData);
  const { t } = useTranslation(["reports", "Management", "main"]);
  const [reportsDataList, setReportsDataList] = useState(groupReports);
  const [selectAll, setSelectAll] = useState(false);
  const categories = Object.keys(reportsDataList ?? {});
  const { locale: activeLocale } = useRouter();
  const handleSelectAll = (e) => {
    const { checked } = e.target;
    setSelectAll(checked);
    const updatedReports = groupReportsByCategory(reportsData, checked);
    setReportsDataList(updatedReports);
  };
  const checkAllReportWithSameCategoryHandler = (e) => {
    const { name: category, checked } = e.target;
    if (checked) {
      setReportsDataList((prev) => {
        const updatedReportsDataList = {
          ...prev,
          [category]: prev[category].map((item) => ({
            ...item,
            isChecked: true,
          })),
        };
        return updatedReportsDataList;
      });
    } else {
      setReportsDataList((prev) => ({
        ...prev,
        [category]: prev[category].map((item) => ({
          ...item,
          isChecked: false,
        })),
      }));
    }
  };
  const checkReportNameHandler = (e) => {
    const { name: category, checked, id } = e.target;
    const updatedCategoryList = reportsDataList[category].map((item) => {
      if (item.ReportId == id) {
        return { ...item, isChecked: checked };
      } else {
        return item;
      }
    });
    setReportsDataList((prev) => ({
      ...prev,
      [category]: updatedCategoryList,
    }));
  };
  const getSelectedIds = (data) => {
    if (!data || Object.keys(data).length == 0) return [];
    return Object.keys(data).reduce((acc, category) => {
      const checkedReports = data[category]
        .filter((report) => report.isChecked)
        .map((item) => item.ReportId);
      if (checkedReports.length) {
        acc.push(...checkedReports);
      }
      return acc;
    }, []);
  };
  const originalState = useRef(reportsDataList);
  const hasIsCheckedChanged = (newState, oldState) => {
    return !_.isEqual(
      _.mapValues(newState, (category) =>
        category.map((report) => report.isChecked)
      ),
      _.mapValues(oldState, (category) =>
        category.map((report) => report.isChecked)
      )
    );
  };
  const isChanged = hasIsCheckedChanged(reportsDataList, originalState.current);
  const checkedReportsIds = getSelectedIds(reportsDataList);
  const [sumbitLoading, setSubmitLoading] = useState(false);
  const submitAssignedReportsHandler = async () => {
    try {
      setSubmitLoading(true);
      const res = await axios.post("dashboard/management/users/access", {
        userId,
        reportIds: checkedReportsIds,
        hasAccess: true,
      });
      setSubmitLoading(false);

      handleModel();
      toast.success("reports updated successfully");
    } catch (error) {
      setSubmitLoading(false);

      console.log(error);
    }
  };

  const maxLengthOfCategoryList = categories.map(
    (category) => reportsDataList[category].length
  );

  const [getCheckedReportsLoading, setGetCheckedReportsLoading] =
    useState(false);
  const mergeStates = useCallback((oldState, newState) => {
    const updatedState = { ...oldState };
    Object.keys(newState).forEach((category) => {
      const oldReports = updatedState[category];
      if (!oldReports) return;
      const reportMap = new Map(
        oldReports.map(({ ReportId }, index) => [ReportId, index])
      );
      newState[category].forEach((newReport) => {
        const index = reportMap.get(newReport.ReportId);
        if (index !== undefined) {
          updatedState[category][index] = {
            ...oldReports[index],
            isChecked: newReport.isChecked,
          };
        }
      });
    });
    return updatedState;
  }, []);

  const getCheckedReportsIds = async () => {
    try {
      setGetCheckedReportsLoading(true);
      const res = await axios(
        `dashboard/management/users/accessedReports/${userId}`
      );
      const groupedReports = groupReportsByCategory(res?.data?.reports, true);
      setReportsDataList((prevState) => {
        return mergeStates({ ...prevState }, groupedReports);
      });
      setGetCheckedReportsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const allChecked = Object.values(reportsDataList).flat();
  useEffect(() => {
    const allCheckedReports = allChecked.every((report) => report.isChecked);
    setSelectAll(allCheckedReports);
  }, [allChecked]);

  useEffect(() => {
    getCheckedReportsIds();
  }, []);

  return getCheckedReportsLoading ? (
    <div className="d-flex justify-content-center">
      <Spinner className="mx-auto" />
    </div>
  ) : (
    <div className="assigned-reports">
      {categories.length ? (
        <>
          <div className=" d-inline-block">
            <label className="d-flex gap-2 my-3 py-1 px-2 text-capitalize  select-all-checkbox ">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
              {t("select_all_reports")}
            </label>
          </div>
          <Table className="w-100" striped bordered responsive>
            <thead>
              <tr>
                {categories.map((category) => (
                  <th key={category} className="  p-0 table-head">
                    <label className="d-flex gap-2 py-3 px-2 text-capitalize">
                      <input
                        type="checkbox"
                        onChange={checkAllReportWithSameCategoryHandler}
                        name={category}
                        checked={reportsDataList?.[category].every(
                          (item) => item.isChecked
                        )}
                      />
                      {t(category)} {activeLocale == "en" && "Rep."}
                    </label>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: Math.max(...maxLengthOfCategoryList) }).map(
                (_, rowIndex) => (
                  <tr key={rowIndex}>
                    {categories.map((category) => {
                      const report = reportsDataList[category][rowIndex];
                      return (
                        <td key={category} className="  p-0   ">
                          {report ? (
                            <label className=" w-100 d-flex align-items-center h-100 p-2 ">
                              <input
                                type="checkbox"
                                checked={report.isChecked}
                                name={category}
                                id={report.ReportId}
                                onChange={checkReportNameHandler}
                              />
                              <span className="  text-wrap mx-2 text-start">
                                {t(report.ReportName)}
                              </span>
                            </label>
                          ) : (
                            <div>-</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                )
              )}
            </tbody>
          </Table>
          <div className="d-flex gap-3 justify-content-center my-3">
            <Button
              className="px-5 py-2 btn "
              onClick={submitAssignedReportsHandler}
              disabled={!isChanged || sumbitLoading}
            >
              {sumbitLoading && <Spinner size="sm" className="me-1" />}
              {t("assign_reports")}
            </Button>
          </div>
        </>
      ) : (
        <p className="text-danger text-center">there is no reports to assign</p>
      )}
    </div>
  );
};

export default AssignReports;
