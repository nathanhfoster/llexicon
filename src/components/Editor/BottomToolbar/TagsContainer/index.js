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
    onClickCallback: PropTypes.func
  }

  static defaultProps = {
    height: 24,
    flexWrap: "nowrap",
    alignItems: "center"
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    // Identify which properties have changed and compare them to the previous state
    // If there was a change return a new state object
    // Otherwise return null which means there was no state change
    return nextProps
  }

  componentDidMount() {}

  getSnapshotBeforeUpdate(prevProps, prevState) {
    return null
  }

  componentDidUpdate(prevProps, prevState, snapshot) {}

  componentWillUnmount() {}

  renderTags = tags => {
    const { onClickCallback } = this.props

    return tags.map(tag => {
      const { title } = tag
      return (
        <Badge
          key={title}
          className="TagContainer"
          onClick={onClickCallback ? () => onClickCallback(title) : null}
        >
          <i className="fas fa-tags" /> {title}
        </Badge>
      )
    })
  }

  render() {
    const { tags, height, flexWrap, alignItems, renderLinks } = this.state
    return (
      <Col
        className="TagsContainer p-0"
        xs={12}
        style={{ height, flexWrap, alignItems }}
      >
        {this.renderTags(tags)}
      </Col>
    )
  }
}
export default TagsContainer
