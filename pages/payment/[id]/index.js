import React, { useEffect, useMemo, useState } from "react";
import { Button, Form, Alert, Row, Col, Card, Modal } from "react-bootstrap";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import MasterCard from "../../../icons/mastercard";
import Visa from "../../../icons/visa";
import Mada from "../../../icons/mada";
import axios from "axios";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import AgGridDT from "../../../components/AgGridDT";
import { toast } from "react-toastify";
import { toggle as tourToggle, disableTour, enableTour } from "lib/slices/tour";
import style from "styles/scss/custom/components/tour-step/tourStep.module.scss";
import Joyride, { ACTIONS, EVENTS, STATUS } from "react-joyride";
import useStepDashboard from "hooks/useStepDashboard";
import { getSession } from "next-auth/client";
const Payment = () => {
  const { t } = useTranslation(["Management", "Tour"]);
  const { darkMode } = useSelector((state) => state.config);
  // model shows
  const [sendData, setSendData] = useState({
    Amount: "",
    EntityId: "",
  });
  // array all invoices
  const [allivoices, setAllInvoices] = useState([]);

  const [checkclick, setCheckClick] = useState("btn1");
  const [show, setShow] = useState(false);
  const Router = useRouter();
  const dispatch = useDispatch();
  const tourState = useSelector((state) => state.tour.run);
  const allSteps = useStepDashboard();
  const handleJoyrideCallback = (data) => {
    const { action, index, status, type } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setState({ stepIndex: 0, steps: steps });
      dispatch(tourToggle());
    } else if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      const nextStepIndex = index + (action === ACTIONS.PREV ? -1 : 1);

      if (index === 11 && action === ACTIONS.PREV) {
        setState({
          stepIndex: nextStepIndex,
          steps: steps,
        });
      } else if (data.action === "close" || data.action === "reset") {
        dispatch(disableTour());
      } else {
        setState({
          stepIndex: nextStepIndex,
          steps: steps,
        });
      }
    }
  };
  const [{ stepIndex, steps }, setState] = useState({
    stepIndex: 0,
    steps: allSteps["paymentSteps"],
  });
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => {
    setShow(true);
  };
  const GetDataInvoices = async (incoming) => {
    try {
      const userInvoices = JSON.parse(Cookies.get("invoice inforamtion"));
      const data = {
        customer_id: userInvoices.customer_id,
        amount: 1,
        reference_number: userInvoices.reference_number,
        invoice_id: userInvoices.invoice_id,
        amount_applied: 1,
        hyperpay_id: incoming.id,
      };

      const response = await axios({
        method: "post",
        url: "/checkout",
        data: data,
      });
      toast.success("You Paid SuccessFully :)");
      GetAllInvoices();
    } catch (error) {
      console.log("reeor", error);
    }
    //   return response.data;
  };
  const GetStatus = async () => {
    const getEntity = Cookies.get("entityid");
    const checkoutiud = Cookies.get("checkout");
    const userInvoices = JSON.parse(Cookies.get("invoice inforamtion") ?? "{}");

    await axios
      .get(
        `https://eu-test.oppwa.com/v1/checkouts/${checkoutiud}/payment?entityId=${getEntity}`,
        {
          headers: {
            Authorization:
              "Bearer OGFjN2E0Yzk4MjU2NGEzYjAxODI1OGFmMWY4NjE4NDh8SE1xMjlOM1pteg==",
          },
        }
      )
      .then((res) => {
        GetDataInvoices(res.data);
      })
      .catch((error) => {
        console.error("errroors", error);
      });
  };

  useEffect(() => {
    if (Router.query) {
      GetStatus();
    }
  }, []);
  //  use effect put data into array

  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      flex: 1,
      resizable: true,
      filter: true,
    };
  }, []);

  //take amount when click in pay buttons
  const handlepaid = (values) => {
    setSendData({ ...sendData, Amount: Math.round(values.data.balance) });
    Cookies.set("invoice inforamtion", JSON.stringify(values.data));
    handleShow();
  };

  // take id from payment vis
  const HandleEntityID = (data) => {
    setCheckClick(data);
    if (data == "master") {
      setSendData({
        ...sendData,
        EntityId: "8ac7a4c982564a3b018258b1700f1855",
      });
    } else if (data == "mada") {
      setSendData({
        ...sendData,
        EntityId: "8ac7a4c982564a3b018258b1ee9e185d",
      });
    }
  };

  const HandlePayment = async () => {
    let x = `entityId=${sendData.EntityId}&amount=${sendData.Amount}&currency=SAR&paymentType=DB&merchantTransactionId=ea2375c7-fd20-4628-a484-751a6582e056&testMode=EXTERNAL&merchantTransactionId=ea2375c7-fd20-4628-a484-751a6582e056&customer.email=test@gmail.com&billing.street1=test&billing.city=test&billing.state=KSA&billing.country=EG&billing.postcode=123&customer.givenName=username&customer.surname=test`;
    // Cookies.set('userId', sendData.id)

    var config = {
      method: "post",
      url: "https://eu-test.oppwa.com/v1/checkouts",
      headers: {
        Authorization:
          "Bearer OGFjN2E0Yzk4MjU2NGEzYjAxODI1OGFmMWY4NjE4NDh8SE1xMjlOM1pteg==",
        "Content-Type": "application/x-www-form-urlencoded",
        Cookie:
          "ak_bmsc=2331A4C254CBD8E7A075E4CD81CA3369~000000000000000000000000000000~YAAQ7Q4VAvH0V0uFAQAAMLP+pRI734zItnGM8UQBgkreF6d5KYIkGg+AZPpeJXgjOCbFPT/AelekJvuSbKNmGuN6YEuccu8G06IR/Lx28PSUDhuMjbOVnpRkYx3zEwKe6QGpDdU/8yf9g/j0EdUlE57SkzrUy3Y98T0XTmAxHscg0tiN8Oq5X76PIiZP9YQ2NeqKCn8Q7kxueLft2s9QSDhLpYx6XiFpkKAqsuS4UadeglJLKbe9sw1IqeQ4t9BC7motf9QLKTGY7k+E360d2FOROS9vRo1/zEeX1DFySKRW1eGsflCnruJRVlQdZ5vVFag/4MndhWXuGCBcrZX/Vr1QFzM/02xsx2pycfiSEFI6H8If8CL7+J3nRA==",
      },
      data: x,
    };
    axios(config)
      .then(function (response) {
        Cookies.set("entityid", sendData.EntityId);
        Cookies.set("checkout", response?.data?.id);
        Router.replace(`/from.html?q=${response?.data?.id}`);
        handleClose();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const columns = useMemo(
    () => [
      {
        headerName: `${t("invoice Id")}`,
        field: "invoice_id",
        minWidth: 170,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("customer_name")}`,
        field: "customer_name",
        minWidth: 150,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("date")}`,
        field: "date",
        minWidth: 150,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("invoice_url")}`,
        field: "invoice_url",
        cellRenderer: (params) => (
          <div>
            {/* <button onClick={() => yara(params)} className="btn btn-outline-primary m-1">

                            {t("Complete_User_Creation")}
                        </button> */}
            <a target="_blanck" href={params.data.invoice_url}>
              INVOICE_URL
            </a>
          </div>
        ),
        minWidth: 140,
        unSortIcon: true,
      },
      {
        headerName: `${t("Balance")}`,
        field: "balance",
        maxWidth: 130,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: `${t("Status")}`,
        field: "status",
        minWidth: 200,
        sortable: true,
        unSortIcon: true,
        cellRenderer: (params) => {
          // put the value in bold
          return (
            <>
              <div className="d-flex justify-content-between">
                <div>
                  <p style={{ width: "50px" }}>{params.value}</p>
                </div>
                <div>
                  <button
                    disabled={params.data.Status == "PAID"}
                    onClick={() => handlepaid(params)}
                    className="btn btn-primary py-1 px-3"
                  >
                    CheckOut
                  </button>
                </div>
              </div>
            </>
          );
        },
      },
    ],
    [t]
  );

  const GetAllInvoices = async () => {
    const response = await axios.get("/invoices?pageSize=1&pageNumber=1");
    setAllInvoices(response.data.invoices);
  };

  // useEffect to get all invoices
  useEffect(() => {
    GetAllInvoices();
  }, []);

  // End  AGI Grid

  return (
    <>
      <Joyride
        steps={steps}
        continuous
        callback={handleJoyrideCallback}
        run={tourState}
        stepIndex={stepIndex}
        showSkipButton
        locale={{
          skip: <span className={style["skip-tour"]}>{t("skip_tour")}</span>,
          back: <span className={style["skip-tour"]}>{t("back")}</span>,
          next: <span>{t("next")}</span>,
          last: <span>{t("last")}</span>,
        }}
        styles={{
          options: {
            primaryColor: "#2C7BC6",
            overlayColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 50000,
            width: "379px",
            backgroundColor: "#E0EAE9",
          },
        }}
      />
      <div className="paymet">
        <Card>
          <Card.Body>
            <Row>
              <h4
                className={`${
                  darkMode ? "text-white" : "text-dark"
                }fs-2 fw-bolder`}
              >
                {t("Billing")} & {t("invoices")}{" "}
              </h4>

              <p
                className={`${
                  darkMode ? "text-white-50" : "text-black-50"
                } w-50 my-3`}
              >
                {t(
                  "View all your invoices and receipts and make sure you pay your employees on time"
                )}{" "}
              </p>

              <div className="table">
                <Card.Body>
                  <AgGridDT
                    rowHeight={65}
                    columnDefs={columns}
                    rowData={allivoices || []}
                    paginationNumberFormatter={function (params) {
                      return params.value.toLocaleString();
                    }}
                    defaultColDef={defaultColDef}
                    footer={false}
                  />

                  <Modal centered show={show} onHide={handleClose}>
                    <Modal.Header>
                      <Modal.Title>
                        You must choose a payment method
                      </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <div className="d-flex justify-content-around align-items-center">
                        {/* master card  */}
                        <div
                          onClick={() => HandleEntityID("mada")}
                          className={`d-flex justify-content-center ${
                            checkclick == "mada"
                              ? " bg-light shadow-sm rounded-2 master w-75"
                              : "w-75"
                          }`}
                        >
                          <Mada width={100} />
                        </div>
                        {/* mada */}
                        <div
                          onClick={() => HandleEntityID("master")}
                          className={`${
                            checkclick == "master"
                              ? " bg-light shadow-sm rounded-2 master w-75"
                              : "w-75"
                          } d-flex gap-2 justify-content-center align-items-center`}
                        >
                          <Visa width={100} />
                          <MasterCard width={100} />
                        </div>
                      </div>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        className="py-2 px-4"
                        variant="secondary"
                        onClick={handleClose}
                      >
                        Close
                      </Button>
                      <Button
                        className="py-2 px-4"
                        variant="primary"
                        onClick={HandlePayment}
                      >
                        Save Changes
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </Card.Body>
              </div>
            </Row>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};

export default Payment;

// translation ##################################

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  const userRole = session?.user?.user?.role?.toLowerCase();
  const isUserOrFleet = userRole === "user" || userRole === "fleet";

  if (!session || isUserOrFleet) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {
      ...(await serverSideTranslations(context.locale, [
        "main",
        "Management",
        "Tour",
      ])),
    },
  };
}
