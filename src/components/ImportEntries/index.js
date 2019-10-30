import React, { PureComponent } from "react"
import { connect as reduxConnect } from "react-redux"
import PropTypes from "prop-types"
import FileUpload from "../FileUpload"
import { ImportReduxEntry } from "../../actions/Entries"

import "./styles.css"

const mapStateToProps = ({ User }) => ({ UserId: User.id })

const mapDispatchToProps = { ImportReduxEntry }

class ImportEntries extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {}

  static defaultProps = {}

  componentWillMount() {
    this.getState(this.props)
  }
  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    this.setState({})
  }

  importEntries = e => {
    const { UserId, ImportReduxEntry } = this.props
    const files = e.currentTarget.files
    Object.keys(files).forEach(i => {
      const file = files[i]
      const reader = new FileReader()
      reader.onload = e => {
        const { result } = reader
        //server call for uploading or reading the files one-by-one
        //by using 'reader.result' or 'file'
        const payload = {
          author: UserId,
          // title,
          html: result,
          // tags,
          shouldPost: true
        }
        ImportReduxEntry(payload)
      }
      reader.readAsBinaryString(file)
    })
  }

  render() {
    return <FileUpload onChangeCallback={this.importEntries} />
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(ImportEntries)
