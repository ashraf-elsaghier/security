import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Button, Card } from "react-bootstrap";
import { GoPlus } from "react-icons/go";
import { RiDeleteBin3Line } from "react-icons/ri";
import { BsInfoCircle } from "react-icons/bs";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaSpinner } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { MdOutlineContentCopy } from "react-icons/md";
import ActionButton from "../../../components/management/APIKeyManagement/ActionButton";
import { FiEdit } from "react-icons/fi";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { getSession } from "next-auth/client";
import { useSelector } from "react-redux";
const ManageAPIKeys = () => {
  const [loadingStatus, setLoadingStatus] = useState(null);
  const textareaRef = useRef(null);
  const [keys, setKeys] = useState([]);
  const { t } = useTranslation(["Management", "Tour"]);
  const darkMode = useSelector((state) => state.config.darkMode);

  const handleGenerateKey = async () => {
    try {
      setLoadingStatus("generate loading");
      const res = await axios.post("serviceIntegration/createApiKey");
      setKeys((prev) => [res.data, ...prev]);
    } catch (error) {
      toast.error("Something went Wrong");
    } finally {
      setLoadingStatus(null);
    }
  };
  const handleRegenerateKey = async (keyToRegenerate, keyID) => {
    try {
      setLoadingStatus("regenerate" + keyToRegenerate);
      const res = await axios.put(
        `serviceIntegration/regenerateApiKey?id=${keyID}`
      );
      const newKeys = keys.map((key) =>
        key.key == keyToRegenerate ? res.data : key
      );
      setKeys(newKeys);
    } catch (error) {
      toast.error("Something went Wrong");
    } finally {
      setLoadingStatus(null);
    }
  };
  const handleDeleteKey = async (keyToDelete, keyID) => {
    try {
      setLoadingStatus("delete key" + keyToDelete);
      const res = await axios.delete(
        `serviceIntegration/deleteApiKey?id=${keyID}`
      );
      const newKeys = keys.filter((key) => key.key != keyToDelete);
      setKeys(newKeys);
    } catch (error) {
      toast.error("Something went Wrong");
    } finally {
      setLoadingStatus(null);
    }
  };
  const handleDeleteAllKeys = async () => {
    try {
      setLoadingStatus("delete all loading");
      await axios.delete("serviceIntegration/deleteAllApiKey");
      setKeys([]);
    } catch (error) {
      toast.error("Something went Wrong");
    } finally {
      setLoadingStatus(null);
    }
  };

  const copyText = (text) => {
    textareaRef.current.value = text;
    textareaRef.current.select();
    document.execCommand("copy");
    toast.success("Text copied to clipboard");
  };
  const getAllKeys = async () => {
    try {
      const res = await axios.get("serviceIntegration/getApiKeys");
      if (Array.isArray(res.data)) {
        setKeys(res.data);
      }
    } catch (error) {
      toast.error("Cannot fetching Keys right now!");
    }
  };
  useEffect(() => {
    getAllKeys();
  }, []);
  return (
    <>
      <Card className="management">
        <Card.Body>
          <div className="items-parking-parent p-3" style={{ height: "auto" }}>
            <div className="d-flex justify-content-between align-items-center">
              <h3>{t("API KEYS")}</h3>
              <div className="buttons">
                {/*  delete all keys button */}
                <ActionButton
                  loadingStatus={loadingStatus}
                  disabled={!keys.length || loadingStatus}
                  buttonType={"delete all loading"}
                  handleAction={handleDeleteAllKeys}
                  icon={<RiDeleteBin3Line size={18} />}
                  classes={"text-danger"}
                  styles={{ background: "transparent", border: "transparent" }}
                />
                {/*  generate new key button */}
                <ActionButton
                  loadingStatus={loadingStatus}
                  disabled={loadingStatus == "generate loading"}
                  buttonType={"generate loading"}
                  handleAction={handleGenerateKey}
                  icon={<GoPlus size={16} />}
                  className="ms-2"
                  text={t("Generate Key")}
                />
              </div>
            </div>
            <div className="info-message d-flex gab-3 border border-primary rounded p-3 my-1">
              <div className="pe-2">
                <BsInfoCircle />
              </div>
              <p>
                <strong>{t("Generate Key")}?</strong> <br />
                {t("warning_gen_key")}
              </p>
            </div>
            <div className="my-3">
              {keys.length == 0 ? (
                <div className="d-flex justify-content-center">
                  <Image
                    src={"/assets/images/EmptyKeys.png"}
                    alt="empty data"
                    width={280}
                    height={280}
                  />
                </div>
              ) : (
                keys.map(({ key, _id }) => (
                  <div
                    className="mb-2 p-2 rounded d-flex  justify-content-between align-items-center border"
                    key={_id}
                    style={{
                      background: `${darkMode ? "transparent" : "#EEEEEE"}`,
                    }}
                  >
                    <p
                      style={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {key}
                    </p>
                    <div style={{ display: "flex", gap: "5px" }}>
                      <ActionButton
                        loadingStatus={loadingStatus}
                        disabled={loadingStatus}
                        buttonType={"copy"}
                        handleAction={() => copyText(key)}
                        icon={<MdOutlineContentCopy size={16} />}
                        classes={"text-primary"}
                        styles={{
                          background: `${darkMode ? "transparent" : "#fff"}`,
                          border: "transparent",
                          padding: "8px",
                        }}
                      />
                      <ActionButton
                        loadingStatus={loadingStatus}
                        disabled={loadingStatus}
                        buttonType={"regenerate" + key}
                        handleAction={() => handleRegenerateKey(key, _id)}
                        icon={<FiEdit size={16} />}
                        classes={"text-primary"}
                        text={t("Regenerate")}
                        styles={{
                          background: `${darkMode ? "transparent" : "#fff"}`,
                          border: "transparent",
                          padding: "8px",
                        }}
                      />
                      <ActionButton
                        loadingStatus={loadingStatus}
                        buttonType={"delete key" + key}
                        disabled={loadingStatus}
                        handleAction={() => handleDeleteKey(key, _id)}
                        icon={<IoMdClose size={16} />}
                        classes={"text-primary"}
                        styles={{
                          background: `${darkMode ? "transparent" : "#eee"}`,
                          border: "transparent",
                          padding: "8px",
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
              <textarea
                ref={textareaRef}
                style={{ position: "absolute", left: "-9999px" }}
              />
            </div>
          </div>
        </Card.Body>
      </Card>
    </>
  );
};

export default ManageAPIKeys;
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
        "Management",
        "main",
        "Tour",
        "common",
      ])),
    },
  };
}
