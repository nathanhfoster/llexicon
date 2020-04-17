import React, { memo } from "react"
import { useDispatch } from "react-redux"
import PropTypes from "prop-types"
import FileUpload from "../FileUpload"
import { ImportReduxEntry } from "../../redux/Entries/actions"
import {
  validatedTagString,
  validatedPersonNameString,
} from "../Editor/BottomToolbar/ToolbarButtonModals/utlis"
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

        const [
          emptyString,
          title,
          ...htmlWithTagsAndPeople
        ] = restOfString[0].split(/[\r\n]+/g)

        // console.log("emptyString: ", emptyString)
        // console.log("title: ", title)
        const [html, TagsPeopleLocation] = htmlWithTagsAndPeople
          .join("")
          .split(/(Tags:.*)/g)

        let tags = []
        let people = []
        let latitude = null
        let longitude = null
        if (TagsPeopleLocation) {
          const [t, p] = TagsPeopleLocation.split(/(People:.*)/g)
          if (t) {
            tags = validatedTagString(t.split("Tags: ")[1])
              .split(",")
              .map((name) => ({ name }))
          }
          if (p) {
            // const [no, peep, l] =
            people = validatedPersonNameString(p.split("People: ")[1])
              .split(",")
              .map((name) => ({ name }))
          }
        }

        // console.log("html: ", html)
        // console.log("tags: ", tags)
        // console.log("people: ", people)
        const payload = {
          id: `entryImport-${i}`,
          title,
          html,
          date_created: date_created_by_author,
          date_created_by_author,
          date_updated: date_created_by_author,
          EntryFiles: [],
          tags,
          people,
          views: 0,
          rating: 0,
          latitude: null,
          longitude: null,
          is_public: false,
          _shouldPost: true,
        }
        // console.log(payload)
        dispatch(ImportReduxEntry(payload))
      }
      reader.readAsBinaryString(file)
    })
  }

  return <FileUpload onChangeCallback={importEntries} />
}

export default memo(ImportEntries)
