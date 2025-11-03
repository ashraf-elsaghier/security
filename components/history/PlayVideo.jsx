import { Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useTranslation } from "next-i18next";

const PlayVideo = ({
  AllSteps = {},
  loading,
  selectedSteps,
  setStats,
  setCurrentSLocation,
  currentSLocation,
  setSpeedCar,
  speedCar,
  stats,
  getAllLocations,
  makePlayBtnDisabled
}) => {
  const { t } = useTranslation("history");
  return (
    <>
      {Object.keys(AllSteps)?.length ? (
        <div className="d-flex mt-2" style={{ gap: "0.2rem" }}>
          <OverlayTrigger
            overlay={<Tooltip id="tooltip-disabled">{t("first")}</Tooltip>}
          >
            <Button
              disabled={makePlayBtnDisabled || loading}
              className={`py-1 border-0 w-100`}
              id="first"
              onClick={() => {
                setSpeedCar(1000);
                setCurrentSLocation(0);
                setStats(0);
              }}
            >
              {/* first */}
              <svg
                fill="#fff"
                style={{ cursor: "pointer" }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 22.19 22.19"
              >
                <g data-name="Layer 2">
                  <g data-name="Layer 1">
                    <path d="M11.1 0a11.1 11.1 0 1011.09 11.1A11.11 11.11 0 0011.1 0zm0 20.77a9.68 9.68 0 119.67-9.67 9.69 9.69 0 01-9.67 9.67z"></path>
                    <path d="M4.56 6.33H6.1499999999999995V15.86H4.56z"></path>
                    <path d="M13.06 7.69L11.94 6.56 7.41 11.1 11.94 15.63 13.06 14.51 9.65 11.1 13.06 7.69z"></path>
                    <path d="M16.51 6.56L11.97 11.1 16.51 15.63 17.63 14.51 14.22 11.1 17.63 7.69 16.51 6.56z"></path>
                  </g>
                </g>
              </svg>
            </Button>
          </OverlayTrigger>

          <OverlayTrigger
            overlay={<Tooltip id="tooltip-disabled">{t("prev")}</Tooltip>}
          >
            <Button
              disabled={makePlayBtnDisabled || loading}
              className={`py-1 border-0 w-100`}
              id="prev"
              onClick={() => {
                setStats(3);
                currentSLocation > 0 &&
                  setCurrentSLocation((prev) => (prev -= 1));
              }}
            >
              {/* prev */}
              <svg
                fill="#fff"
                style={{ cursor: "pointer" }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 22.19 22.19"
              >
                <g data-name="Layer 2">
                  <g data-name="Layer 1">
                    <path d="M6.84 6.33H8.43V15.86H6.84z"></path>
                    <path d="M14.22 6.56L9.69 11.1 14.22 15.63 15.35 14.51 11.94 11.1 15.35 7.69 14.22 6.56z"></path>
                    <path d="M11.1 0a11.1 11.1 0 1011.09 11.1A11.11 11.11 0 0011.1 0zm0 20.77a9.68 9.68 0 119.67-9.67 9.69 9.69 0 01-9.67 9.67z"></path>
                  </g>
                </g>
              </svg>
            </Button>
          </OverlayTrigger>

          <OverlayTrigger
            overlay={<Tooltip id="tooltip-disabled">{t("play")}</Tooltip>}
          >
            <Button
              disabled={makePlayBtnDisabled || loading || stats === 1}
              className={`py-1 border-0 w-100`}
              id="play"
              onClick={() => {
                setStats(1);
              }}
            >
              {/* play */}
              <svg
                fill="#fff"
                style={{ cursor: "pointer" }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 22.19 22.19"
              >
                <g data-name="Layer 2">
                  <g data-name="Layer 1">
                    <path d="M11.1 0a11.1 11.1 0 1011.09 11.1A11.11 11.11 0 0011.1 0zm0 20.77a9.68 9.68 0 119.67-9.67 9.69 9.69 0 01-9.67 9.67z"></path>
                    <path d="M8.42 15.35L15.64 11.1 8.42 6.84 8.42 15.35z"></path>
                  </g>
                </g>
              </svg>
            </Button>
          </OverlayTrigger>
          <OverlayTrigger
            overlay={<Tooltip id="tooltip-disabled">{t("pause")}</Tooltip>}
          >
            <Button
              disabled={
                (stats !== 1) ||
                loading ||
                !selectedSteps?.length
              }
              className={`py-1 border-0 w-100`}
              id="pause"
              onClick={() => {
                setStats(3);
              }}
            >
              {/* pause */}
              <svg
                fill="#fff"
                style={{ cursor: "pointer" }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 22.19 22.19"
              >
                <g data-name="Layer 2">
                  <g data-name="Layer 1">
                    <path d="M9.05 6.84A1.18 1.18 0 007.87 8v6.15a1.18 1.18 0 102.35 0V8a1.17 1.17 0 00-1.17-1.16zM13.14 6.84A1.17 1.17 0 0012 8v6.15a1.18 1.18 0 102.35 0V8a1.18 1.18 0 00-1.21-1.16z"></path>
                    <path d="M11.1 0a11.1 11.1 0 1011.09 11.1A11.11 11.11 0 0011.1 0zm0 20.77a9.68 9.68 0 119.67-9.67 9.69 9.69 0 01-9.67 9.67z"></path>
                  </g>
                </g>
              </svg>
            </Button>
          </OverlayTrigger>

          <OverlayTrigger
            overlay={<Tooltip id="tooltip-disabled">{t("reset")}</Tooltip>}
          >
            <Button
              disabled={makePlayBtnDisabled || loading}
              className={`py-1 border-0 w-100`}
              id="stop"
              onClick={() => {
                setStats(0);
                setSpeedCar(1000);
                setCurrentSLocation(0);
              }}
            >
              {/* stop */}
              <svg
                fill="#fff"
                style={{ cursor: "pointer" }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 22.19 22.19"
              >
                <g data-name="Layer 2">
                  <g data-name="Layer 1">
                    <rect
                      width="8.5"
                      height="8.5"
                      x="6.84"
                      y="6.84"
                      rx="0.71"
                    ></rect>
                    <path d="M11.1 0a11.1 11.1 0 1011.09 11.1A11.11 11.11 0 0011.1 0zm0 20.77a9.68 9.68 0 119.67-9.67 9.69 9.69 0 01-9.67 9.67z"></path>
                  </g>
                </g>
              </svg>
            </Button>
          </OverlayTrigger>

          <OverlayTrigger
            overlay={<Tooltip id="tooltip-disabled">{t("minus")}</Tooltip>}
          >
            <Button
              disabled={makePlayBtnDisabled || loading}
              className={`py-1 border-0 w-100`}
              id="minus"
              onClick={() => {
                if (speedCar < 2000) {
                  setSpeedCar((prev) => (prev += 100));
                }
              }}
            >
              {/* minus */}
              <svg
                fill="#fff"
                style={{ cursor: "pointer" }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 22.19 22.19"
              >
                <g data-name="Layer 2">
                  <g data-name="Layer 1">
                    <path d="M6.46 10.17H15.739999999999998V12.02H6.46z"></path>
                    <path d="M11.1 0a11.1 11.1 0 1011.09 11.1A11.11 11.11 0 0011.1 0zm0 20.77a9.68 9.68 0 119.67-9.67 9.69 9.69 0 01-9.67 9.67z"></path>
                  </g>
                </g>
              </svg>
            </Button>
          </OverlayTrigger>

          <OverlayTrigger
            overlay={<Tooltip id="tooltip-disabled">{t("plus")}</Tooltip>}
          >
            <Button
              disabled={makePlayBtnDisabled || loading}
              className={`py-1 border-0 w-100`}
              id="plus"
              onClick={() => {
                if (speedCar > 100) {
                  setSpeedCar((prev) => (prev -= 100));
                }
              }}
            >
              {/* plus */}
              <svg
                fill="#fff"
                style={{ cursor: "pointer" }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 22.19 22.19"
              >
                <g data-name="Layer 2">
                  <g data-name="Layer 1">
                    <path d="M14.42 10.17H12v-2.4a.93.93 0 10-1.85 0v2.4H7.77a.93.93 0 100 1.85h2.4v2.4a.93.93 0 101.85 0V12h2.4a.93.93 0 100-1.85z"></path>
                    <path d="M11.1 0a11.1 11.1 0 1011.09 11.1A11.11 11.11 0 0011.1 0zm0 20.77a9.68 9.68 0 119.67-9.67 9.69 9.69 0 01-9.67 9.67z"></path>
                  </g>
                </g>
              </svg>
            </Button>
          </OverlayTrigger>

          <OverlayTrigger
            overlay={<Tooltip id="tooltip-disabled">{t("next")}</Tooltip>}
          >
            <Button
              disabled={makePlayBtnDisabled || loading}
              className={`py-1 border-0 w-100`}
              id="next"
              onClick={() => {
                setStats(3);
                currentSLocation <= selectedSteps?.length - 1 &&
                  setCurrentSLocation((prev) => (prev += 1));
              }}
            >
              {/* next */}
              <svg
                fill="#fff"
                style={{ cursor: "pointer" }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 22.19 22.19"
              >
                <g data-name="Layer 2">
                  <g data-name="Layer 1">
                    <path d="M13.76 6.33h1.59v9.53h-1.59zM6.84 7.69l3.41 3.41-3.41 3.41 1.13 1.12 4.53-4.53-4.53-4.54-1.13 1.13z"></path>
                    <path d="M11.1 0a11.1 11.1 0 1011.09 11.1A11.11 11.11 0 0011.1 0zm0 20.77a9.68 9.68 0 119.67-9.67 9.69 9.69 0 01-9.67 9.67z"></path>
                  </g>
                </g>
              </svg>
            </Button>
          </OverlayTrigger>

          <OverlayTrigger
            overlay={<Tooltip id="tooltip-disabled">{t("last")}</Tooltip>}
          >
            <Button
              disabled={makePlayBtnDisabled || loading}
              className={`py-1 border-0 w-100`}
              id="last"
              onClick={() => {
                setStats(2);
                setCurrentSLocation(selectedSteps?.length - 1);
              }}
            >
              {/* last */}
              <svg
                fill="#fff"
                style={{ cursor: "pointer" }}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 22.19 22.19"
              >
                <g data-name="Layer 2">
                  <g data-name="Layer 1">
                    <path d="M11.1 0a11.1 11.1 0 1011.09 11.1A11.11 11.11 0 0011.1 0zm0 20.77a9.68 9.68 0 119.67-9.67 9.69 9.69 0 01-9.67 9.67z"></path>
                    <path d="M16.04 6.33H17.63V15.86H16.04z"></path>
                    <path d="M9.13 7.69L12.54 11.1 9.13 14.51 10.25 15.63 14.78 11.1 10.25 6.56 9.13 7.69z"></path>
                    <path d="M5.68 6.56L4.56 7.69 7.97 11.1 4.56 14.51 5.68 15.63 10.22 11.1 5.68 6.56z"></path>
                  </g>
                </g>
              </svg>
            </Button>
          </OverlayTrigger>
        </div>
      ) : (
        ""
      )}
    </>
  );
};

export default PlayVideo;
