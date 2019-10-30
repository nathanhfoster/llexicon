import React from "react";
import { Grid, Row, Col } from "react-bootstrap";
import "./styles.css";

const Tooltip = props => {
  const {
    start_date,
    end_date,
    title,
    description,
    author,
    author_username,
    last_modified_by,
    tags,
    min_level,
    max_level,
    role_preferences,
    class_preferences,
    location,
    group_size
  } = props;
  return (
    <Row className="toolTipWrapper">
      <Col className="Center">
        <h3 className="pageHeader">{title}</h3>
      </Col>
    </Row>
  );
};

export default Tooltip;
