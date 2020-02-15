import React, { Component, cloneElement } from "react"
import PropTypes from "prop-types"
import { render } from "react-dom"
import memoizeProps from "../../../helpers/memoizeProps"
import "./styles.css"

class MapControl extends Component {
  static propTypes = {
    map: PropTypes.object.isRequired,
    controlPosition: PropTypes.number.isRequired,
    disabled: PropTypes.bool,
    children: PropTypes.any.isRequired,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
  }

  static defaultProps = { width: "100%" }

  shouldComponentUpdate(nextProps, nextState) {
    return memoizeProps(this.props, nextProps, [
      "item",
      "map",
      "mapApi",
      "children"
    ])
  }

  componentDidMount() {
    this._render()
  }

  componentDidUpdate(prevProps, prevState) {
    this._render()
  }

  componentWillUnmount() {
    const { map, controlPosition } = this.props
    if (!map) return
    const index = map.controls[controlPosition].getArray().indexOf(this.el)
    map.controls[controlPosition].removeAt(index)
  }

  renderChildren = (children, props) =>
    Array.isArray(children)
      ? children.map(child => cloneElement(child, { ...props }))
      : cloneElement(children, { ...props })

  _render() {
    const { children, controlPosition, width, ...props } = this.props

    if (!props.map || !controlPosition) return

    render(
      <div
        className="mapControl"
        style={{ width }}
        ref={el => {
          if (!this.renderedOnce) {
            this.el = el
            props.map.controls[controlPosition].push(el)
          } else if (el && this.el && el !== this.el) {
            this.el.innerHTML = ""
            ;[].slice
              .call(el.childNodes)
              .forEach(child => this.el.appendChild(child))
          }
          this.renderedOnce = true
        }}
      >
        {this.renderChildren(children, { ...props })}
      </div>,
      document.createElement("div")
    )
  }

  render() {
    return null
  }
}

export default MapControl
