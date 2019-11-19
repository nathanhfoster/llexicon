import React, { PureComponent } from "react"
import { connect as reduxConnect } from "react-redux"
import PropTypes from "prop-types"
import FileUpload from "../FileUpload"
import { ImportReduxEntry } from "../../actions/Entries"

import "./styles.css"

const mapStateToProps = ({}) => ({})

const mapDispatchToProps = { ImportReduxEntry }

class ImportEntries extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {}

  static defaultProps = {}

  static getDerivedStateFromProps(nextProps, prevState) {
    return nextProps
  }

  importEntries = e => {
    const { ImportReduxEntry } = this.props
    const files = e.currentTarget.files
    Object.keys(files).forEach(i => {
      const file = files[i]
      const reader = new FileReader()
      reader.onload = e => {
        const { result } = reader
        //server call for uploading or reading the files one-by-one
        //by using 'reader.result' or 'file'

        // console.log("result: ", result)
        // console.log("-------------------------------------------")
        const [empty, dateCreated, ...restOfString] = result.split(
          /ï»¿(.*,*,*)/
        )
        const date_created_by_author = new Date(dateCreated)

        const nextSplit = restOfString[0].split(/[\r\n]+/g)
        const [emptyString, title, ...html] = nextSplit

        const payload = {
          id: `entryImport-${i}`,
          title,
          html: html.join(""),
          date_created_by_author,
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
