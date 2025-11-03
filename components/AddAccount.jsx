import { Modal } from "react-bootstrap";
import style from "../styles/NewAddDriver.module.scss";
import GroupInput from "./GroupInput";
import GroupSelect from "./GroupSelect";

const AddAccount = (props) => {
  const {
    title,
    handleSubmit,

    accountName,
    parentAccount,
    billingPeriod,
    billingStartedOn,
    nextBillingDate,
    accountTag,
    reseller,
    identity,
    mobileNum,
    phoneNumber,
    email,
    managerPhoneNumber,
    recordIssueDateHijri,
    extensionNumber,
    managerName,
    managerMobileNumber,

    handleAccountName,
    handleParentAccount,
    handleBillingPeriod,
    handleBillingStartedOn,
    handleNextBillingDate,
    handleAccountTag,
    handleReseller,
    handleAccountType,
    handleIdentity,
    handleMobileNum,
    handlePhoneNumber,
    handleEmail,
    handleManagerPhoneNumber,
    handleRecordIssueDateHijri,
    handleExtensionNumber,
    handleManagerName,
    handleManagerMobileNumber,

    loading,
    textBtn = "",
  } = props;

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      className="NewAddDriverBx"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form className="w-100 m-auto" onSubmit={handleSubmit}>
          <div className="row">
            <GroupInput
              id="AccountName"
              title="Account Name"
              type="text"
              value={accountName}
              handleOnChange={handleAccountName}
              style={style.inputBorder}
            />
            <GroupInput
              id="ParentAccount"
              title="Parent Account"
              type="text"
              value={parentAccount}
              handleOnChange={handleParentAccount}
              style={style.inputBorder}
            />

            {/* value={lastName} */}

            {/* input-group w-50 d-flex col-12 col-md-6 align-items-center mb-3 */}

            <GroupInput
              id="BillingPeriod"
              title="Billing Period"
              type="text"
              value={billingPeriod}
              handleOnChange={handleBillingPeriod}
              style={style.inputBorder}
            />

            <GroupInput
              id="BillingStartedOn"
              title="Billing Started On"
              type="date"
              value={billingStartedOn}
              handleOnChange={handleBillingStartedOn}
              style={style.inputBorder}
            />

            <GroupInput
              id="NextBillingDate"
              title="Next Billing Date"
              type="date"
              value={nextBillingDate}
              handleOnChange={handleNextBillingDate}
              style={style.inputBorder}
            />

            <GroupInput
              id="AccountTag"
              title="Account Tag"
              type="tel"
              value={accountTag}
              handleOnChange={handleAccountTag}
              style={style.inputBorder}
            />

            <div
              className={`form-check d-flex col-12 col-md-6 mb-3 ${style.checkBx}`}
            >
              <label
                className="form-check-label fw-bold text-dark"
                htmlFor="reseller"
              >
                Reseller
              </label>
              <input
                id="reseller"
                className="form-check-input"
                type="checkbox"
                checked={reseller}
                onChange={handleReseller}
              />
            </div>

            <GroupSelect
              id="accountType"
              title="Account Type"
              handleOnChange={handleAccountType}
              style={`form-group justify-content-between d-flex col-12 col-md-6 align-items-center mb-3 ${style.selectBx}`}
            />

            <h4 className="col-md-12 text-decoration-underline mb-2">
              Wasl Integration (Optional)
            </h4>

            <GroupInput
              id="identity"
              title="Identity Number"
              type="number"
              value={identity}
              handleOnChange={handleIdentity}
              style={style.inputBorder}
            />

            <GroupInput
              id="CommercialRecordNumber"
              title="Commercial Record Number"
              type="number"
              value={mobileNum}
              handleOnChange={handleMobileNum}
              style={style.inputBorder}
            />
            <GroupInput
              id="PhoneNumber"
              title="Phone Number"
              type="tel"
              value={phoneNumber}
              handleOnChange={handlePhoneNumber}
              style={style.inputBorder}
            />

            <GroupInput
              id="Email"
              title="Email Address"
              type="email"
              value={email}
              handleOnChange={handleEmail}
              style={style.inputBorder}
            />
            <GroupInput
              id="ManagerPhoneNumber"
              title="Manager Phone Number"
              type="number"
              value={managerPhoneNumber}
              handleOnChange={handleManagerPhoneNumber}
              style={style.inputBorder}
            />

            <GroupInput
              id="RecordIssueDateHijri"
              title="Record Issue Date Hijri"
              type="number"
              value={recordIssueDateHijri}
              handleOnChange={handleRecordIssueDateHijri}
              style={style.inputBorder}
            />
            <GroupInput
              id="ExtensionNumber"
              title="Extension Number"
              type="number"
              value={extensionNumber}
              handleOnChange={handleExtensionNumber}
              style={style.inputBorder}
            />

            <GroupInput
              id="ManagerName"
              title="Manager Name"
              type="text"
              value={managerName}
              handleOnChange={handleManagerName}
              style={style.inputBorder}
            />

            <GroupInput
              id="ManagerMobileNumber"
              title="Manager Mobile Number"
              type="number"
              value={managerMobileNumber}
              handleOnChange={handleManagerMobileNumber}
              style={style.inputBorder}
            />
          </div>

          <button type="submit" className="btn btn-primary w-50 mt-2 py-2">
            {loading ? "Loading..." : textBtn}
          </button>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default AddAccount;
