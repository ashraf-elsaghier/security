import Tree, { TreeNode } from "rc-tree";
import "rc-tree/assets/index.css";
import Styles from "styles/Tree.module.scss";
import { useSelector } from "react-redux";
import { useTranslation } from "next-i18next";
import TreeNodeItem from "./TreeNodeItem";
import StatusIcon from "./StatusIcon";
import { toast } from "react-toastify";
import useTree from "hooks/useTree";
import { getAllVehs } from "helpers/helpers";
import { memo, useEffect, useRef, useState } from "react";
import StreamHelper from "helpers/streamHelper";
import { useVehicleContext } from "context/VehiclesContext";
import NotifyModal from "components/Modals/NotifyModal";

const MenuTree = memo(
  ({
    setSelectedVehicles,
    setclusterToggle,
    setLoading,
    selectedVehicles,
    allTreeData,
    vehicleIcon,
    ToggleConfig,
    treeFilter,
    filterBy,
  }) => {
    const { myMap } = useSelector((state) => state.mainMap);
    const darkMode = useSelector((state) => state.config.darkMode);
    const { notConnectedVehicles, unassignedVehicles } = useSelector(
      (state) => state.streamData
    );
    const { t } = useTranslation();
    const { newTree, defaultExpandedKeys } = useTree(allTreeData);
    const { aggregate, isBefore } = StreamHelper();
    const markersRef = useRef({});
    const { getVehicleBySerialNumber } = useVehicleContext();
    const socket = useSelector((state) => state.socket.socket);
    const [unassignedVehicle, setUnassignedVehicle] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleClose = () => {
      setSelectedVehicles([]);
      setShowModal(false);
      setUnassignedVehicle(null);
    };
    useEffect(() => {
      if (!socket) return;
      if (selectedVehicles.length) {
        markersRef.current = Object.fromEntries(
          selectedVehicles.map((marker) => {
            const latestUpdate = getVehicleBySerialNumber(marker.SerialNumber);
            const newData = {
              ...latestUpdate,
              RecordDateTime: new Date(
                latestUpdate?.RecordDateTime.toString() + "z"
              ),
            };
            return [marker.SerialNumber, newData];
          })
        );
        const updateVehicleData = (data) => {
          if (!data) return;
          const marker = markersRef.current[data.SerialNumber];
          if (!marker) return;
          const dataDate = new Date(data.RecordDateTime.toString() + "z");
          const currentDate = new Date(marker.RecordDateTime);
          if (isBefore(dataDate, currentDate)) return;
          marker.RecordDateTime = data.RecordDateTime.toString() + "z";
          const newData = aggregate(data, marker);
          markersRef.current[data.SerialNumber] = newData;
          myMap.UpdateMarker(newData, { doRezoom: false }, false);
        };
        socket.on("update", updateVehicleData);
        return () => {
          if (socket) socket.off("update", updateVehicleData);
        };
      }
    }, [selectedVehicles, myMap, aggregate, isBefore]);

    const paginateVehicles = async (vehicles) => {
      vehicles.map;
      if (vehicles.length < 2000) {
        setTimeout(
          () => myMap.pinGroup(vehicles, { doRezoom: vehicles.length < 1000 }),
          0
        );
        return;
      }
      setLoading(true);
      // force enable cluster for better performance
      myMap.setCluster(true);
      const limit = 1000;
      const totalPages = Math.ceil(vehicles.length / limit);
      let processedPages = 0;
      for (let i = 0; i < vehicles.length; i += limit) {
        await new Promise((resolve) => {
          setTimeout(async () => {
            const page = vehicles.slice(i, i + limit);
            await myMap.pinGroup(page, { doRezoom: false });
            processedPages++;
            if (processedPages === totalPages) {
              setLoading(false);
            }
            resolve();
          }, 20);
        });
      }
      toast.dismiss();
    };
    const onCheck = (selectedKeys, info) => {
      const selectedNodes = allTreeData.filter((v) =>
        selectedKeys.includes(`${v.SerialNumber}`)
      );
      let selectedNodesChildren = info?.node?.data?.children;
      let unselectedNodes = selectedNodesChildren
        ? getAllVehs(selectedNodesChildren)
        : [info?.node?.data];

      if (!selectedKeys.length && !selectedVehicles.length) {
        myMap.deselectAll();
        return;
      } else {
        if (info.checked) {
          //>>>>>>>>>>>>>>>>>>>>>>>>>>>>>FILTER>>>>>>>>>>>>>>>>>>>>>>>>>>>>> return items not exist at prev state
          setSelectedVehicles((prev) =>
            !treeFilter && filterBy !== "Speed"
              ? selectedNodes
              : [
                  ...prev,
                  ...selectedNodes.filter((node) =>
                    prev.every((child) => child.VehicleID !== node.VehicleID)
                  ),
                ]
          );
        } else {
          unselectedNodes.forEach((item) => {
            myMap.unpin(item.VehicleID, { doRezoom: false });
          });
          setSelectedVehicles((prev) => {
            return prev.filter(
              (prevNode) =>
                !unselectedNodes.some(
                  (obj) => obj.VehicleID === prevNode.VehicleID
                )
            );
          });
        }
      }
      setclusterToggle(true);
      const tempArr = info.checkedNodes
        .filter((node) => node.data.VehicleID)
        .map((node) => node.data);
      const selectedSerialNumbers = new Set(
        selectedVehicles.map((x) => x?.SerialNumber)
      );
      const filteredTempArr = tempArr.filter(
        (v) => !selectedSerialNumbers.has(v?.SerialNumber)
      );
      if (info.checked && myMap && filteredTempArr.length > 0) {
        const notConnectedVehiclesDisplayNames = filteredTempArr
          .filter((v) => notConnectedVehicles.includes(v.SerialNumber))
          .map((v) => v.DisplayName || v.SerialNumber)
          .toString();
        const unassigned = filteredTempArr.filter((v) =>
          unassignedVehicles.includes(v.SerialNumber)
        );
        if (filteredTempArr.length === 1) {
          if (notConnectedVehiclesDisplayNames) {
            toast.info(
              `Not Connected Vehicle: (${notConnectedVehiclesDisplayNames})`
            );
          }
          if (unassigned.length > 0) {
            setUnassignedVehicle(filteredTempArr[0]);
            setShowModal(true);
            return;
          }
          const vehicle = filteredTempArr[0];
          if (!notConnectedVehiclesDisplayNames) {
            const latestUpdate = getVehicleBySerialNumber(vehicle.SerialNumber);
            myMap.pin(latestUpdate);
          }
        } else {
          handleMultipleVehicles(filteredTempArr);
        }
      }
    };
    const handleMultipleVehicles = (tempArr) => {
      setclusterToggle(true);
      const vehiclesToMap = tempArr.filter(
        (v) =>
          !notConnectedVehicles.includes(v.SerialNumber) &&
          !unassignedVehicles.includes(v.SerialNumber)
      );
      const latestUpdate = vehiclesToMap.map((v) =>
        getVehicleBySerialNumber(v.SerialNumber)
      );
      paginateVehicles(latestUpdate);
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
                  className="d-flex align-items-center"
                  style={{ marginTop: "7px", fontSize: "12px" }}
                >
                  {item?.title}
                  <span className="badge bg-secondary px-1 mx-2">
                    {item?.title === t("All")
                      ? allTreeData?.length
                      : getAllVehs(item?.children).length}
                  </span>
                </span>
              }
            >
              {loop(item?.children)}
            </TreeNode>
          );
        }

        return (
          <TreeNode
            key={item?.SerialNumber}
            data={item}
            className={`${Styles.treeItem} border-bottom`}
            icon={<StatusIcon item={item} vehicleIcon={vehicleIcon} />}
            isLeaf={true}
            title={<TreeNodeItem item={item} ToggleConfig={ToggleConfig} />}
          />
        );
      });
    return (
      <>
        {newTree?.length > 0 && (
          <div className="position-relative">
            <div
              style={{
                minHeight: "100vh",
                maxWidth: "auto",
                overflowY: "auto",
              }}
              id="menu-scrollbar"
            >
              <div
                className={`tree_root ${darkMode && Styles.dark}`}
                style={{
                  height: "calc(80vh - 240px)",
                  overflow: "hidden  scroll",
                }}
              >
                <Tree
                  checkable
                  selectable={false}
                  showLine={true}
                  defaultExpandAll={false}
                  autoExpandParent={false}
                  defaultExpandedKeys={defaultExpandedKeys}
                  checkedKeys={selectedVehicles.map((v) => `${v.SerialNumber}`)}
                  onCheck={onCheck}
                >
                  {loop(newTree)}
                </Tree>
              </div>
            </div>
          </div>
        )}
        <NotifyModal
          show={showModal}
          vehicleName={unassignedVehicle?.DisplayName || t("unknown_vehicle")}
          vehicleId={unassignedVehicle?.VehicleID}
          onCancel={handleClose}
        />
      </>
    );
  }
);

export default MenuTree;
