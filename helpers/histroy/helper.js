import moment from "moment";
export const changeRowDataKeys = (data) => {
  const excludedKeys = ["configJson", "ID", "EndAdd", "Guide"]
  function getAllKeys(arr) {
    let keys = new Set();
    arr.forEach(obj => {
      Object.keys(obj).forEach(key => {
        if (!excludedKeys.includes(key)) keys.add(key);
      });
    });
    return Array.from(keys);
  }
  const newArr = data.map((obj) => {
    const newObj = {};
    let allObjKeys = getAllKeys(data)
    allObjKeys.forEach((key) => {
      if (
        key === "Address" &&
        typeof obj[key] !== "string" &&
        typeof obj[key] !== "undefined"
      ) {
        delete newObj.Address;
        newObj["Start Address"] = obj[key][0];
        newObj["End Address"] = obj[key][1];
      } else if (key === "Endvent") {
        delete newObj.Endvent;
        newObj["EndEvent"] = obj[key];
      } else if (key === "Coord") {
        delete newObj.Coord;
        newObj["Start Coord"] = `(${(obj[key][0], obj[key][1])})`;
        newObj["End Coord"] = `(${(obj[key][2], obj[key][3])})`;
      } else if (
        key === "StrDate" ||
        key === "EndDate" ||
        key === "RecordDateTime" ||
        (key === "IdleStart" && obj[key])
      ) {
        newObj[key] = moment(obj[key])
          .utc()
          .local()
          .format("YYYY-MM-DD HH:mm:ss A");
      }
      else if (
        obj[key] === "null" ||
        !obj[key] ||
        obj[key].toString().trim() === "null" ||
        obj[key] === ""
      ) {
        if (obj["status"]) {
          newObj[key] = "InProgress";
        } else {
          newObj[key] = "N/A";
        }

      }
      else {
        newObj[key] = obj[key];
      }

    })

    return newObj;
  });
  return newArr;
};
