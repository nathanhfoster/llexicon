import React, { PureComponent } from "react"
import { Badge, Col } from "reactstrap"
import PropTypes from "prop-types"
import "./styles.css"

class TagsContainer extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {
    tags: PropTypes.array,
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    flexWrap: PropTypes.oneOf(["wrap", "nowrap"]),
    overflowX: PropTypes.string,
    overflowY: PropTypes.string,
    onClickCallback: PropTypes.func,
    minimalView: PropTypes.bool,
    hoverable: PropTypes.bool
  }

  static defaultProps = {
    height: 24,
    flexWrap: "nowrap",
    alignItems: "center",
    overflowX: "hidden",
    overflowY: "hidden",
    minimalView: false,
    hoverable: true
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let { tags, height, flexWrap, alignItems, overflowX, overflowY, minimalView } = nextProps

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
      overflowY
    }

    return { tags, styles, minimalView }
  }

  renderTags = tags => {
    const { onClickCallback, hoverable } = this.props

    return tags.map(tag => {
      const { title } = tag
      return (
        <Badge
          key={title}
          className={`TagContainer ${hoverable ? "TagContainerHover" : ""}`}
          onClick={onClickCallback ? () => onClickCallback(title) : null}
        >
          <i className="fas fa-tags" /> {title}
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
    const { tags, styles, minimalView } = this.state
    return (
      <Col className="TagsContainer p-0" xs={12} style={styles}>
        {minimalView ? this.renderMinimalTags(tags) : this.renderTags(tags)}
      </Col>
    )
  }
}
export default TagsContainer
