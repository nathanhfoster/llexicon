import React, { useEffect, useState, lazy } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { EntriesPropTypes } from "../../../redux/Entries/propTypes"
import {
  Container,
  Row,
  Col,
  Breadcrumb,
  BreadcrumbItem,
  Button,
} from "reactstrap"
import { NavLink } from "react-router-dom"
import { RouterPush } from "../../../redux/router/actions"
import { TopKFrequentStrings } from "../../../utils"
import { useScrollable } from "../../../hooks"
import "./styles.css"

const EntryCards = lazy(() => import("../EntryCards"))
const EntryFolder = lazy(() => import("./EntryFolder"))
const BASE_FOLDER_DIRECTORY_URL = "folders?folder=All"
const ENTRIES_RENDER_OFFSET = 6
const DEFAULT_VIEWABLE_ENTRIES_RANGE = [0, ENTRIES_RENDER_OFFSET * 2]

const mapStateToProps = ({
  router: {
    location: { search },
  },
}) => ({ search })

const EntryFolders = ({ entries, search }) => {
  useEffect(() => {
    if (!search) RouterPush(BASE_FOLDER_DIRECTORY_URL)
  }, [])

  const [viewableEntriesRange, setViewableEntriesRange] = useState(
    DEFAULT_VIEWABLE_ENTRIES_RANGE
  )

  const [minimizeEntryCards, setMinimizeEntryCards] = useState(true)

  const handleMinimizeEntryCardsToggle = () =>
    setMinimizeEntryCards(!minimizeEntryCards)

  const [beginOffset, endOffset] = viewableEntriesRange

  const directoryPath = search.replace("?folder=", "").split("+")
  const directoryTags = directoryPath.slice(1)

  const entryFilteredTags = entries.filter((entry) =>
    directoryTags.every((tag) => entry.tags.some(({ name }) => name === tag))
  )

  const filteredEntryTags = entryFilteredTags
    .map((entry) => entry.tags)
    .flat(1)
    .filter(({ name }) => !directoryTags.includes(name))

  const viewableEntries = entryFilteredTags.slice(beginOffset, endOffset)

  const sortedTags = TopKFrequentStrings(filteredEntryTags, "name")

  const setViewableEntriesRangeThreshold =
    viewableEntries.length < entryFilteredTags.length

  const [reachedBottom, setReachedBottomCallback] = useScrollable(
    setViewableEntriesRangeThreshold
  )

  useEffect(() => {
    setViewableEntriesRange([beginOffset, endOffset + ENTRIES_RENDER_OFFSET])
  }, [reachedBottom])

  const renderFolderBreadCrumbs = () =>
    directoryPath.map((directory, i) => {
      const newDirectory = directoryPath.slice(0, i + 1).join("+")
      const path = `?folder=${newDirectory}`
      return (
        <BreadcrumbItem key={`${directory}-${i}`}>
          <NavLink to={path}>{directory}</NavLink>
        </BreadcrumbItem>
      )
    })

  const renderFolders = () =>
    sortedTags.map((name, i) => {
      const handleOnClickCallback = () => {
        RouterPush(search.concat(`+${name}`))
        setViewableEntriesRange(DEFAULT_VIEWABLE_ENTRIES_RANGE)
      }

      return (
        <Col key={`${name}-${i}`} xs={4} sm={3} md={2} className="p-0">
          <EntryFolder title={name} onClickCallback={handleOnClickCallback} />
        </Col>
      )
    })

  return (
    <Container className="EntryFolders">
      <Row>
        <Col
          xs={11}
          tag={Breadcrumb}
          className="FolderBreadCrumbsContainer p-0"
        >
          {renderFolderBreadCrumbs()}
        </Col>
        <Col
          xs={1}
          className="p-0"
          tag={Button}
          color="accent"
          onClick={handleMinimizeEntryCardsToggle}
        >
          <i className={`fas fa-eye${minimizeEntryCards ? "" : "-slash"}`} />
        </Col>
      </Row>
      <Row
        className="EntryFoldersContainer Container"
        onScroll={setReachedBottomCallback}
      >
        {renderFolders()}
        <Container className="EntryCards">
          <Row>
            <EntryCards
              entries={viewableEntries}
              minimal={minimizeEntryCards}
            />
          </Row>
        </Container>
      </Row>
    </Container>
  )
}

EntryFolders.propTypes = {
  entries: EntriesPropTypes,
  search: PropTypes.string.isRequired,
}

EntryFolders.defaultProps = { search: "" }

export default reduxConnect(mapStateToProps)(EntryFolders)
