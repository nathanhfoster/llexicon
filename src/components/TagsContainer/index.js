import React, { PureComponent } from "react"
import { Badge, Col } from "reactstrap"
import PropTypes from "prop-types"
import "./styles.css"

class TagsContainer extends PureComponent {
  constructor(props) {
    super(props)

    // Identify props that can change from outsite and within the component and map them to state
    this.state = {}
  }

  static propTypes = {
    tags: PropTypes.array,
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    flexWrap: PropTypes.oneOf(["wrap", "nowrap"]),
    onClickCallback: PropTypes.func,
    minimalView: PropTypes.bool,
    hoverable: PropTypes.bool
  }

  static defaultProps = {
    height: 24,
    flexWrap: "nowrap",
    alignItems: "center",
    minimalView: false,
    hoverable: true
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
    const {
      tags,
      height,
      flexWrap,
      alignItems,
      renderLinks,
      minimalView
    } = this.props
    return (
      <Col
        className="TagsContainer p-0"
        xs={12}
        style={{ height, flexWrap, alignItems }}
      >
        {minimalView ? this.renderMinimalTags(tags) : this.renderTags(tags)}
      </Col>
    )
  }
}
export default TagsContainer
