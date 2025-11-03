import { useEffect, useState } from "react";
import Tree, { TreeNode } from "rc-tree";
import Image from "next/image";
import "rc-tree/assets/index.css";
import Styles from "styles/Tree.module.scss";
import { useSelector } from "react-redux";
import { GetStatusString, getAllVehs, iconUrl } from "helpers/helpers";
import { Spinner } from "react-bootstrap";
import router from "next/router";
import useTree from "hooks/useTree";
import { useTranslation } from "next-i18next";

const MenuTreeReports = ({
  vehData,
  treeFilter,
  setVehChecked,
  vehChecked,
  fromManagment,
  userId,
}) => {
  const [TreeStyleHeight, setTreeStyleHeight] = useState(0);

  const darkMode = useSelector((state) => state.config.darkMode);

  const { t } = useTranslation();

  const { newTree, defaultExpandedKeys } = useTree(
    vehData,
    userId,
    fromManagment
  );

  const clientHeight = document.getElementById("widget_menu")?.clientHeight;
  useEffect(() => {
    const setSize = () =>
      clientHeight && setTreeStyleHeight(clientHeight / 1.4);
    window.addEventListener("resize", setSize);
    setSize();
  }, [clientHeight]);

  const onCheck = (selectedKeys, info) => {
    const selectedNodes = vehData.filter(
      (v) =>
        selectedKeys.includes(`${v.VehicleID}`) ||
        selectedKeys.includes(`${v.SerialNumber}`)
    );
    if (!treeFilter) {
      setVehChecked((prev) =>
        info?.checked
          ? selectedNodes
          : prev.filter((item) =>
            selectedNodes.some((obj) => obj.VehicleID === item.VehicleID)
          )
      );
    } else {
      let selectedNodesChildren = info?.node?.data?.children;
      let unselectedNodes = selectedNodesChildren
        ? getAllVehs(selectedNodesChildren)
        : [info?.node?.data];
      setVehChecked((prev) =>
        // when select a node || a group (filter case)
        info?.checked
          ? [...new Set([...prev, ...selectedNodes])]
          : // when deselect a node || a group (filter case)
          prev.filter(
            (prevNode) =>
              !unselectedNodes.some(
                (obj) => obj.VehicleID === prevNode.VehicleID
              )
          )
      );
    }
  };
  const loop = (data) =>
    data?.map((item) => {
      if (item?.children) {
        return (
          <TreeNode
            key={`${item.title === "All" ? "All" : item?.ID}`}
            icon={<i className={Styles.cars__icon} />}
            data={item}
            title={
              <span
                className="d-flex align-items-center title-all"
                style={{ fontSize: "12px" }}
              >
                {item?.title}

                <span className="badge bg-secondary px-1 mx-2">
                  {item?.title === t("All")
                    ? vehData?.length
                    : getAllVehs(item?.children).length}
                </span>
              </span>
            }
          >
            {loop(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          style={{ height: "30px", marginRight: "10px" }}
          key={
            router.pathname.includes("reports")
              ? item?.SerialNumber
              : `${item?.VehicleID}`
          }
          data={item}
          icon={
            <div
              className={`position-relative  ${darkMode ? "bg-primary p-1" : "bg-transparent p-0"
                } d-flex justify-content-center  rounded-1 `}
              style={{ padding: "3px" }}
            >
              <Image
                src={iconUrl(item?.configJson, "/assets/images/cars/car0/", 0)}
                width={11}
                height={20}
                alt={GetStatusString(item?.VehicleStatus)}
                title={GetStatusString(item?.VehicleStatus)}
              />
            </div>
          }
          isLeaf={true}
          title={
            <div
              className={`d-flex align-items-center ${treeFilter && "text-danger"
                }`}
            >
              <div
                className="me-1"
                title={item?.DisplayName}
                style={{ fontSize: "10px" }}
              >
                {item?.DisplayName}
              </div>
              <div
                title={item?.DisplyName}
                className="fw-bold me-1"
                style={{ fontSize: "11px" }}
              >
                ({item?.SerialNumber || item?.PlateNumber})
              </div>
            </div>
          }
        />
      );
    });
  return (
    <div className="position-relative">
      <div style={{ minHeight: "25vh", maxWidth: "auto" }} id="menu-scrollbar">
        <div
          className={`tree_root ${darkMode && Styles.dark}`}
          style={{ height: TreeStyleHeight }}
        >
          {newTree?.length > 0 ? (
            router.pathname.includes("reports") ? (
              <Tree
                checkable
                selectable={false}
                showLine={true}
                onCheck={onCheck}
                height={TreeStyleHeight}
                defaultExpandAll={false}
                autoExpandParent={false}
                checkedKeys={
                  vehChecked ? [...vehChecked?.map((v) => v?.SerialNumber)] : []
                }
                defaultExpandedKeys={defaultExpandedKeys}
              >
                {loop(newTree)}
              </Tree>
            ) : (
              <Tree
                checkable
                selectable={false}
                showLine={true}
                onCheck={onCheck}
                height={TreeStyleHeight}
                defaultExpandAll={false}
                autoExpandParent={false}
                defaultExpandedKeys={defaultExpandedKeys}
                checkedKeys={[...vehChecked?.map((v) => `${v?.VehicleID}`)]}
              >
                {loop(newTree)}
              </Tree>
            )
          ) : (
            <div className="d-flex align-items-center justify-content-center h-100 position-absolute w-100 start-50 translate-middle-x ">
              <Spinner animation="border" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default MenuTreeReports;
