import React, { memo } from "react"
import { Badge, Col } from "reactstrap"
import PropTypes from "prop-types"
import { EntryTagsProps } from "../../redux/Entries/propTypes"
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
  tagContainerClassName,
  columnProps,
  emptyString,
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
    fontSize,
  }

  const renderTags = () =>
    tags.map(({ name }, i) => (
      <Badge
        key={name}
        className={`TagContainer fade-in ${tagContainerClassName} ${
          hoverable ? "TagContainerHover" : ""
        }`}
        onClick={onClickCallback ? () => onClickCallback(name) : null}
      >
        {showTagIcon && <i className="fas fa-tag" style={{ marginRight: 2 }} />}
        <span className="TagTitle">{name}</span>
      </Badge>
    ))

  const renderMinimalTags = () => {
    const initialString = "| "
    const mininmalString = tags.reduce(
      (mininmalString, tag) => mininmalString + `${tag.name} | `,
      initialString
    )
    if (mininmalString === initialString) return null
    else return <span>{mininmalString}</span>
  }

  return (
    <Col className="TagsContainer p-0" {...columnProps} style={styles}>
      {children}
      {tags.length === 0 ? (
        <span>{emptyString}</span>
      ) : minimalView ? (
        renderMinimalTags()
      ) : (
        renderTags()
      )}
    </Col>
  )
}

TagsContainer.propTypes = {
  tags: EntryTagsProps,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  fontSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  flexWrap: PropTypes.oneOf(["wrap", "nowrap"]),
  overflowX: PropTypes.string,
  overflowY: PropTypes.string,
  onClickCallback: PropTypes.func,
  minimalView: PropTypes.bool,
  hoverable: PropTypes.bool,
  showTagIcon: PropTypes.bool,
  tagContainerClassName: PropTypes.string,
  emptyString: PropTypes.string,
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
  tagContainerClassName: "",
  columnProps: { xs: 12 },
  emptyString: "No tags...",
}

export default memo(TagsContainer)
