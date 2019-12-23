import React, { Component } from "react"
import { Badge, Col } from "reactstrap"
import PropTypes from "prop-types"
import deepEquals from "../../helpers/deepEquals"
import "./styles.css"

class TagsContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {
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

  static defaultProps = {
    height: "auto",
    fontSize: "inherit",
    flexWrap: "nowrap",
    alignItems: "center",
    overflowX: "auto",
    overflowY: "hidden",
    minimalView: false,
    hoverable: false,
    showTagIcon: true,
    tagContainerClassName: "m-1"
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let {
      tags,
      height,
      fontSize,
      flexWrap,
      alignItems,
      overflowX,
      overflowY,

      minimalView
    } = nextProps

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

    return { tags, styles, minimalView }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const stateChanged = !deepEquals(this.state, nextState)

    return stateChanged
  }

  renderTags = tags => {
    const {
      onClickCallback,
      hoverable,
      showTagIcon,
      tagContainerClassName
    } = this.props

    return tags.map(tag => {
      const { title } = tag
      return (
        <Badge
          key={title}
          className={`TagContainer ${tagContainerClassName} ${
            hoverable ? "TagContainerHover" : ""
          }`}
          onClick={onClickCallback ? () => onClickCallback(title) : null}
        >
          {showTagIcon && (
            <i className="fas fa-tag" style={{ marginRight: 2 }} />
          )}
          <span className="TagTitle">{title}</span>
        </Badge>
      )
    })
  }

  renderMinimalTags = tags => {
    const initialString = "| "
    const mininmalString = tags.reduce(
      (mininmalString, tag) => mininmalString + `${tag.title} | `,
      initialString
    )
    if (mininmalString === initialString) return null
    else return <span>{mininmalString}</span>
  }

  render() {
    const { children } = this.props
    const { tags, styles, minimalView } = this.state
    return (
      <Col className="TagsContainer p-0" xs={12} style={styles}>
        {children}
        {minimalView ? this.renderMinimalTags(tags) : this.renderTags(tags)}
      </Col>
    )
  }
}
export default TagsContainer
