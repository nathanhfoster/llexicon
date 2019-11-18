import React, { Component } from "react"

class Group extends Component {
  constructor(props) {
    super(props)

    this.state = { children: [] }
  }

  static propTypes = {}

  static defaultProps = {}

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.children.length !== prevState.children.length) {
      return { children: nextProps.children }
    } else return null
  }

  shouldComponentUpdate(nextProps, nextState) {
    const childrenChanged =
      nextProps.children.length !== nextState.children.length

    return childrenChanged
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState, snapshot) {}

  componentWillUnmount() {}

  render() {
    const { children } = this.state
    return <span className="ql-formats">{children}</span>
  }
}

export default Group
