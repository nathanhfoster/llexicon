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
  header,
  title,
  text,
  faIcon,
  button,
  cardClassName,
  cardHeaderClassName,
  cardBodyClassName,
  cardTitleClassName,
  cardTextClassName,
  onClickCallback
}) => {
  const handleOnClickCallback = () => onClickCallback && onClickCallback()
  const cardHoverStyles = onClickCallback ? "BasicCardHover" : ""
  return (
    <Card
      className={`${cardClassName} ${cardHoverStyles}`}
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
          <CardTitle className={`${cardTitleClassName} Center`}>
            {title}
          </CardTitle>
        ) : (
          title
        )}
        {text && (
          <CardText className={`${cardTextClassName} Center`}>{text}</CardText>
        )}
        {button && <div className="Center">{button}</div>}
      </CardBody>
    </Card>
  )
}

BasicCard.propTypes = {
  header: PropTypes.object,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  faIcon: PropTypes.string,
  button: PropTypes.object,
  cardClassName: PropTypes.string,
  cardHeaderClassName: PropTypes.string,
  onClickCallback: PropTypes.func
}

BasicCard.defaultProps = {
  cardClassName: "BasicCard",
  cardHeaderClassName: "Center",
  cardBodyClassName: "",
  cardTitleClassName: "BasicCardTitle",
  cardTextClassName: "BasicCardText"
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
