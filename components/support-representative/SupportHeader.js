import { Col, Container, Row } from "react-bootstrap";
import SearchField from "./SearchField";
import TypeFilter from "./TypeFilter";

const SupportHeader = ({
  loading,
  activeFilter,
  setActiveFilter,
  setSearchParam,
  handleSearch,
  searchOptions,
  searchParam,
}) => {
  return (
    <div
      className="iq-navbar-header"
      style={{
        height: "250px",
        background: "linear-gradient(43deg, #249bde, #0e6395 64.06%)",
        position: "relative",
      }}
    >
      <Container className="iq-container">
        <h2 className="text-center mt-5 mb-2">Search For Account</h2>
        <Row className="mx-auto fs-5" style={{ maxWidth: "740px" }}>
          <div className="d-flex justify-content-center gap-3 w-100">
            <TypeFilter
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
              loading={loading}
              searchOptions={searchOptions}
            />
            <SearchField
              setSearchParam={setSearchParam}
              onSearch={handleSearch}
              loading={loading}
              activeFilter={activeFilter}
              searchParam={searchParam}
              style={{ flex: "1 1 300px" }}
            />
          </div>
        </Row>
      </Container>
      <img
        style={{ width: 350 }}
        src="/assets/images/grid-vector.png"
        alt="vector"
        className="vector-img vector-img-left"
      />
      <img
        style={{ width: 350 }}
        src="/assets/images/grid-vector.png"
        alt="vector"
        className="vector-img vector-img-right"
      />
    </div>
  );
};
export default SupportHeader;
