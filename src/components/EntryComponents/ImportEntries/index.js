import React, { memo } from "react"
import { useDispatch } from "store/provider"
import PropTypes from "prop-types"
import FileUpload from "../../FileUpload"
import { ImportReduxEntry } from "../../../redux/Entries/actions"

const ImportEntries = () => {
  const dispatch = useDispatch()

  const importEntries = (e) => {
    const files = e.currentTarget.files
    Object.keys(files).forEach((i) => {
      const file = files[i]
      const reader = new FileReader()
      reader.onload = (e) => {
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
          date_created: date_created_by_author,
          date_created_by_author,
          date_updated: date_created_by_author,
          EntryFiles: [],
          tags: [],
          people: [],
          views: 0,
          rating: 0,
          latitude: null,
          longitude: null,
          is_public: false,
          _shouldPost: true,
        }
        dispatch(ImportReduxEntry(payload))
      }
      reader.readAsBinaryString(file)
    })
  }

  return <FileUpload onChangeCallback={importEntries} />
}

export default memo(ImportEntries)
