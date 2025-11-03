import subDays from "date-fns/subDays";
import startOfWeek from "date-fns/startOfWeek";
import endOfWeek from "date-fns/endOfWeek";
import addDays from "date-fns/addDays";
import startOfMonth from "date-fns/startOfMonth";
import endOfMonth from "date-fns/endOfMonth";
import addMonths from "date-fns/addMonths";
import moment from "moment";
import { useTranslation } from "next-i18next";

const usePredefinedBottomRanges = (type = "two") => {
  const { t } = useTranslation("reports");
  const startDay = new Date(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      0,
      0,
      0
    )
  );

  const endDay = new Date(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      23,
      59,
      59
    )
  );

  return [
    {
      label: t("Today"),
      placement: "left",
      value: [
        new Date(
          new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate(),
            0,
            0,
            0
          )
        ),
        new Date(
          new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate(),
            new Date().getHours(),
            new Date().getMinutes(),
            new Date().getSeconds()
          )
        ),
      ],
    },
    {
      label: t("Yesterday"),
      placement: "left",
      value: [addDays(startDay, -1), addDays(endDay, -1)],
    },
    // {
    //   label: "This week",
    //   placement: "left",
    //   value: [startOfWeek(new Date()), endOfWeek(new Date())],
    // },
    {
      label: t("last7Days"),
      placement: "left",
      value: [subDays(startDay, 6), new Date()],
    },
    {
      label: t("last30Days"),
      placement: "left",
      value: [subDays(startDay, 29), new Date()],
    },
    {
      label: t("thisMonth"),
      placement: "left",
      value: [startOfMonth(startDay), new Date()],
    },
    {
      label: t("lastMonth"),
      placement: "left",
      value: [
        startOfMonth(addMonths(startDay, -1)),
        endOfMonth(addMonths(endDay, -1)),
      ],
    },
    {
      label: t("thisYear"),
      placement: "left",
      value: [new Date(new Date().getFullYear(), 0, 1), new Date()],
    },
    {
      label: t("lastYear"),
      placement: "left",
      value: [
        new Date(new Date().getFullYear() - 1, 0, 1),
        moment().subtract(1, "years").endOf("year").toDate(),
      ],
    },
    {
      label: t("allTime"),
      placement: "left",
      value: [new Date(1970, 0, 1), new Date()],
    },
  ];
};

export default usePredefinedBottomRanges;
