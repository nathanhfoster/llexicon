import React, { memo } from "react"
import PropTypes from "prop-types"
import { Card, CardHeader, CardText, CardBody, CardTitle } from "reactstrap"
import { isType } from "../../helpers"
import "./styles.css"

const BasicCard = ({
  tag,
  href,
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
      tag={tag}
      href={href}
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
  tag: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  href: PropTypes.string,
  header: PropTypes.node,
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      name: PropTypes.string,
      render: PropTypes.node.isRequired,
    }),
  ]),
  text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  faIcon: PropTypes.string,
  button: PropTypes.node,
  cardClassName: PropTypes.string,
  cardHeaderClassName: PropTypes.string,
  onClickCallback: PropTypes.func,
}

BasicCard.defaultProps = {
  tag: "div",
  cardClassName: "",
  cardHeaderClassName: "Center",
  cardBodyClassName: "",
  cardTitleClassName: "BasicCardTitle Overflow",
  cardTextClassName: "BasicCardText",
}

export default memo(BasicCard)
