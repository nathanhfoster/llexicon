import React, { memo } from "react"
import PropTypes from "prop-types"
import {
  Card,
  CardHeader,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  Button
} from "reactstrap"

const Feature = ({ title, text, faIcon, header, button }) => (
  <Card className="HomeFeatureCard">
    <CardHeader className="HomeFeatureContainer">
      {typeof faIcon === "string" ? (
        <i className={`AboutFeatureIcon ${faIcon}`} />
      ) : (
        header
      )}
    </CardHeader>
    <CardBody className="HomeFeatureBodyContainer">
      <CardTitle tag="h4" className="AboutFeatureTitle Center">
        {title}
      </CardTitle>
      <CardText className="AboutFeatureText Center">{text}</CardText>
      {button && <div className="Center">{button}</div>}
    </CardBody>
  </Card>
)

Feature.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  faIcon: PropTypes.string,
  header: PropTypes.object,
  button: PropTypes.object
}

export default memo(Feature)
