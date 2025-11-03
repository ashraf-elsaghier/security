import { useMemo } from "react";

const useData = (checkedVehicles) => {
  const optionsMaintenanceType = useMemo(() => {
    return [
      {
        value: 1,
        label: "Engine Oil Change",
      },
      {
        value: 2,
        label: "Change Vehicle Brakes",
      },
      {
        value: 3,
        label: "Vehicle License Renew",
      },
      {
        value: 4,
        label: "Vehicle Wash",
      },
      {
        value: 5,
        label: "Tires Change",
      },
      {
        value: 6,
        label: "Transmission Oil Change",
      },
      {
        value: 7,
        label: "Filter Change",
      },
      {
        value: 8,
        label: "Others",
      },
    ];
  }, []);

  const optionsPeriodType = useMemo(() => {
    return [
      {
        value: 1,
        label: "By Mileage",
      },
      {
        value: 2,
        label: "By Fixed Date",
      },
      {
        value: 3,
        label: "By Working Hours",
      },
    ];
  }, []);

  const optionsNotifyPeriod = useMemo(() => {
    if (checkedVehicles?.length > 1) {
      return [
        {
          value: "1",
          label: "Percentage",
        },
      ];
    } else {
      return [
        {
          value: "1",
          label: "Percentage",
        },
        {
          value: "2",
          label: "Value",
        },
      ];
    }
  }, [checkedVehicles?.length]);

  return {
    optionsMaintenanceType,
    optionsPeriodType,
    optionsNotifyPeriod,
  };
};

export default useData;
