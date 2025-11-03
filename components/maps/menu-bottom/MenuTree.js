import { useEffect, useMemo, useState } from "react";
import Tree, { TreeNode } from "rc-tree";
import Image from "next/image";
import "rc-tree/assets/index.css";
import Styles from "../../../styles/Tree.module.scss";
import { useSelector } from "react-redux";
import { GetStatusString, getAllVehs, iconUrl } from "../../../helpers/helpers";
import axios from "axios";
import useTree from "hooks/useTree";

const MenuTree = ({
  vehicleId,
  treeFilter,
  vehicleIds,
  setVehicleIds,
  setVehicleIdsChecked,
  vehicleIdsChecked,
}) => {
  const [listsVehs, setListsVehs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusIcons] = useState({});
  const [TreeStyleHeight] = useState(0);

  const filteredTreeData = useMemo(() => {
    return listsVehs.filter((item) => {
      const filterDisplayName = item?.DisplayName?.replace(/\s/g, "")
        .toLowerCase()
        .includes(treeFilter.replace(/\s/g, "").toLowerCase());
      const filterSerialNumber =
        item.SerialNumber?.includes(treeFilter) ||
        item.Serial?.includes(treeFilter);
      return filterDisplayName || filterSerialNumber;
    });
  }, [listsVehs, treeFilter]);
  const { newTree, defaultExpandedKeys } = useTree(filteredTreeData);
  useEffect(() => {
    (async function () {
      try {
        setLoading(true);
        const assignedVehs = await axios.get(`geofences/geofence/${vehicleId}`);

        if (listsVehs.length > 0) {
          if (assignedVehs.status === 200) {
            setVehicleIds(assignedVehs.data.vehicles);
            setVehicleIdsChecked(assignedVehs.data.vehicles);
            setLoading(false);
          }
        } else {
          const resVehs = await axios.get(
            "dashboard/management/maintenance/info/vehs"
          );

          setLoading(true);
          if (resVehs.status === 200) {
            setVehicleIds(assignedVehs.data.vehicles);
            setListsVehs(resVehs.data.result);
            setVehicleIdsChecked(assignedVehs.data.vehicles);
            setLoading(false);
          }
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [vehicleId]);

  const stateReducer = useSelector((state) => state);

  const onCheck = (selectedKeys, info) => {
    const selectedNodes = filteredTreeData
      .filter((v) => selectedKeys.includes(`${v.VehicleID}`))
      .map((veh) => veh.VehicleID);
    if (!treeFilter) {
      setVehicleIdsChecked((prev) =>
        info?.checked
          ? [...new Set([...prev, ...selectedNodes])]
          : prev.filter((node) => selectedNodes.includes(node))
      );
    }
    // if there is a treefilter
    else {
      let selectedNodesChildren = info?.node?.data?.children;
      let unselectedNodes = selectedNodesChildren
        ? getAllVehs(selectedNodesChildren).map((veh) => veh.VehicleID)
        : [info?.node?.data.VehicleID];
      // when select a node || a group
      setVehicleIdsChecked((prev) =>
        info?.checked
          ? [...new Set([...prev, ...selectedNodes])]
          : // unselect all nodes in case group || last items
          selectedNodesChildren
            ? prev.filter((prevNode) => !unselectedNodes.includes(prevNode))
            : prev.filter((node) => !unselectedNodes.includes(node))
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
            defaultCheckedKeys={vehicleIds?.map((item) => String(item))}
            title={
              <span
                className="d-flex align-items-center"
                style={{
                  fontSize: "12px",
                }}
              >
                {item?.title}
                <span className="badge bg-secondary px-1 mx-2">
                  {item?.title === "All"
                    ? filteredTreeData?.length
                    : getAllVehs(item.children).length}
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
          key={item?.VehicleID}
          data={item}
          defaultCheckedKeys={vehicleIds?.map((item) => String(item))}
          className="TreeNode"
          icon={
            <div className="position-relative">
              <Image
                // src={handleImageStatus(item?.VehicleStatus)}
                src={iconUrl(item?.configJson, "/assets/images/cars/car0/", 0)}
                width={11}
                height={20}
                alt={GetStatusString(statusIcons[item?.SerialNumber])}
                title={GetStatusString(statusIcons[item?.SerialNumber])}
              />
            </div>
          }
          style={{ height: "50px" }}
          isLeaf={true}
          title={
            <div className="d-flex align-items-center flex-column">
              <div className="d-flex align-items-center justify-content-between">
                <div
                  className="me-1 border-bottom"
                  title={item?.DisplayName}
                  style={{
                    fontSize: "10px",
                    // width: "6rem",
                    overflow: "hidden",
                  }}
                >
                  {item?.DisplayName} ({item?.SerialNumber})
                </div>
              </div>
            </div>
          }
        />
      );
    });
  return (
    <>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : filteredTreeData?.length > 0 ? (
        <div className="position-relative">
          <div style={{ minHeight: "40vh" }} id="menu-scrollbar">
            <div
              className={`tree_root ${stateReducer?.config?.darkMode && Styles.dark
                }`}
              style={{
                height: TreeStyleHeight,
              }}
            >
              <Tree
                checkable
                selectable={false}
                showLine={true}
                defaultExpandAll={false}
                autoExpandParent={false}
                defaultExpandedKeys={defaultExpandedKeys}
                defaultCheckedKeys={vehicleIdsChecked?.map((item) =>
                  String(item)
                )}
                checkedKeys={vehicleIdsChecked?.map((item) => String(item))}
                onCheck={onCheck}
                // filterTreeNode={handleFilterTree}
                height={TreeStyleHeight - 80}
              >
                {loop(newTree)}
              </Tree>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center">There Is No Vehicles</p>
      )}
    </>
  );
};
export default MenuTree;
