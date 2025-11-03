import { Col, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CountUp } from "use-count-up";
// translation
import { useTranslation } from "next-i18next";

const CardCountStart = ({ icon, iconColor, title, countEnd, desc,children }) => {
  const { t } = useTranslation("Management");
  return (
    <Col md="6" xl="3" className="mb-3">
      <Card className="h-100 w-100 border rounded">
        <Card.Body className="d-flex flex-column justify-content-center align-items-center">
          <div className="d-flex justify-content-between align-items-center w-100 mb-3">
            <div className="d-flex justify-content-center align-items-center">
              <div className={`p-3 rounded bg-soft-${iconColor}`}>
                {icon && <FontAwesomeIcon className="fa-2x" icon={icon} size="lg" />}
                {children}
              </div>
            </div>
            <div className="d-flex flex-column align-items-center justify-content-center ps-3">
              <h2 className="counter">
                <CountUp isCounting start={0} end={+countEnd || 0} duration={4} />
              </h2>
              <h5 className="mb-0 text-center">{t(title)}</h5>
            </div>
          </div>
          {desc && <span className="text-center">{desc}</span>}
        </Card.Body>
      </Card>
    </Col>
  );
};
export default CardCountStart;
