import { useTranslation } from "next-i18next";
import React from "react";
import { ButtonGroup, Dropdown, DropdownButton } from "react-bootstrap";

export default function TypeFilter({
  searchOptions,
  setActiveFilter,
  activeFilter,
}) {
  const { t } = useTranslation(["common"]);
  return (
    <div>
      <DropdownButton
        as={ButtonGroup}
        title={t(activeFilter ?? "Search By")}
        align="start"
        variant="light"
        className="fs-5"
        style={{
          height: 48,
          width: 135,
        }}
      >
        {searchOptions?.map((item, idx) => {
          if (activeFilter !== item.value) {
            return (
              <Dropdown.Item
                className={`fs-6  text-capitalize ${
                  idx == searchOptions.length - 1 ? "" : "border-bottom"
                }`}
                style={{ padding: "6px 15px" }}
                onClick={() => {
                  setActiveFilter(item.value);
                }}
                key={idx}
              >
                {t(item.displayText)}
              </Dropdown.Item>
            );
          }
        })}
      </DropdownButton>
    </div>
  );
}