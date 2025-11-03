import { updateSeen } from "lib/slices/notifications";
import moment from "moment";
import { useTranslation } from "next-i18next";
import React from "react";
import { Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";

const NotificationIcon = () => {
  const { t } = useTranslation("main");
  const dispatch = useDispatch();
  const { notifications, isSeen } = useSelector((state) => state.notifications);
  return (
    <Dropdown
      as="li"
      className="nav-item d-flex align-items-center"
      onToggle={() => dispatch(updateSeen())}
    >
      <Dropdown.Toggle
        variant="nav-link d-flex align-items-center"
        id="mail-drop"
        data-bs-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
        className="notifications"
      >
        <svg
          width="25"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19.7695 11.6453C19.039 10.7923 18.7071 10.0531 18.7071 8.79716V8.37013C18.7071 6.73354 18.3304 5.67907 17.5115 4.62459C16.2493 2.98699 14.1244 2 12.0442 2H11.9558C9.91935 2 7.86106 2.94167 6.577 4.5128C5.71333 5.58842 5.29293 6.68822 5.29293 8.37013V8.79716C5.29293 10.0531 4.98284 10.7923 4.23049 11.6453C3.67691 12.2738 3.5 13.0815 3.5 13.9557C3.5 14.8309 3.78723 15.6598 4.36367 16.3336C5.11602 17.1413 6.17846 17.6569 7.26375 17.7466C8.83505 17.9258 10.4063 17.9933 12.0005 17.9933C13.5937 17.9933 15.165 17.8805 16.7372 17.7466C17.8215 17.6569 18.884 17.1413 19.6363 16.3336C20.2118 15.6598 20.5 14.8309 20.5 13.9557C20.5 13.0815 20.3231 12.2738 19.7695 11.6453Z"
            fill={!isSeen ? "#891818" : "currentColor"}
          />
          <path
            opacity="0.4"
            d="M14.0088 19.2283C13.5088 19.1215 10.4627 19.1215 9.96275 19.2283C9.53539 19.327 9.07324 19.5566 9.07324 20.0602C9.09809 20.5406 9.37935 20.9646 9.76895 21.2335L9.76795 21.2345C10.2718 21.6273 10.8632 21.877 11.4824 21.9667C11.8123 22.012 12.1482 22.01 12.4901 21.9667C13.1083 21.877 13.6997 21.6273 14.2036 21.2345L14.2026 21.2335C14.5922 20.9646 14.8734 20.5406 14.8983 20.0602C14.8983 19.5566 14.4361 19.327 14.0088 19.2283Z"
            fill={!isSeen ? "#891818" : "currentColor"}
          />
        </svg>
        {/*<span className="bg-primary count-mail">1</span>*/}
      </Dropdown.Toggle>
      <Dropdown.Menu
        className="sub-drop dropdown-menu-end p-0 "
        aria-labelledby="mail-drop"
      >
        <div className="card shadow-none m-0">
          <div className="card-header d-flex justify-content-between bg-primary py-3">
            <div className="header-title">
              <h5 className="mb-0 text-white">{t("All_Message")}</h5>
            </div>
          </div>
          <div
            className="card-body p-0 "
            style={{ maxHeight: "400px", overflowY: "scroll" }}
          >
            {notifications.length === 0 && (
              <p
                className="iq-sub-card"
                style={{
                  position: "relative",
                  padding: "1rem 1.75rem",
                }}
              >
                <div className="d-flex align-items-center">
                  <div></div>
                  <div className=" w-100 ms-3">
                    <small className="float-left font-size-12">
                      No Notification yet
                    </small>
                  </div>
                </div>
              </p>
            )}
            {notifications?.map((item, index) => (
              <div key={index}>
                <div
                  className="iq-sub-card"
                  style={{
                    position: "relative",
                    padding: "1rem 1.75rem",
                  }}
                >
                  <div className="d-flex align-items-center">
                    <div></div>
                    <div className=" w-100 ms-3">
                      <h6 className="mb-0 ">{item.type}</h6>
                      <small className="float-left font-size-12">
                        {item.message}
                      </small>
                      <small
                        className=" font-size-12"
                        style={{
                          position: "absolute",
                          bottom: "0px",
                          right: "30px",
                        }}
                      >
                        {moment(item.time).fromNow()}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationIcon;
