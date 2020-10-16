import React, { useEffect, useState, useCallback, useMemo, lazy } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import { EntriesPropTypes } from 'redux/Entries/propTypes'
import { Container, Row, Col, Breadcrumb, BreadcrumbItem, Button } from 'reactstrap'
import { NavLink } from 'react-router-dom'
import { RouterPush } from 'redux/router/actions'
import { filterMapArray, TopKFrequentStrings } from 'utils'
import { useScrollable } from 'hooks'
import './styles.css'

const EntryCards = lazy(() => import('../EntryCards'))
const EntryFolder = lazy(() => import('./EntryFolder'))
const BASE_FOLDER_DIRECTORY_URL = 'folders?folder=All'
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

  const [viewableEntriesRange, setViewableEntriesRange] = useState(DEFAULT_VIEWABLE_ENTRIES_RANGE)

  const [minimizeEntryCards, setMinimizeEntryCards] = useState(true)

  const handleMinimizeEntryCardsToggle = useCallback(
    () => setMinimizeEntryCards(prevMinimizeEntryCards => !prevMinimizeEntryCards),
    [],
  )

  const [beginOffset, endOffset] = viewableEntriesRange

  const directoryPath = useMemo(() => search.replace('?folder=', '').split('+'), [search])
  const directoryTags = useMemo(() => directoryPath.slice(1), [directoryPath])

  const entryFilteredTags = useMemo(
    () =>
      entries.filter(entry =>
        directoryTags.every(tag => entry.tags.some(({ name }) => name === tag)),
      ),
    [entries, directoryTags],
  )

  const filteredEntryTags = useMemo(
    () =>
      entryFilteredTags
        .map(entry => entry.tags)
        .flat(1)
        .filter(({ name }) => !directoryTags.includes(name)),
    [entryFilteredTags, directoryTags],
  )

  const viewableEntries = useMemo(() => entryFilteredTags.slice(beginOffset, endOffset), [
    entryFilteredTags,
    beginOffset,
    endOffset,
    minimizeEntryCards,
    search,
  ])

  const setViewableEntriesRangeThreshold = viewableEntries.length < entryFilteredTags.length

  const [reachedBottom, setReachedBottomCallback] = useScrollable(setViewableEntriesRangeThreshold)

  useEffect(() => {
    setViewableEntriesRange([beginOffset, endOffset + ENTRIES_RENDER_OFFSET])
  }, [reachedBottom])

  const renderFolderBreadCrumbs = useMemo(
    () =>
      directoryPath.map((directory, i) => {
        const newDirectory = directoryPath.slice(0, i + 1).join('+')
        const path = `?folder=${newDirectory}`
        return (
          <BreadcrumbItem key={`${directory}-${i}`}>
            <NavLink to={path}>{directory}</NavLink>
          </BreadcrumbItem>
        )
      }),
    [directoryPath],
  )

  const sortedTags = useMemo(() => {
    // TODO: Make a dropdown toggle
    // return TopKFrequentStrings(filteredEntryTags, "name")
    return filterMapArray(filteredEntryTags, 'name', 'name').sort((a, b) => a.localeCompare(b))
  }, [filteredEntryTags])

  const renderFolders = useMemo(
    () =>
      sortedTags.map((name, i) => {
        const handleOnClickCallback = () => {
          RouterPush(search.concat(`+${name}`))
          setViewableEntriesRange(DEFAULT_VIEWABLE_ENTRIES_RANGE)
        }

        return (
          <Col key={`${name}-${i}`} xs={4} sm={3} md={2} className='p-0'>
            <EntryFolder title={name} onClick={handleOnClickCallback} />
          </Col>
        )
      }),
    [sortedTags, search],
  )

  return (
    <Container className='EntryFolders'>
      <Row>
        <Col xs={11} tag={Breadcrumb} className='FolderBreadCrumbsContainer p-0'>
          {renderFolderBreadCrumbs}
        </Col>
        <Col
          xs={1}
          className='p-0'
          tag={Button}
          color='accent'
          onClick={handleMinimizeEntryCardsToggle}
        >
          <i className={`fas fa-eye${minimizeEntryCards ? '' : '-slash'}`} />
        </Col>
      </Row>
      <Row className='EntryFoldersContainer Container' onScroll={setReachedBottomCallback}>
        {renderFolders}
        <Container className='EntryCards'>
          <Row>
            <EntryCards entries={viewableEntries} minimal={minimizeEntryCards} />
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

EntryFolders.defaultProps = { search: '' }

export default reduxConnect(mapStateToProps)(EntryFolders)
