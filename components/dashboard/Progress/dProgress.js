import React from "react";
//Count-up
import { CountUp } from "use-count-up";
//progressbar
import Progress from "./progress";
// translation
import { useTranslation } from "next-i18next";

const DProgress = ({
  name = ["one"],
  countStart = [0],
  countEnd = [20],
  duration = 1,
  dateType,
  progresCount,
  color = "primary",
  minvalue = 0,
  maxvalue = 100,
  loading,
}) => {
  const { t } = useTranslation("Dashboard");
  return (
    <>
      <div className="d-flex justify-content-between">
        {name?.map((ele, i) => (
          <div key={i}>
            <span>
              <b>{t(ele)}</b>
            </span>
            <div className="mt-2">
              <h2 className="counter">
                {!loading ? (
                  <CountUp
                    isCounting
                    start={countStart[i]}
                    end={countEnd[i]}
                    duration={duration}
                    thousandsSeparator=","
                  />
                ) : (
                  0
                )}
              </h2>
            </div>
          </div>
        ))}
        <div>
          <span
            className={`badge bg-${color} p-2`}
            style={{ letterSpacing: "1.2px" }}
          >
            {dateType}
          </span>
        </div>
      </div>
      {progresCount && (
        <div>
          <div className="d-flex justify-content-between mt-2">
            <div>
              <span>{t("Percentage")}</span>
            </div>
            <div>
              {/* <span>{!loading && `${progresCount}%`}</span> */}
              {!loading ? (
                <CountUp
                  isCounting
                  end={+progresCount || 0}
                  duration={duration}
                  thousandsSeparator=","
                />
              ) : (
                0
              )}
              %
            </div>
          </div>
          <div className="mt-3">
            {!loading && progresCount && (
              <Progress
                loading={loading}
                softcolors={color}
                color={color}
                value={progresCount}
                minvalue={minvalue}
                maxvalue={maxvalue}
                className="shadow-none w-100"
                style={{ height: "6px" }}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};
export default DProgress;
