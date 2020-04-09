import React, { useEffect, useState, lazy, memo } from "react"
import PropTypes from "prop-types"
import { EntriesPropTypes } from "../../redux/Entries/propTypes"
import { Container, Row, Col, Breadcrumb, BreadcrumbItem } from "reactstrap"
import { NavLink } from "react-router-dom"
import { RouterPush } from "../../routes"
import { TopKFrequentStrings } from "../../helpers"
import "./styles.css"

const EntryCards = lazy(() => import("../EntryCards"))
const EntryFolder = lazy(() => import("./EntryFolder"))
const BASE_FOLDER_DIRECTORY_URL = "folders?folder=All"
const ENTRIES_RENDER_OFFSET = 6
const DEFAULT_VIEWABLE_ENTRIES_RANGE = [0, ENTRIES_RENDER_OFFSET * 2]

const EntryFolders = ({ entries, history, location: { search } }) => {
  useEffect(() => {
    if (!search) RouterPush(history, BASE_FOLDER_DIRECTORY_URL)
  }, [])

  const [viewableEntriesRange, setViewableEntriesRange] = useState(
    DEFAULT_VIEWABLE_ENTRIES_RANGE
  )

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

  const handleScroll = ({
    target: { scrollHeight, scrollTop, clientHeight },
  }) => {
    const scrollOffset = clientHeight / 4
    const moreEntriesExist = viewableEntries.length < entryFilteredTags.length

    const reachedBottom =
      moreEntriesExist &&
      scrollHeight - scrollTop <= clientHeight + scrollOffset

    if (reachedBottom) {
      setViewableEntriesRange([beginOffset, endOffset + ENTRIES_RENDER_OFFSET])
    }
  }

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
        RouterPush(history, search.concat(`+${name}`))
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
          xs={12}
          tag={Breadcrumb}
          className="FolderBreadCrumbsContainer p-0"
        >
          {renderFolderBreadCrumbs()}
        </Col>
      </Row>
      <Row className="EntryFoldersContainer Container" onScroll={handleScroll}>
        {renderFolders()}
        <Container className="EntryCards">
          <Row>
            <EntryCards entries={viewableEntries} />
          </Row>
        </Container>
      </Row>
    </Container>
  )
}

EntryFolders.propTypes = {
  entries: EntriesPropTypes,
  history: PropTypes.object,
  location: PropTypes.object,
}

EntryFolders.defaultProps = {}

export default memo(EntryFolders)
