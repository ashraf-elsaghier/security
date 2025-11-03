import { convertTreeFormat, removeEmptySubgroups } from "helpers/helpers";
import { useSession } from "next-auth/client";
import { useTranslation } from "next-i18next";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUserGroups } from "services/management/ManageGroups";

const useTree = (allTreeData, userId, fromManagment) => {
  const { t } = useTranslation("common");
  const { groups: userGroups } = useSelector((state) => state.groups);
  const [groups, setGroups] = useState([]);
  const [newTree, setNewTree] = useState([]);
  const [defaultExpandedKeys, setDefaultExpandKeys] = useState(["All"]);
  const [session] = useSession();
  const role = session?.user?.user?.role?.toLowerCase() === "support";
  // Get all groups in all accounts except testAdmin account
  useEffect(async () => {
    const ungroup = {
      ID: null,
      Name: "Un Group",
      ParentGroupID: null,
    };
    if (fromManagment && userId) {
      const Groups = await getUserGroups(userId);
      Groups.result.push(ungroup);
      setGroups(Groups.result);
    } else {
      const tempProps = JSON.parse(JSON.stringify(userGroups));
      setGroups([ungroup, ...tempProps]);
    }
  }, [userGroups, userId]);

  // filter tree data and choose groups to expand only that has child group
  const filterExpandedGroups = (groups) => {
    const filteredTitles = [];
    function traverseAndFilter(arr) {
      arr.forEach((item, i) => {
        if (item.children && Array.isArray(item.children)) {
          const hasVehicleID = item.children.some(
            (child) => child.VehicleID !== undefined
          );
          if (!hasVehicleID) {
            filteredTitles.push(`${item.ID}`);
          }
          traverseAndFilter(item.children);
        }
      });
    }
    traverseAndFilter(groups);
    return filteredTitles;
  };

  // create Tree of Group and SubGroup
  useEffect(() => {
    if (allTreeData && groups?.length > 0) {
      generateTree();
      const allGroups = groups
        .filter((g) => g.ParentGroupID === null)
        .sort((g1, g2) => g1.ID - g2.ID);

      const tree = removeEmptySubgroups(allGroups.map(convertTreeFormat));
      setDefaultExpandKeys([
        ...defaultExpandedKeys,
        ...filterExpandedGroups(tree),
      ]);

      const result = [
        {
          title: t("All"),
          children: [],
        },
      ];

      result[0]?.children?.push(...tree);
      setNewTree(result);
    }
  }, [allTreeData, groups?.length]);

  const generateTree = () => {
    const groupMap = {};
    for (let group of groups) {
      group["children"] = [];
      groupMap[group.ID] = group;
      if (group.ParentGroupID !== null) {
        const parentGroup = groupMap[group.ParentGroupID];
        if (parentGroup) {
          parentGroup.children = parentGroup.children || [];
          parentGroup.children.push(group);
        }
      }
    }

    for (let obj of allTreeData) {
      const group = groupMap[obj.GroupID];

      if (group) {
        group.children = group.children || [];
        group.children.push(obj);
      }
    }
  };

  return { newTree, defaultExpandedKeys };
};

export default useTree;
