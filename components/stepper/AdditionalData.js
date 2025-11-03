import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import AgGridDT from "components/AgGridDT";
import { fetchAllUsers } from "services/scheduledReports";
import { useTranslation } from "next-i18next";
import { toast } from "react-toastify";

const AdditionalData = ({
  emailsValues,
  additionalNumbers,
  setDescription,
  setAdditionalEmails,

  currentUserData,
  reportData,
  setUsersID,
  setEmailsValues,
  showError,
  setShowError,
}) => {
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [rowsSelected, setrowsSelected] = useState([]);
  const [DataTable, setDataTable] = useState(null);

  const [emails, setEmails] = useState([]);
  const [phoneNumbers, setPhoneNumbers] = useState([]);
  const [showPhoneInput, setShowPhoneInput] = useState(false);

  const { t } = useTranslation(["scheduledReports", "common", "main"]);
  const inputRef = useRef();
  // fetch All scheduled Reports
  const onGridReady = useCallback(
    async (params) => {
      setGridApi(params.api);
      setGridColumnApi(params.columnApi);
      const response = await fetchAllUsers();
      setDataTable(response.users);
      if (currentUserData.email) {
        params?.api.forEachNode((node) => {
          if (emails?.includes(node.data.Email)) {
            node.setSelected(true);
          }
        });
      }
    },
    [emailsValues?.length]
  );

  // the default setting of the AG grid table .. sort , filter , etc...
  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      flex: 1,
      resizable: true,
      filter: true,
    };
  }, []);

  useEffect(() => {
    if (reportData) {
      if (reportData.data?.to.length > 0) {
        setEmails(reportData?.data?.to);
        setEmailsValues(reportData?.data?.to);
      }

      if (reportData?.AdditionalNumbers?.length > 0) {
        setPhoneNumbers(reportData.AdditionalNumbers);
      }
    }
  }, [reportData]);

  const getRowClass = (params) => {
    // if (params.data.Email === currentUserData.email) return "rowDisabled";
  };

  const handleEmailsSelection = (e) => {
    const selectedRows = gridApi.getSelectedRows();
    const selectedRowsEmail = selectedRows
      .map((row) => row.Email)
      .filter((email) => email !== null);

    const selectedRowsId = selectedRows.map((row) => row.ProfileID);

    setrowsSelected([...selectedRowsEmail]);
    setAdditionalEmails([...selectedRowsEmail]);
    setEmailsValues(Array.from(new Set(selectedRowsEmail.concat(emails))));
    setEmails(Array.from(new Set(selectedRowsEmail.concat(emails))));
    setUsersID(selectedRowsId);
  };

  const onRowSelected = (e) => {
    let selected = e.node.selected;
    let ProfileID = e.node.ProfileID;
    let Email = e.data.Email;
    if (selected && Email !== null) {
      setEmails((prev) => Array.from(new Set([...prev, Email])));
    } else {
      setEmails((prev) => prev.filter((mail) => mail !== Email));
    }
  };

  const addPhoneNumbers = (e) => {
    if (e.target.value !== "") {
      additionalNumbers.push(e.target.value);
      setPhoneNumbers([...phoneNumbers, e.target.value]);
      e.target.value = "";
    }
  };

  const handleDeleteEmail = (indexToRemove) => {
    const filterEmails = [
      ...emails.filter((_, index) => index !== indexToRemove),
    ];
    setEmails(filterEmails);
    setEmailsValues(filterEmails);
    setrowsSelected(filterEmails);
    setAdditionalEmails(filterEmails);

    gridApi?.forEachNode((node) => {
      if (!filterEmails?.includes(node.data.Email)) {
        node.setSelected(false);
      }
    });
  };

  const handleDeletePhone = (indexToRemove) => {
    setPhoneNumbers([
      ...phoneNumbers.filter((_, index) => index !== indexToRemove),
    ]);
    additionalNumbers.pop([
      ...phoneNumbers.filter((_, index) => index !== indexToRemove),
    ]);
  };

  // columns
  const columns = useMemo(
    () => [
      {
        headerName: "",
        field: "Select",
        maxWidth: 100,
        sortable: false,
        unSortIcon: false,
        checkboxSelection: true,
        headerCheckboxSelection: true,
        filter: false,
      },
      {
        headerName: t("Full_Name"),
        field: "FullName",
        minWidth: 300,
        maxWidth: 300,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: t("User_Name"),
        field: "UserName",
        minWidth: 300,
        maxWidth: 300,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: t("Email"),
        field: "Email",
        minWidth: 300,
        maxWidth: 300,
        sortable: true,
        unSortIcon: true,
      },
      {
        headerName: t("Number_of_Assigned_Vehicles"),
        field: "vehicle_count",
        minWidth: 400,
        maxWidth: 500,
        sortable: true,
        unSortIcon: true,
      },
    ],
    []
  );
  const onChangeHandler = (e) => {
    const { value } = inputRef.current;
    if (value !== "" && !/.+@.+\.[A-Za-z]+$/.test(value)) {
      setShowError(true);
    } else {
      setShowError(false);
    }
  };
  const onSubmitHandler = (e) => {
    const { value } = inputRef.current;
    e.preventDefault();
    if (emails.includes(value)) {
      toast.warn("Email Is Exist");
    } else if (value !== "" && !showError && !emails.includes(value)) {
      setEmails((prevEmails) => [...prevEmails, value]);
      setEmailsValues((prevEmails) => [...prevEmails, value]);
      inputRef.current.value = "";
    }
  };
  return (
    <div className="container-fluid">
      <Row>
        <Col sm="12">
          <Card>
            <Card.Body>
              <AgGridDT
                rowHeight={65}
                columnDefs={columns}
                rowSelection={"multiple"}
                rowMultiSelectWithClick={"true"}
                onSelectionChanged={handleEmailsSelection}
                onRowSelected={onRowSelected}
                defaultColDef={defaultColDef}
                onGridReady={onGridReady}
                gridApi={gridApi}
                gridColumnApi={gridColumnApi}
                rowData={DataTable}
                getRowClass={getRowClass}
                type="users"
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h5 className="mb-2">{t("Additional_Emails")}</h5>
      <div className="d-flex justify-content-between gap-3">
        <div className="w-100">
          <form onSubmit={onSubmitHandler}>
            <input
              type="email"
              name="emails"
              className={`bg-transparent form-control w-100 ${
                showError ? "border border-danger" : ""
              }`}
              placeholder={t("Enter_Your_Email")}
              ref={inputRef}
              onChange={onChangeHandler}
              onBlur={onSubmitHandler}
            />
          </form>
        </div>
        {/* <Button className="w-25" onClick={() => addEmails(inputRef)}>
          Add Email
        </Button> */}
      </div>
      {showError && (
        <small className="text-danger">{t("Please_Enter_A_Valid_Email")}</small>
      )}
      <div className="d-flex flex-column align-items-start w-100 gap-2  mb-3 py-4">
        {emails.length > 0 && (
          <div
            className="bg-soft-primary w-100 p-2"
            style={{ flexWrap: "wrap" }}
          >
            <ul className=" list-unstyled d-flex align-items-center gap-2 w-100 rounded-1 mb-0 flex-wrap ">
              {emails.map((email, index) => (
                <li
                  key={index}
                  className="bg-primary text-white   rounded-1 m-0  p-2"
                >
                  {email}
                  <FontAwesomeIcon
                    className="ms-1 "
                    style={{ cursor: "pointer" }}
                    icon={faTrash}
                    size="sm"
                    onClick={() => handleDeleteEmail(index)}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="w-25">
          {showPhoneInput && (
            <>
              <p className="mb-2 ">Additional Phones</p>
              <div className="d-flex align-items-center bg-soft-primary p-2 gap-2 rounded-1 ">
                {phoneNumbers.map((number, index) => (
                  <ul key={index} className=" list-unstyled m-0">
                    <li className="bg-primary text-white p-1 rounded-1">
                      {number}

                      <FontAwesomeIcon
                        className="ms-1 "
                        style={{ cursor: "pointer" }}
                        icon={faTrash}
                        size="sm"
                        onClick={() => handleDeletePhone(index)}
                      />
                    </li>
                  </ul>
                ))}
                <input
                  type="number"
                  className="bg-transparent border-0"
                  onKeyUp={(e) =>
                    e.key === "Enter" ? addPhoneNumbers(e) : null
                  }
                  onBlur={(e) => addPhoneNumbers(e)}
                  placeholder="Enter Your Phone Number.."
                />
              </div>
            </>
          )}
        </div>
      </div>

      <p className="mb-2">{t("Schedule_Description")}</p>
      <textarea
        type="number"
        className="w-100 mb-5 border-0 bg-soft-primary p-2 rounded-1"
        onChange={(e) => setDescription(e.target.value)}
        defaultValue={reportData?.data?.Description ?? ""}
      />
    </div>
  );
};

export default AdditionalData;
