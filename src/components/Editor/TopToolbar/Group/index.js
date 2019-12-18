import React, { Component } from "react"
import './styles.css'

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


  render() {
    const { children } = this.state
    return <span className="ql-formats">{children}</span>
  }
}

export default Group
