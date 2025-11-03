import React, { useEffect, useRef, useState } from "react";
import { Navbar, Container, Nav, Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog, faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { GiTeacher } from "react-icons/gi";
import { FaChalkboardTeacher } from "react-icons/fa";

import { toggle } from "../lib/slices/toggleSidebar";
import { toggleHead } from "../lib/slices/toggle-header";
import { changeLanguage, darkMode, userConfigImg } from "../lib/slices/config";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import Styles from "../styles/WidgetMenu.module.scss";
import { signIn, signOut } from "next-auth/client";
import { locale } from "moment";
import axios from "axios";
import { encryptName } from "helpers/encryptions";
import jwt_decode from "jwt-decode";

import { toggle as tourToggle } from "lib/slices/tour";
import { useSession } from "next-auth/client";
import useStreamDataState from "hooks/useStreamDataState";
import { updateStRunning } from "lib/slices/StreamData";
import { toast } from "react-toastify";
import NotificationIcon from "./NotificationsIcon";
import { useIdleTimer } from "react-idle-timer";
import { fetchGroups } from "lib/slices/groups";
import { io } from "socket.io-client";
import { setSocket } from "lib/slices/socketSlice";
import Cookies from "js-cookie";
import { IoMdArrowRoundForward } from "react-icons/io";

const Header = ({ settBtnRef }) => {
  const { t } = useTranslation("main");
  const dispatch = useDispatch();
  const session = useSession();
  const userRole = session[0]?.user?.user?.role?.toLowerCase();
  Cookies.set("userRole", userRole);
  const tourState = useSelector((state) => state.tour.run);
  const { config, ToggleHeader, auth } = useSelector((state) => state);
  const VehFullData = useSelector((state) => state.streamData.VehFullData);
  const router = useRouter();
  const { locales, locale: activeLocale } = router;
  const otherLocales = locales?.filter((locale) => locale !== activeLocale);
  const lastConfig =
    window !== undefined &&
    JSON.parse(localStorage.getItem(encryptName("config")))
      ? localStorage.getItem(encryptName("config"))
      : false;
  const [systemData, setSystemData] = useState({});
  const logOutRef = useRef();
  const { trackStreamLoader, loading } = useStreamDataState();
  const { running } = useSelector((state) => state.streamData);
  const [reconnect, setReconnect] = useState(false);
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  useEffect(() => {
    const isTokenExpired =
      session[0] &&
      session[0].user.new_token &&
      new Date(jwt_decode(session[0].user?.new_token).exp * 1000) < new Date();
    if (isTokenExpired) {
      localStorage.clear();
      handleSignOut();
    }
  }, [session]);

  const initializeSocket = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    socketRef.current = io(
      `${process.env.NEXT_PUBLIC_SOCKET_IO_URL}/consumer`,
      {
        auth: {
          token:
            "ed9a68532c60d1e503b78b8b268b22df:cf8e83772d9caff56178a1b394c48ca959dbd7f6ce7073ec4f9629bb0ff92679b9886e8d07ecdd758f21bd328c1e2f43",
        },
        transports: ["websocket"],
        reconnectionAttempts: 5,
        reconnectionDelay: 10000,
      }
    );
    socketRef.current.on("connect", handleConnect);
    socketRef.current.on("disconnect", handleClose);
    socketRef.current.on("reconnect", handleReconnect);
    socketRef.current.on("connect_error", handleConnectError);
    socketRef.current.on("reconnect_error", handleReconnectError);
  };
  const emitEvent = (socket) => {
    if (socket && socket.connected) {
      VehFullData.forEach((vehicle) => {
        socket.emit("track", {
          serial: vehicle.SerialNumber,
        });
      });
    } else {
      console.log("Socket is not connected");
    }
  };

  const handleConnect = () => {
    setIsConnected(true);
    dispatch(setSocket(socketRef.current));
    emitEvent(socketRef.current);
  };

  const handleClose = () => {
    setIsConnected(false);
    setReconnect((prev) => !prev);
  };

  const handleReconnect = () => {
    emitEvent(socketRef.current);
  };

  const handleConnectError = (error) => {
    console.error("Connection Error:", error);
  };

  const handleReconnectError = (error) => {
    console.error("Reconnection Error:", error);
  };

  useEffect(() => {
    initializeSocket();
    return () => {
      if (socketRef.current) {
        socketRef.current.off("connect", handleConnect);
        socketRef.current.off("disconnect", handleClose);
        socketRef.current.off("reconnect", handleReconnect);
        socketRef.current.off("connect_error", handleConnectError);
        socketRef.current.off("reconnect_error", handleReconnectError);
        socketRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (isConnected) {
      emitEvent(socketRef.current);
    }
  }, [isConnected]);

  useEffect(() => {
    emitEvent(socketRef.current);
  }, [reconnect, VehFullData]);
  useEffect(() => {
    dispatch(fetchGroups());
    if (!running) {
      trackStreamLoader();
      dispatch(updateStRunning());
    }
  }, []);
  const onIdle = () => {
    handleSignOut();
  };
  if (session[0]?.user?.user?.isIdleLogout ?? false) {
    useIdleTimer({
      onIdle,
      timeout: 1000 * 60 * session[0]?.user?.user?.idleTime || 5,
    });
  }
  const checkLogOutEnabled = async () => {
    try {
      const res = await axios({
        method: "get",
        url: `/dashboard/management/users/data/${session[0]?.user?.user?.profileId}`,
        headers: {
          Authorization: `Bearer ${session[0]?.user?.new_token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res?.data?.user?.LockoutEnabled) {
        axios({
          method: "post",
          url: `/dashboard/management/users/logout/${session[0]?.user?.user?.id}`,
          headers: {
            Authorization: `Bearer ${session[0]?.user?.new_token}`,
            "Content-Type": "application/json",
          },
        }).then(() => {
          signOut();
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkLogOutEnabled();
    const interval = setInterval(() => {
      checkLogOutEnabled();
    }, 300000);
    return () => clearInterval(interval);
  }, []);
  const handleSignOut = (e) => {
    e?.preventDefault();
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then(function (registrations) {
        for (let registration of registrations) {
          registration.unregister();
        }
      });
    }
    if (session[0]?.user?.user?.actormode) {
      const actorUser = session[0]?.user?.user?.parent?.user;
      const parentToken = session[0]?.user?.user?.parent?.new_token;
      signIn("credentials", {
        user: JSON.stringify({
          new_token: parentToken,
          user: actorUser,
        }),
      });
    } else {
      signOut();
    }
    localStorage.clear();
    localStorage.setItem("lastConfig", lastConfig);
  };
  // handle tour
  const handleTour = (e) => {
    e.preventDefault();
    dispatch(tourToggle());
  };

  const handleSetVechSetting = async () => {
    try {
      getDrivers();
      toast.info(`${t("sync_started_key")}`);
      trackStreamLoader(true);
      toast.success(`${t("sync_done_key")}`);
      dispatch(updateStRunning());
    } catch (error) {
      toast.error("someting went wrong!");
    }
  };

  const getDrivers = async () => {
    try {
      const response = await axios.get("dashboard/drivers");
      const filteredDrivers = response.data.drivers.map(
        ({ FirstName, LastName, DriverID, RFID }) => {
          return {
            FirstName: FirstName,
            LastName: LastName,
            DriverID: DriverID,
            RFID: RFID,
          };
        }
      );
      localStorage.setItem("drivers", JSON.stringify(filteredDrivers));
    } catch (error) {
      toast.error("error fetching drivers");
    }
  };

  useEffect(() => {
    if (!JSON.parse(localStorage.getItem("drivers"))) getDrivers();
  }, [JSON.parse(localStorage.getItem("drivers"))]);

  useEffect(() => {
    document.documentElement.setAttribute(
      "dir",
      `${activeLocale === "ar" ? "rtl" : "ltr"}`
    );
    document.body?.setAttribute(
      "dir",
      `${activeLocale === "ar" ? "rtl" : "ltr"}`
    );
    config?.darkMode
      ? document?.body?.classList?.add("dark")
      : document?.body?.classList?.remove("dark");
  }, [config.darkMode, document?.body?.className, activeLocale]);

  useEffect(() => {
    const getImage = async () => {
      try {
        const res = await axios("config");
        dispatch(userConfigImg(res?.data?.configs?.image));
        if (res?.data?.config?.warningsModal) {
          localStorage.setItem(
            "warningConfig",
            JSON.stringify(res?.data?.config?.warningsModal)
          );
        }

        if (res?.data?.configs?.geofenceConfigs) {
          localStorage.setItem(
            "geofenceConfigs",
            JSON.stringify(res?.data?.configs?.geofenceConfigs)
          );
        }
        if (res?.data?.configs?.trackConfigs) {
          localStorage.setItem(
            "Popup_Track",
            JSON.stringify(res?.data?.configs?.trackConfigs)
          );
        }
        if (res?.data?.configs?.historyPlayBackConfigs?.getAllLocations) {
          localStorage.setItem(
            "config_getLocations",
            JSON.stringify(
              res?.data?.configs?.historyPlayBackConfigs?.getAllLocations
            )
          );
        }
      } catch (error) {
        if (error?.response?.data?.message == "User not found") {
          signOut();
        }
      }
    };

    // if (JSON.parse(localStorage.getItem(encryptName("systemConfig")))?.title) {
    //   setSystemData(
    //     JSON.parse(localStorage.getItem(encryptName("systemConfig")))
    //   );
    // }

    getImage();
  }, []);

  const getAvater = (imageUrl) => imageUrl || "/assets/images/avatars/01.png";

  return (
    <>
      <Navbar
        expand="lg"
        variant="light"
        className="nav iq-navbar py-0 py-xl-2"
        // style={{ zIndex: "10903" }}
      >
        <Container fluid className="navbar-inner">
          <div className="navbar-brand mx-5">
            <a href={"/"}>
              <img src="/small-logo-header.png" className="mt-1" width={120} />
            </a>

            {/*<h4 className="logo-title">Safe road</h4>*/}
          </div>

          <div
            className="sidebar-toggle"
            data-toggle="sidebar"
            data-active="true"
            onClick={() => dispatch(toggle())}
          >
            <i className="icon d-flex">
              <IoMdArrowRoundForward size={20} />
            </i>
          </div>
          <Navbar.Toggle
            aria-controls="navbarSupportedContent"
            onClick={() => dispatch(toggleHead())}
            className={`${Styles.hamburger} ${
              ToggleHeader.value && Styles.active
            } shadow-none
             ${config.darkMode ? "bg-transparent" : ""}`}
          >
            <span
              className={`${Styles.hamburger__patty} ${
                config.darkMode ? "bg-white" : ""
              }`}
            />
            <span
              className={`${Styles.hamburger__patty} ${
                config.darkMode ? "bg-white" : ""
              }`}
            />
            <span
              className={`${Styles.hamburger__patty} ${
                config.darkMode ? "bg-white" : ""
              }`}
            />
          </Navbar.Toggle>
          <Navbar.Collapse
            id="navbarSupportedContent"
            className={`${ToggleHeader.value && "show"}`}
          >
            <Nav
              as="ul"
              className="ms-auto navbar-list my-2 my-lg-0 d-flex align-items-center"
            >
              {/* <button
                onClick={handleSetVechSetting}
                className="p-2 text-white rounded"
                style={{ backgroundColor: "#2295D6" }}
              >
                Get Vehicles
              </button> */}

              <Dropdown
                as="li"
                className="nav-item d-flex align-items-center tour"
              >
                <button
                  className="bg-transparent border-0 mx-2"
                  onClick={handleTour}
                >
                  {" "}
                  {tourState ? (
                    <GiTeacher size={30} />
                  ) : (
                    <FaChalkboardTeacher size={30} />
                  )}
                </button>
              </Dropdown>
              <Dropdown
                as="li"
                className="nav-item d-flex align-items-center toggle-dark-mode"
              >
                <button
                  onClick={() => dispatch(darkMode())}
                  className="bg-transparent border-0 mx-2"
                >
                  {config.darkMode ? (
                    <div className="sun">
                      <svg
                        version="1.1"
                        id="Capa_1"
                        viewBox="0 0 512 512"
                        width="22"
                      >
                        <g>
                          <circle
                            fill="#FFD347"
                            cx="255.997"
                            cy="255.997"
                            r="144.824"
                          />
                          <path
                            fill="#FFD347"
                            d="M256,56.849c-4.273,0-7.737-3.463-7.737-7.737V7.737C248.263,3.463,251.727,0,256,0
     s7.737,3.463,7.737,7.737v41.376C263.737,53.386,260.273,56.849,256,56.849z"
                          />
                          <path
                            fill="#FFD347"
                            d="M152.563,84.568c-2.674,0-5.274-1.387-6.707-3.869l-20.687-35.832
     c-2.136-3.7-0.869-8.432,2.832-10.569c3.701-2.134,8.432-0.87,10.569,2.832l20.687,35.832c2.136,3.7,0.869,8.432-2.832,10.569
     C155.206,84.234,153.876,84.568,152.563,84.568z"
                          />
                          <path
                            fill="#FFD347"
                            d="M76.823,160.294c-1.312,0-2.643-0.334-3.861-1.038L37.13,138.569
     c-3.7-2.136-4.968-6.868-2.832-10.569c2.136-3.701,6.868-4.967,10.569-2.832l35.832,20.687c3.7,2.136,4.968,6.868,2.832,10.569
     C82.097,158.907,79.497,160.294,76.823,160.294z"
                          />
                          <path
                            fill="#FFD347"
                            d="M49.112,263.737H7.737C3.464,263.737,0,260.274,0,256s3.464-7.737,7.737-7.737h41.376
     c4.273,0,7.737,3.463,7.737,7.737S53.385,263.737,49.112,263.737z"
                          />
                          <path
                            fill="#FFD347"
                            d="M41.005,387.869c-2.674,0-5.274-1.387-6.707-3.869c-2.136-3.7-0.869-8.432,2.832-10.569
     l35.832-20.687c3.7-2.134,8.432-0.87,10.569,2.832c2.136,3.7,0.869,8.432-2.832,10.569l-35.832,20.687
     C43.648,387.535,42.317,387.869,41.005,387.869z"
                          />
                          <path
                            fill="#FFD347"
                            d="M131.862,478.74c-1.312,0-2.643-0.334-3.861-1.038c-3.7-2.136-4.968-6.868-2.832-10.569
     l20.687-35.832c2.136-3.701,6.868-4.967,10.569-2.832c3.7,2.136,4.968,6.868,2.832,10.569l-20.687,35.832
     C137.136,477.352,134.536,478.74,131.862,478.74z"
                          />
                          <path
                            fill="#FFD347"
                            d="M256,512c-4.273,0-7.737-3.463-7.737-7.737v-41.376c0-4.274,3.464-7.737,7.737-7.737
     s7.737,3.463,7.737,7.737v41.376C263.737,508.537,260.273,512,256,512z"
                          />
                          <path
                            fill="#FFD347"
                            d="M380.138,478.74c-2.674,0-5.274-1.387-6.707-3.869l-20.687-35.832
     c-2.136-3.7-0.869-8.432,2.832-10.569c3.7-2.134,8.432-0.87,10.569,2.832l20.687,35.832c2.136,3.7,0.869,8.432-2.832,10.569
     C382.781,478.406,381.451,478.74,380.138,478.74z"
                          />
                          <path
                            fill="#FFD347"
                            d="M470.995,387.869c-1.312,0-2.643-0.334-3.861-1.038l-35.832-20.687
     c-3.7-2.136-4.968-6.868-2.832-10.569c2.136-3.701,6.868-4.967,10.569-2.832l35.832,20.687c3.7,2.136,4.968,6.868,2.832,10.569
     C476.269,386.481,473.669,387.869,470.995,387.869z"
                          />
                          <path
                            fill="#FFD347"
                            d="M504.263,263.737h-41.376c-4.273,0-7.737-3.463-7.737-7.737s3.464-7.737,7.737-7.737h41.376
     c4.273,0,7.737,3.463,7.737,7.737S508.536,263.737,504.263,263.737z"
                          />
                          <path
                            fill="#FFD347"
                            d="M435.177,160.294c-2.674,0-5.274-1.387-6.707-3.869c-2.136-3.7-0.869-8.432,2.832-10.569
     l35.832-20.687c3.7-2.134,8.432-0.87,10.569,2.832c2.136,3.7,0.869,8.432-2.832,10.569l-35.832,20.687
     C437.82,159.96,436.489,160.294,435.177,160.294z"
                          />
                          <path
                            fill="#FFD347"
                            d="M359.437,84.568c-1.312,0-2.643-0.334-3.861-1.038c-3.7-2.136-4.968-6.868-2.832-10.569
     l20.687-35.832c2.136-3.701,6.868-4.967,10.569-2.832c3.7,2.136,4.968,6.868,2.832,10.569l-20.687,35.832
     C364.711,83.181,362.11,84.568,359.437,84.568z"
                          />
                        </g>
                        <path
                          fill="#FFBE31"
                          d="M256,111.18c-5.242,0-10.418,0.286-15.516,0.828c72.685,7.743,129.303,69.252,129.303,143.991
   s-56.619,136.249-129.303,143.992c5.098,0.544,10.273,0.828,15.516,0.828c79.982,0,144.82-64.838,144.82-144.82
   S335.983,111.18,256,111.18z"
                        />
                      </svg>
                    </div>
                  ) : (
                    <div className="moon">
                      <svg
                        version="1.1"
                        id="Capa_1"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 499.712 499.712"
                        width="22"
                      >
                        <path
                          fill="#FFD93B"
                          d="M146.88,375.528c126.272,0,228.624-102.368,228.624-228.64c0-55.952-20.16-107.136-53.52-146.88
C425.056,33.096,499.696,129.64,499.696,243.704c0,141.392-114.608,256-256,256c-114.064,0-210.608-74.64-243.696-177.712
C39.744,355.368,90.944,375.528,146.88,375.528z"
                        />
                        <path
                          fill="#F4C534"
                          d="M401.92,42.776c34.24,43.504,54.816,98.272,54.816,157.952c0,141.392-114.608,256-256,256
c-59.68,0-114.448-20.576-157.952-54.816c46.848,59.472,119.344,97.792,200.928,97.792c141.392,0,256-114.608,256-256
C499.712,162.12,461.392,89.64,401.92,42.776z"
                        />
                        <g>
                          <polygon
                            fill="#FFD83B"
                            points="128.128,99.944 154.496,153.4 213.472,161.96 170.8,203.56 180.864,262.296
  128.128,234.568 75.376,262.296 85.44,203.56 42.768,161.96 101.744,153.4 	"
                          />
                          <polygon
                            fill="#FFD83B"
                            points="276.864,82.84 290.528,110.552 321.104,114.984 298.976,136.552 304.208,166.984
  276.864,152.616 249.52,166.984 254.752,136.552 232.624,114.984 263.2,110.552 	"
                          />
                        </g>
                      </svg>
                    </div>
                  )}
                </button>
              </Dropdown>
              <Dropdown
                as="li"
                className="nav-item d-flex align-items-center sync-data"
              >
                <button
                  ref={settBtnRef}
                  onClick={() => {
                    handleSetVechSetting();
                  }}
                  id="syncBtn"
                  disabled={loading}
                  className="bg-transparent border-0 mx-2"
                >
                  <i className={`fas fa-rotate ${loading && "fa-spin"}`}></i>
                </button>
              </Dropdown>
              <NotificationIcon />
              <Dropdown as="li" className="nav-item d-flex align-items-center ">
                <Dropdown.Toggle
                  variant="nav-link py-0 d-flex align-items-center"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  className="languages"
                >
                  <Image
                    src={`/flags/${router?.locale}.svg`}
                    width={24}
                    height={18}
                    alt={`${locale}`}
                    // style={{ borderRadius: "4px" }}
                    className="rounded"
                  />
                </Dropdown.Toggle>

                <Dropdown.Menu
                  className="dropdown-menu-end shadow S"
                  aria-labelledby="navbarDropdown"
                >
                  {otherLocales?.map((locale) => {
                    const { pathname, query, asPath } = router;

                    return (
                      <Dropdown.Item
                        key={"locale-" + locale}
                        className="py-0   d-flex flex-row align-items-center px-0"
                        onClick={() => {
                          dispatch(changeLanguage(locale));
                          setTimeout(() => {
                            router.reload();
                          }, 1300);
                        }}
                      >
                        <Link
                          href={{ pathname, query }}
                          as={asPath}
                          locale={locale}
                        >
                          <div className="nav-link mx-1 w-100 d-flex align-items-center gap-2 px-2">
                            <Image
                              src={`/flags/${locale}.svg`}
                              width={24}
                              height={18}
                              alt={`language--${locale}`}
                              // style={{ borderRadius: "4px" }}
                              className="rounded"
                            />
                            {locale === "ar"
                              ? "العربية"
                              : locale === "en"
                              ? "English"
                              : locale === "es"
                              ? "Spanish"
                              : locale === "fr"
                              ? "French"
                              : ""}
                          </div>
                        </Link>
                      </Dropdown.Item>
                    );
                  })}
                </Dropdown.Menu>
              </Dropdown>
              <Dropdown
                as="li"
                className={`${Styles["account-top"]} nav-item `}
              >
                <Dropdown.Toggle
                  variant="nav-link py-0 d-flex align-items-center"
                  id="navbarDropdown"
                  role="button"
                  ref={logOutRef}
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                  className="profile"
                >
                  <img
                    width={36}
                    height={36}
                    src={getAvater(config.userImg)}
                    style={{ aspectRatio: "1" }}
                    alt="User-Profile"
                    className="img-fluid avatar avatar-rounded avatar-rounded"
                  />

                  <div className="caption ms-3 d-none d-md-block text-start">
                    <h6 className="mb-0 caption-title">
                      {auth?.user?.username || auth.user?.user?.username}
                    </h6>
                    <p className="mb-0 caption-sub-title">
                      {process.env.NEXT_PUBLIC_HEADER_TITLE}
                    </p>
                  </div>
                </Dropdown.Toggle>

                <Dropdown.Menu
                  className="dropdown-menu-end shadow"
                  aria-labelledby="navbarDropdown profile"
                >
                  <Dropdown.Item as={Link} href="/Setting" className="p-2">
                    <a className="d-block dropdown-item">
                      <FontAwesomeIcon icon={faCog} size="sm" /> {t("Setting")}
                    </a>
                  </Dropdown.Item>
                  {!session[0].user?.user?.actormode &&
                  (userRole == "support" ||
                    userRole == "admin" ||
                    userRole == "accountmanager") ? (
                    <Dropdown.Item
                      as={Link}
                      href="/management/account-management/manageUsers"
                      className="p-2"
                    >
                      <a className="d-block dropdown-item">
                        <FontAwesomeIcon icon={faUser} size="sm" />{" "}
                        {t("Loginasuser")}
                      </a>
                    </Dropdown.Item>
                  ) : null}
                  <Dropdown.Divider />
                  <Dropdown.Item
                    as={"button"}
                    onClick={handleSignOut}
                    className="px-0"
                  >
                    <a
                      className="d-block dropdown-item d-flex align-items-center gap-1"
                      ref={logOutRef}
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} size="sm" />
                      {session[0].user?.user?.actormode ? (
                        <div>
                          {t("Logbackas")}{" "}
                          {
                            jwt_decode(session[0].user.user.parent.new_token)
                              .username
                          }
                        </div>
                      ) : (
                        t("Logout")
                      )}
                    </a>
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};
export default Header;
