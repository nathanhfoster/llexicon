import React, { memo } from "react"
import PropTypes from "prop-types"
import { Card, CardHeader, CardText, CardBody, CardTitle } from "reactstrap"
import { isType } from "../../helpers"
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
  onClickCallback,
}) => {
  const handleOnClickCallback = () => onClickCallback && onClickCallback()
  const cardHoverStyles = onClickCallback ? "BasicCardHover" : ""
  const titleIsObject = typeof title === isType.OBJECT
  const cardTitle = titleIsObject ? title.name : title
  const renderCardTitle = titleIsObject ? (
    title.render
  ) : (
    <CardTitle className={`${cardTitleClassName} Center`}>{title}</CardTitle>
  )
  return (
    <Card
      className={`BasicCard ${cardClassName} ${cardHoverStyles}`}
      onClick={handleOnClickCallback}
      title={cardTitle}
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
        {renderCardTitle}
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
  header: PropTypes.object,
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      name: PropTypes.string,
      render: PropTypes.object.isRequired,
    }),
  ]),
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  faIcon: PropTypes.string,
  button: PropTypes.object,
  cardClassName: PropTypes.string,
  cardHeaderClassName: PropTypes.string,
  onClickCallback: PropTypes.func,
}

BasicCard.defaultProps = {
  cardClassName: "",
  cardHeaderClassName: "Center",
  cardBodyClassName: "",
  cardTitleClassName: "BasicCardTitle Overflow",
  cardTextClassName: "BasicCardText",
}

export default memo(BasicCard)
