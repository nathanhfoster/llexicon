import React, { memo } from "react"
import { useDispatch } from "react-redux"
import PropTypes from "prop-types"
import FileUpload from "../FileUpload"
import { ImportReduxEntry } from "../../actions/Entries"
import "./styles.css"

const ImportEntries = () => {
  const dispatch = useDispatch()

  const importEntries = e => {
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
          tags: [],
          _shouldPost: true
        }
        dispatch(ImportReduxEntry(payload))
      }
      reader.readAsBinaryString(file)
    })
  }

  return <FileUpload onChangeCallback={importEntries} />
}

export default memo(ImportEntries)
