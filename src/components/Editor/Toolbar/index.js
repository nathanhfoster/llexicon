import React, { PureComponent, Fragment } from "react"
import PropTypes from "prop-types"
import "./styles.css"

class Toolbar extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static getDerivedStateFromProps(props, state) {
    return props
  }

  static propTypes = {}

  static defaultProps = {}


  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  render() {
    return (
      <Fragment>
        <div id="toolbar" className="Editor">
          <select
            className="ql-header"
            defaultValue={""}
            onChange={e => e.persist()}
          >
            <option value="1" />
            <option value="2" />
            <option selected />
          </select>
          <button className="ql-bold" />
          <button className="ql-italic" />
          <button className="ql-underline" />
          <select className="ql-color">
            <option value="red" />
            <option value="green" />
            <option value="blue" />
            <option value="orange" />
            <option value="violet" />
            <option value="#d0d1d2" />
            <option selected />
          </select>
          {/* <button className="ql-insertStar">
        <CustomButton />
      </button> */}
        </div>
        <div id="editor"></div>
      </Fragment>
    )
  }
}
export default Toolbar
