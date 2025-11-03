import React, { useState, useEffect } from "react";
import { createPicker } from "./utils";
import printDoc from "./printDoc";
import { Button } from "react-bootstrap";
import { useTranslation } from "next-i18next";
import { useSelector } from "react-redux";

const PDFExportPanel = (props) => {
  const { t } = useTranslation(["common", "reports", "main", "Table"]);
  const [PDF_PAGE_ORITENTATION, SET_PDF_PAGE_ORIENTATION] =
    useState("landscape");
  const [PDF_WITH_FOOTER_PAGE_COUNT, SET_PDF_WITH_FOOTER_PAGE_COUNT] =
    useState(true);
  const [PDF_HEADER_HEIGHT, SET_PDF_HEADER_HEIGHT] = useState(25);
  const [PDF_ROW_HEIGHT, SET_PDF_ROW_HEIGHT] = useState(15);

  const [PDF_ODD_BKG_COLOR, SET_PDF_ODD_BKG_COLOR] = useState("#0E6395");
  const [PDF_EVEN_BKG_COLOR, SET_PDF_EVEN_BKG_COLOR] = useState("#1aa053");
  const [PDF_WITH_CELL_FORMATTING, SET_PDF_WITH_CELL_FORMATTING] =
    useState(true);
  const [PDF_WITH_COLUMNS_AS_LINKS, SET_PDF_WITH_COLUMNS_AS_LINKS] =
    useState(true);

  const [PDF_SELECTED_ROWS_ONLY, SET_PDF_SELECTED_ROWS_ONLY] = useState(false);

  const PDF_HEADER_COLOR = "#f8f8f8";
  const PDF_INNER_BORDER_COLOR = "#dde2eb";
  const PDF_OUTER_BORDER_COLOR = "#babfc7";
  const PDF_LOGO = "";
  // "https://raw.githubusercontent.com/AhmedAGadir/ag-grid-todo-list-react-typescript/master/src/assets/new-ag-grid-logo.png";

  useEffect(() => {
    const pickrOddRowBkgColor = createPicker(
      ".color-picker-odd-row-bkg",
      PDF_ODD_BKG_COLOR
    );

    const pickEvenRowBkgColor = createPicker(
      ".color-picker-even-row-bkg",
      PDF_EVEN_BKG_COLOR
    );

    pickrOddRowBkgColor.on("save", (color, instance) => {
      const updatedColor = color.toHEXA().toString();
      SET_PDF_ODD_BKG_COLOR(updatedColor);
      instance.hide();
    });

    pickEvenRowBkgColor.on("save", (color, instance) => {
      const updatedColor = color.toHEXA().toString();
      SET_PDF_EVEN_BKG_COLOR(updatedColor);
      instance.hide();
    });
  }, []);

  const submitFormHandler = (event) => {
    event.preventDefault();

    const printParams = {
      PDF_HEADER_COLOR,
      PDF_INNER_BORDER_COLOR,
      PDF_OUTER_BORDER_COLOR,
      PDF_LOGO,
      PDF_PAGE_ORITENTATION,
      // PDF_WITH_HEADER_IMAGE,
      PDF_WITH_FOOTER_PAGE_COUNT,
      PDF_HEADER_HEIGHT,
      PDF_ROW_HEIGHT,
      PDF_ODD_BKG_COLOR,
      PDF_EVEN_BKG_COLOR,
      PDF_WITH_CELL_FORMATTING,
      PDF_WITH_COLUMNS_AS_LINKS,
      PDF_SELECTED_ROWS_ONLY,
    };

    printDoc(printParams, props.gridApi, props.columnApi);
    props.setOpenBtnsExportsModel(false);
  };
  const { darkMode } = useSelector((state) => state.config);

  return (
    <form onSubmit={submitFormHandler}>
      {/* <h4 className="text-secondary">PDF Export Options</h4> */}
      <div className="mb-2">
        <input
          className="form-check-input"
          type="radio"
          name="orientation"
          id="landscape"
          value="landscape"
          checked={PDF_PAGE_ORITENTATION === "landscape"}
          onChange={(event) => {
            if (event.target.checked) {
              SET_PDF_PAGE_ORIENTATION(event.currentTarget.value);
            }
          }}
        />
        <label
          className="form-check-label"
          htmlFor="landscape"
          style={{ margin: "0 5px" }}
        >
          {t("Landscape")}
        </label>
        <input
          className="form-check-input"
          type="radio"
          name="orientation"
          id="portrait"
          value="portrait"
          checked={PDF_PAGE_ORITENTATION === "portrait"}
          onChange={(event) => {
            if (event.target.checked) {
              SET_PDF_PAGE_ORIENTATION(event.currentTarget.value);
            }
          }}
        />
        <label
          className="form-check-label"
          htmlFor="portrait"
          style={{ margin: "0 5px" }}
        >
          {t("Portrait")}
        </label>
      </div>
      {/* <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          id="headerImage"
          checked={PDF_WITH_HEADER_IMAGE}
          onChange={(event) => {
            SET_PDF_WITH_HEADER_IMAGE(event.target.checked);
          }}
        />
        <label className="form-check-label" htmlFor="headerImage">
          Header image (ag-Grid logo)
        </label>
      </div> */}
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          id="footerPageCount"
          checked={PDF_WITH_FOOTER_PAGE_COUNT}
          onChange={(event) => {
            SET_PDF_WITH_FOOTER_PAGE_COUNT(event.target.checked);
          }}
        />
        <label
          className="form-check-label"
          htmlFor="footerPageCount"
          style={{ margin: "0 5px" }}
        >
          {t("Footer (page count)")}
        </label>
      </div>
      <div className="my-2">
        <input
          type="number"
          id="headerRowHeight"
          style={{
            width: 50,
            marginRight: 5,
            background: darkMode ? "rgb(21,24,36)" : "",
            border: "1px solid rgb(34,39,56)",
            color: darkMode ? "white" : "",
          }}
          value={PDF_HEADER_HEIGHT}
          onChange={(event) => {
            SET_PDF_HEADER_HEIGHT(parseInt(event.target.value));
          }}
        />
        <label htmlFor="headerRowHeight" style={{ margin: "0 5px" }}>
          {t("Header height")}{" "}
        </label>
      </div>
      <div className="my-2">
        <input
          type="number"
          id="cellRowHeight"
          style={{
            width: 50,
            marginRight: 5,
            background: darkMode ? "rgb(21,24,36)" : "",
            border: "1px solid rgb(34,39,56)",
            color: darkMode ? "white" : "",
          }}
          value={PDF_ROW_HEIGHT}
          onChange={(event) => {
            SET_PDF_ROW_HEIGHT(parseInt(event.target.value));
          }}
        />
        <label htmlFor="cellRowHeight"> {t("Cell height")} </label>
      </div>
      <div className="color-picker-container d-flex">
        <div className="color-picker-odd-row-bkg" />
        <div className="ms-2"> {t("Odd row background color")} </div>
      </div>
      <div className="color-picker-container d-flex">
        <div className="color-picker-even-row-bkg" />
        <div className="ms-2"> {t("Even row background color")} </div>
      </div>
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          id="exportWithFormatting"
          checked={PDF_WITH_CELL_FORMATTING}
          onChange={(event) => {
            SET_PDF_WITH_CELL_FORMATTING(event.target.checked);
          }}
        />
        <label
          className="form-check-label"
          htmlFor="exportWithFormatting"
          style={{ margin: "0 5px" }}
        >
          {t("Cell styles")}
        </label>
      </div>
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          id="exportColumnsAsLink"
          checked={PDF_WITH_COLUMNS_AS_LINKS}
          onChange={(event) => {
            SET_PDF_WITH_COLUMNS_AS_LINKS(event.target.checked);
          }}
        />
        <label className="form-check-label" htmlFor="exportColumnsAsLink">
          {t("Hyperlinks")}
        </label>
      </div>
      <div className="form-check">
        <input
          className="form-check-input"
          type="checkbox"
          id="selectedRowsOnly"
          checked={PDF_SELECTED_ROWS_ONLY}
          onChange={(event) => {
            SET_PDF_SELECTED_ROWS_ONLY(event.target.checked);
          }}
        />
        <label className="form-check-label" htmlFor="selectedRowsOnly">
          {t("Selected rows only")}
        </label>
      </div>

      <Button
        variant="primary p-2 ms-2"
        className="mb-2 mb-md-0 mt-2"
        type="submit"
      >
        {t("export_key")}
      </Button>
    </form>
  );
};

export default PDFExportPanel;
