import axios from "axios";
import { getSession } from "next-auth/client";
import { useState, useCallback, useMemo } from "react";
import { Button, Card } from "react-bootstrap";
import { AiOutlineDelete, AiOutlineEdit, AiOutlineEye } from "react-icons/ai";
import { toast } from "react-toastify";
import AgGridDT from "../components/AgGridDT";
import AddModal from "../components/notify/AddModal";
import ViewModal from "../components/notify/ViewModal";
import DeleteModal from "components/Modals/DeleteModal";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";

const NotifySettings = () => {
  const router = useRouter();
  const { t } = useTranslation("main");

  const [allAccounts, setAllAccounts] = useState([]);
  const [updateSettings, setUpdateSettings] = useState(null);
  const [modalShow, setModalShow] = useState(false);
  const [viewModalShow, setViewModalShow] = useState(false);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);
  const [showModalDelete, setshowModalDelete] = useState(false);
  const [loadingDelete, setloadingDelete] = useState();

  const [deleteId, setDeletedId] = useState(0);

  // get All accounts settings

  const fetchAllAccounts = useCallback(async () => {
    try {
      const req = await axios.get("/notify/getAS");
      setAllAccounts(req.data.AccountSettings);
    } catch (error) {
      toast.error("oops something went wrong!, " + error.message);
    }
  }, [setAllAccounts]);

  const onGridReady = useCallback(
    async (params) => {
      try {
        await fetchAllAccounts();
        setGridApi(params.api);
        setGridColumnApi(params.columnApi);
      } catch (error) {
        toast.error("oops something went wrong!, " + error.message);
      }
    },
    [setAllAccounts, setGridApi, setGridColumnApi]
  );

  // delete account settings function
  // async function deleteSettings(id) {
  //   try {
  //     const addRequest = await axios.delete(`/notify/getAS/${id}`);
  //     toast.success("Account settings deleted successfully.");
  //     setAllAccounts((prev) => prev.filter((item) => item.ID !== id));
  //     return addRequest.data;
  //   } catch (error) {
  //     toast.error("something went wrong");
  //   }
  // }

  const onDeleteSelected = async (id) => {
    setshowModalDelete(true);
    setDeletedId(id);
  };

  const onDelete = async () => {
    setloadingDelete(true);
    try {
      const addRequest = await axios.delete(`/notify/getAS/${deleteId}`);
      toast.success("Account settings deleted successfully.");
      setAllAccounts((prev) => prev.filter((item) => item.ID !== deleteId));
      setloadingDelete(false);
      setshowModalDelete(false);
      return addRequest.data;
    } catch (error) {
      toast.error("something went wrong");
      setloadingDelete(false);
      setshowModalDelete(false);
    }
  };

  // account settings table columns
  const columnDefs = [
    {
      headerName: "Actions",
      field: "ID",
      minWidth: 180,
      filter: false,
      cellRenderer: (params) => (
        <div className="d-flex gap-1 align-items-center justify-content-center mt-2">
          <Button
            onClick={() => {
              setUpdateSettings(params.data);
              setViewModalShow(true);
            }}
            variant="primary"
          >
            <AiOutlineEye />
          </Button>
          <Button
            onClick={() => {
              setModalShow(true);
              setUpdateSettings(params.data);
            }}
            variant="info"
          >
            <AiOutlineEdit />
          </Button>
          <Button
            // onClick={() => deleteSettings(params.data.ID)}
            onClick={() => onDeleteSelected(params.data.ID)}
            variant="danger"
          >
            <AiOutlineDelete />
          </Button>
        </div>
      ),
    },
    {
      headerName: "AccountID",
      field: "AccountID",
      minWidth: 150,
      sortable: true,
      unSortIcon: true,
    },
    {
      headerName: "Emails",
      field: "Emails",
      minWidth: 300,
      sortable: true,
      unSortIcon: true,
    },
    {
      headerName: "Mobiles",
      field: "Mobiles",
      sortable: true,
      unSortIcon: true,
    },
    {
      headerName: "Notify Type",
      field: "NotifyType",
      sortable: true,
      unSortIcon: true,
    },
    {
      headerName: "Notify Channels",
      field: "NotifyChannels",
      sortable: true,
      unSortIcon: true,
    },
    {
      headerName: "Fire Wait Sec",
      field: "FireWaitSec",
      sortable: true,
      unSortIcon: true,
    },
    {
      headerName: "Unfire Wait Sec",
      field: "UnfireWaitSec",
      sortable: true,
      unSortIcon: true,
    },
    {
      headerName: "Notify Wait Sec",
      field: "NotifyWaitSec",
      sortable: true,
      unSortIcon: true,
    },
    {
      headerName: "Custom Settings",
      field: "CustomSettings",
      sortable: true,
      unSortIcon: true,
    },
    {
      headerName: "Modify Time",
      field: "ModifyTime",
      sortable: true,
      unSortIcon: true,
    },
  ];
  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      flex: 1,
      resizable: true,
      filter: true,
    };
  }, []);

  return (
    <Card className="mx-3">
      <Card.Body>
        <Button
          className="p-2 mb-2"
          onClick={() => {
            setModalShow(true);
            setUpdateSettings(null);
          }}
        >
          Add account settings
        </Button>
        <AddModal
          modalShow={modalShow}
          setModalShow={setModalShow}
          AllAccounts={allAccounts}
          setAllAccounts={setAllAccounts}
          updateData={updateSettings}
          fetchAllAccounts={fetchAllAccounts}
        />

        <DeleteModal
          show={showModalDelete}
          loading={loadingDelete}
          title="Delete Account Settings"
          confirmText="Yes,delete!"
          cancelText="No,cancel"
          onConfirm={onDelete}
          onCancel={() => {
            setshowModalDelete(false);
          }}
        />

        <ViewModal
          show={viewModalShow}
          setShow={setViewModalShow}
          data={updateSettings}
        />
        <AgGridDT
          rowHeight={44}
          columnDefs={columnDefs}
          rowData={allAccounts}
          onGridReady={onGridReady}
          gridApi={gridApi}
          gridColumnApi={gridColumnApi}
          defaultColDef={defaultColDef}
        />
      </Card.Body>
    </Card>
  );
};

export default NotifySettings;

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  if (session?.user?.user?.role?.toLowerCase() !== "support") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
      ...(await serverSideTranslations(context.locale, [
        "main",
        "forms",
        "management",
      ])),
    },
  };
}
