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
import memoizeProps from "../../helpers/memoizeProps"
import "./styles.css"

const BasicCard = ({
  title,
  text,
  faIcon,
  header,
  button,
  cardClassName,
  cardHeaderClassName,
  cardBodyClassName,
  onClickCallback
}) => {
  const handleOnClickCallback = () => onClickCallback && onClickCallback()
  const cardHoverStyles = onClickCallback ? "BasicCardHover" : ""
  return (
    <Card
      className={`BasicCard ${cardHoverStyles} ${cardClassName}`}
      onClick={handleOnClickCallback}
    >
      <CardHeader className={`BasicCardContainer ${cardHeaderClassName}`}>
        {typeof faIcon === "string" ? (
          <i className={`AboutFeatureIcon ${faIcon}`} />
        ) : (
          header
        )}
      </CardHeader>
      <CardBody className={`BasicCardBodyContainer ${cardBodyClassName}`}>
        {typeof title === "string" ? (
          <CardTitle className="BasicCardTitle Center">{title}</CardTitle>
        ) : (
          title
        )}
        {text && (
          <CardText className="AboutFeatureText Center">{text}</CardText>
        )}
        {button && <div className="Center">{button}</div>}
      </CardBody>
    </Card>
  )
}

BasicCard.propTypes = {
  title: PropTypes.string,
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  faIcon: PropTypes.string,
  header: PropTypes.object,
  button: PropTypes.object,
  cardClassName: PropTypes.string,
  cardHeaderClassName: PropTypes.string,
  onClickCallback: PropTypes.func
}

BasicCard.defaultProps = {
  cardClassName: "",
  cardHeaderClassName: "",
  cardBodyClassName: ""
}

const isEqual = (prevProps, nextProps) =>
  memoizeProps(prevProps, nextProps, [
    "title",
    "text",
    "faIcon",
    "button",
    "cardClassName",
    "cardHeaderClassName"
    // "onClickCallback"
  ])

export default memo(BasicCard, isEqual)
