import React, { useMemo, memo } from "react"
import { Badge, Col } from "reactstrap"
import PropTypes from "prop-types"
import { EntryTagsProps } from "../../../redux/Entries/propTypes"
import { getJsonTagsOrPeople } from "../../../redux/Entries/utils"
import "./styles.css"

const TagsContainer = ({
  children,
  tags,
  minimalView,
  height,
  maxHeight,
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
  faIcon,
}) => {
  if (flexWrap === "wrap") {
    overflowX = "auto"
    overflowY = "auto"
  }

  const styles = {
    height,
    maxHeight,
    flexWrap,
    alignItems,
    alignContent: "flex-start",
    flexStart: "space-around",
    overflowX,
    overflowY,
    fontSize,
  }

  const renderMinimalTags = useMemo(() => {
    const initialString = "| "
    const mininmalString = tags.reduce(
      (mininmalString, tag) => mininmalString + `${tag.name} | `,
      initialString
    )
    if (mininmalString === initialString) return null
    else return <span>{mininmalString}</span>
  }, [tags])

  const renderTags = useMemo(
    () =>
      tags.map(({ name }, i) => (
        <Badge
          key={name}
          className={`TagContainer fade-in ${tagContainerClassName} ${
            hoverable ? "TagContainerHover" : ""
          }`}
          onClick={onClickCallback ? () => onClickCallback(name) : null}
        >
          {showTagIcon && <i className={faIcon} style={{ marginRight: 4 }} />}
          <span className="TagTitle">{name}</span>
        </Badge>
      )),
    [tags]
  )

  return (
    <Col
      className="TagsContainer ShowScrollBar p-0"
      {...columnProps}
      style={styles}
      title={getJsonTagsOrPeople(tags)}
    >
      {children}
      {tags.length === 0 ? (
        <span className="p-1">{emptyString}</span>
      ) : minimalView ? (
        renderMinimalTags
      ) : (
        renderTags
      )}
    </Col>
  )
}

TagsContainer.propTypes = {
  tags: EntryTagsProps,
  height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  maxHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
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
  faIcon: PropTypes.string,
}

TagsContainer.defaultProps = {
  height: "auto",
  maxHeight: "auto",
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
  faIcon: "fas fa-tag",
}

export default memo(TagsContainer)
