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
import "./styles.css"

const BasicCard = ({ title, text, faIcon, header, button }) => (
  <Card className="BasicCard">
    <CardHeader className="BasicCardContainer">
      {typeof faIcon === "string" ? (
        <i className={`AboutFeatureIcon ${faIcon}`} />
      ) : (
        header
      )}
    </CardHeader>
    <CardBody className="BasicCardBodyContainer">
      {title && (
        <CardTitle tag="h4" className="AboutFeatureTitle Center">
          {title}
        </CardTitle>
      )}
      {text && <CardText className="AboutFeatureText Center">{text}</CardText>}
      {button && <div className="Center">{button}</div>}
    </CardBody>
  </Card>
)

BasicCard.propTypes = {
  title: PropTypes.string,
  text: PropTypes.string,
  faIcon: PropTypes.string,
  header: PropTypes.object,
  button: PropTypes.object
}

export default memo(BasicCard)
