import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { IoIosSearch } from "react-icons/io";
import { CgSearch } from "react-icons/cg";

export default function SearchField({
  loading,
  searchParam,
  setSearchParam,
  onSearch,
  activeFilter,
}) {
  return (
    <form
      className="w-100"
      style={{ position: "relative", display: "flex", alignItems: "center" }}
      onSubmit={onSearch}
    >
      <label
        htmlFor="search"
        style={{ left: "7px", zIndex: 44, cursor: "pointer" }}
        className="text-danger h-100   d-flex align-items-center justify-content-center position-absolute "
      >
        <CgSearch fontSize="25" color="#9CA3AF" />
      </label>
      <input
        className="w-100"
        class="form-control"
        type="text"
        placeholder="Search..."
        value={searchParam}
        onChange={(e) => setSearchParam(e.target.value)}
        aria-label="Search"
        style={{
          padding: "5px 40px",
          border: "1px solid #ccc",
          borderRadius: "12px",
          height: 48,
        }}
        id="search"
      />
      <div
        style={{
          position: "absolute",
          right: "0",
          top: "0",
          height: "100%",
          padding: "4px 5px  ",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button
          variant="primary"
          onClick={onSearch}
          className=" px-3 d-flex justify-content-center align-items-center "
          style={{ borderRadius: 10, height: "100%", fontSize: "16px" }}
          disabled={loading || !searchParam || !activeFilter}
        >
          search
        </Button>
      </div>
    </form>
  );
}
