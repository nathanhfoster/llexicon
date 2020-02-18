import React, { memo } from "react"
import { Badge, Col } from "reactstrap"
import { BasicList } from "../"
import PropTypes from "prop-types"
import "./styles.css"

const TagsContainer = ({
  children,
  tags,
  minimalView,
  height,
  fontSize,
  flexWrap,
  alignItems,
  overflowX,
  overflowY,
  onClickCallback,
  hoverable,
  showTagIcon,
  tagContainerClassName
}) => {
  if (flexWrap === "wrap") {
    overflowX = "auto"
    overflowY = "auto"
  }

  const styles = {
    height,
    flexWrap,
    alignItems,
    alignContent: "flex-start",
    flexStart: "space-around",
    overflowX,
    overflowY,
    fontSize
  }

  const renderTags = () =>
    tags.map(({ title }, i) => (
      <Badge
        key={title}
        className={`TagContainer ${tagContainerClassName} ${
          hoverable ? "TagContainerHover" : ""
        }`}
        onClick={onClickCallback ? () => onClickCallback(title) : null}
      >
        {showTagIcon && <i className="fas fa-tag" style={{ marginRight: 2 }} />}
        <span className="TagTitle">{title}</span>
      </Badge>
    ))

  const renderMinimalTags = () => {
    const initialString = "| "
    const mininmalString = tags.reduce(
      (mininmalString, tag) => mininmalString + `${tag.title} | `,
      initialString
    )
    if (mininmalString === initialString) return null
    else return <span>{mininmalString}</span>
  }

  return (
    <Col className="TagsContainer p-0" xs={12} style={styles}>
      {children}
      {tags.length === 0 ? (
        <span>No tags...</span>
      ) : minimalView ? (
        renderMinimalTags()
      ) : (
        renderTags()
      )}
    </Col>
  )
}

TagsContainer.propTypes = {
  tags: PropTypes.array,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  fontSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  flexWrap: PropTypes.oneOf(["wrap", "nowrap"]),
  overflowX: PropTypes.string,
  overflowY: PropTypes.string,
  onClickCallback: PropTypes.func,
  minimalView: PropTypes.bool,
  hoverable: PropTypes.bool,
  showTagIcon: PropTypes.bool,
  tagContainerClassName: PropTypes.string
}

TagsContainer.defaultProps = {
  height: "auto",
  fontSize: "inherit",
  flexWrap: "nowrap",
  alignItems: "center",
  overflowX: "auto",
  overflowY: "hidden",
  minimalView: false,
  hoverable: false,
  showTagIcon: true,
  tagContainerClassName: ""
}
export default memo(TagsContainer)
