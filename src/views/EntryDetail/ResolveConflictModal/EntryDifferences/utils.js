import React from "react"
import Moment from "react-moment"
import { CloudDownload } from "../../../../images/SVG"
import { formatBytes } from "../../../../utils"
import { getJsonTagsOrPeople } from "../../../../redux/Entries/utils"

const getEntryPropSortOrder = (prop) => {
  switch (prop) {
    case "title":
      return 16

    case "html":
      return 15

    case "tags":
      return 14

    case "people":
      return 13

    case "address":
      return 12

    case "date_created":
      return 11

    case "date_created_by_author":
      return 10

    case "date_updated":
      return 9

    case "views":
      return 8

    case "rating":
      return 7

    case "EntryFiles":
      return 6

    case "is_public":
      return 5

    case "latitude":
      return 4

    case "longitude":
      return 3

    case "_size":
      return 2

    case "size":
      return 1

    default:
      return -1
  }
}

const getEntryPropIcon = (prop) => {
  switch (prop) {
    case "title":
      return <i className="fas fa-heading" />

    case "html":
      return <i className="fas fa-keyboard" />

    case "tags":
      return <i className="fas fa-tags" />

    case "people":
      return <i className="fas fa-users" />

    case "address":
      return <i className="fas fa-map-marker-alt" />

    case "date_created":
      return <i className="fas fa-calendar-day" />

    case "date_created_by_author":
      return <i className="fas fa-calendar-day" />

    case "date_updated":
      return <i className="fas fa-pencil-alt" />

    case "views":
      return <i className="far fa-eye" />

    case "rating":
      return <i className="fas fa-star" />

    case "EntryFiles":
      return <i className="fas fa-photo-video" />

    case "is_public":
      return <i className="fas fa-lock" />

    case "latitude":
      return <i className="fas fa-compass" />

    case "longitude":
      return <i className="fas fa-compass" />

    case "_size":
      return <i className="fas fa-hdd" />

    case "size":
      return <CloudDownload height={18} />

    default:
      return <i className="fas fa-exclamation-circle" />
  }
}

const renderEntryProp = (prop, propValue) => {
  switch (prop) {
    case "title":
      return propValue

    case "html":
      return propValue.length

    case "tags":
      return getJsonTagsOrPeople(propValue)

    case "people":
      return getJsonTagsOrPeople(propValue)

    case "address":
      return propValue

    case "date_created":
      return <Moment format="D MMM YY hh:mm:ssa">{propValue}</Moment>

    case "date_created_by_author":
      return <Moment format="D MMM YY hh:mm:ssa">{propValue}</Moment>

    case "date_updated":
      return <Moment format="D MMM YY hh:mm:ssa">{propValue}</Moment>

    case "views":
      return propValue

    case "rating":
      return propValue

    case "EntryFiles":
      return <i className="fas fa-photo-video" />

    case "is_public":
      return `${propValue}`

    case "latitude":
      return propValue

    case "longitude":
      return propValue

    case "_size":
      return formatBytes(propValue)

    case "size":
      return formatBytes(propValue)

    default:
      return `${propValue}`
  }
}

export { getEntryPropSortOrder, getEntryPropIcon, renderEntryProp }
