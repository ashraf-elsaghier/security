import { useSession } from "next-auth/client";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";
import { MdOutlineAttachEmail, MdOutlineSupport } from "react-icons/md";
import { Accordion } from "react-bootstrap";
import { BsFillPinMapFill } from "react-icons/bs";
import { toast } from "react-toastify";
import Dashboard from "icons/Dashboard";
import Track from "icons/Track";
import PreventiveMaintenance from "icons/PreventiveMaintenance";
import Reports from "icons/Reports";
import ScheduledReports from "icons/ScheduledReports";
import DriversManagement from "icons/DriversManagement";
import Management from "icons/Management";
import VehiclesCamera from "icons/VehiclesCamera";
import Notify from "icons/Notify";
export default function VerticalNav() {
  const { t } = useTranslation("main");
  let router = useRouter();
  const session = useSession();
  const userRole = session[0]?.user?.user?.role?.toLowerCase();
  console.log(userRole, "userRole");

  // add additional nav links here
  // mandatory: title, href, Icon, roles
  // for roles: it takes an array of allowed roles or an array of restricted roles
  // in case of restrict roles add an additional property restrictRoles with value true
  // in case of showing the link but it's not accessable add an additionsl property isDisabled
  let links = [
    {
      title: t("support_representative"),
      href: "/support-representative",
      Icon: MdOutlineSupport,
      roles: ["supportrepresentative"],
    },
    {
      title: t("Dashboard"),
      href: "/",
      Icon: Dashboard,
      roles: ["user", "supportrepresentative"],
      restrictRoles: true,
    },
    {
      title: t("Track"),
      href: "/track",
      Icon: Track,
      isDisabled: true,
      roles: ["supportrepresentative"],
      restrictRoles: true,
    },
    {
      title: t("Preventive_Maintenance"),
      href: "/preventiveMaintenance",
      Icon: PreventiveMaintenance,
      roles: ["supportrepresentative", "basicuser"],
      restrictRoles: true,
    },
    {
      title: t("Reports"),
      href: "/reports",
      Icon: Reports,
      roles: ["supportrepresentative", "basicuser"],
      restrictRoles: true,
    },
    {
      title: t("Scheduled_Reports"),
      href: "/scheduledReports",
      Icon: ScheduledReports,
      isDisabled: true,
      roles: ["user", "supportrepresentative", "basicuser"],
      restrictRoles: true,
    },
    {
      title: t("Operate_Driver"),
      href: "/driversManagement",
      Icon: DriversManagement,
      roles: [
        "user",
        "accountmanager",
        "fleet",
        "supportrepresentative",
        "basicuser",
      ],
      restrictRoles: true,
    },
    {
      title: t("Email_Log"),
      href: "/EmailLog",
      Icon: MdOutlineAttachEmail,
      roles: [
        "user",
        "accountmanager",
        "fleet",
        "supportrepresentative",
        "basicuser",
      ],
      restrictRoles: true,
    },
    {
      title: t("Management"),
      href: "/management",
      Icon: Management,
      roles: ["user", "accountmanager", "supportrepresentative", "basicuser"],
      restrictRoles: true,
    },
    {
      title: t("Vehicles_Camera"),
      href: "/VehiclesCamera",
      Icon: VehiclesCamera,
      roles: [
        "user",
        "accountmanager",
        "fleet",
        "supportrepresentative",
        "basicuser",
      ],
      restrictRoles: true,
    },
    {
      title: t("Notify"),
      href: "/notify",
      Icon: Notify,
      roles: ["support"],
    },
    {
      title: t("track-sheet"),
      href: "/track-sheet",
      Icon: BsFillPinMapFill,
      isDisabled: true,
      roles: ["supportrepresentative", "basicuser"],
      restrictRoles: true,
    },
  ];

  return (
    <>
      <Accordion as="ul" className="navbar-nav iq-main-menu">
        {links.map((item, index) => {
          const { title, href, Icon, roles } = item;
          return (
            item.restrictRoles
              ? !roles.includes(userRole)
              : roles.includes(userRole) || roles.includes("all")
          ) ? (
            <Accordion.Item
              key={index}
              as="li"
              eventKey="horizontal-menu"
              bsPrefix="nav-item"
              style={
                userRole === "support" && item.isDisabled
                  ? {
                      opacity: "0.5",
                    }
                  : {}
              }
              onClick={
                userRole === "support" && item.isDisabled
                  ? () =>
                      toast.info(
                        "This Page Is For Users Only, You Can Login As User"
                      )
                  : null
              }
            >
              <Link
                href={userRole === "support" && item.isDisabled ? "#" : href}
                passHref={true}
              >
                <a
                  target={
                    href == "/track-sheet" && userRole !== "support"
                      ? "_blank"
                      : ""
                  }
                >
                  <div
                    className={`${
                      router.pathname === href ? "active" : ""
                    } nav-link `}
                  >
                    <i className="icon">
                      <Icon size={24} />
                    </i>
                    <span className="item-name">{title}</span>
                  </div>
                </a>
              </Link>
            </Accordion.Item>
          ) : null;
        })}
      </Accordion>
      <div className="app-version text-light">
        V@{process.env.NEXT_PUBLIC_VERSION}
      </div>
    </>
  );
}
