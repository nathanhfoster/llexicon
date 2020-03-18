import React, { memo } from "react"
import PropTypes from "prop-types"
import { Card, CardHeader, CardText, CardBody, CardTitle } from "reactstrap"
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
      <CardHeader
        tag="div"
        className={`BasicCardContainer ${cardHeaderClassName}`}
      >
        {typeof faIcon === "string" ? (
          <i className={`AboutFeatureIcon ${faIcon}`} />
        ) : (
          header
        )}
      </CardHeader>
      <CardBody
        tag="div"
        className={`BasicCardBodyContainer ${cardBodyClassName}`}
      >
        {typeof title === "string" ? (
          <CardTitle className={`${cardTitleClassName} Center`}>
            {title}
          </CardTitle>
        ) : (
          title
        )}
        {text && (
          <CardText tag="div" className={`${cardTextClassName} Center`}>
            {text}
          </CardText>
        )}
        {button && <div className="Center">{button}</div>}
      </CardBody>
    </Card>
  )
}

BasicCard.propTypes = {
  memoProps: PropTypes.arrayOf(PropTypes.any),
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
  cardTitleClassName: "BasicCardTitle Overflow",
  cardTextClassName: "BasicCardText"
}

const isEqual = (prevProps, nextProps) =>
  memoizeProps(prevProps, nextProps, [
    "memoProps",
    "text",
    "title",
    // "header",
    "faIcon",
    "button",
    "cardClassName",
    "cardHeaderClassName"
  ])

export default memo(BasicCard, isEqual)
