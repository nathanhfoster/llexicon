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
        const split = result.split(/ï»¿(.*,*,*)/)
        const date_created_by_author = new Date(split[1])
        const nextSplit = split[2].split(/[\r\n]+/g)
        const [emptyString, title, ...restOfString] = nextSplit
        // console.log("title: ", title)
        // console.log("restOfString: ", restOfString)
        const html = restOfString
          .filter(
            s =>
              !(
                s.includes("Rating") ||
                s.includes("Tags") ||
                s.includes("Weather") ||
                s.includes("Location")
              )
          )
          .join("")
        // console.log("html: ", html)
        const payload = {
          id: `entryImport-${i}`,
          title,
          html,
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
