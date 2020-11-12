import React from 'react'
import PropTypes from 'prop-types'
import { EntriesPropTypes } from 'redux/Entries/propTypes'
import { Button } from 'reactstrap'
import { connect } from 'react-redux'

import { exportJSON, getValidDate } from 'utils'
import { getTagStringFromObject } from 'redux/Entries/utils'

const mapStateToProps = ({ User: { id }, Entries: { items, filteredItems } }, { entries }) => ({
  userId: id,
  entries: entries || items.concat(filteredItems),
})

const ButtonClearEntries = ({ userId, entries }) => {
  
  const handleExportEntries = () => {
    const formattedEntries = entries.map((entry, i) => {
      const {
        id,
        author,
        tags,
        people,
        title,
        html,
        date_created,
        date_created_by_author,
        date_updated,
        views,
        rating,
        address,
        latitude,
        longitude,
        is_public,
        ...restOfProps
      } = entry

      let entries = {
        id,
        author,
        tags: getTagStringFromObject(tags),
        people: getTagStringFromObject(people),
        title,
        html,
        date_created: getValidDate(date_created),
        date_created_by_author: getValidDate(date_created_by_author),
        date_updated: getValidDate(date_updated),
        views,
        rating,
        address,
        latitude,
        longitude,
        is_public,
        ...restOfProps,
      }

      if (userId) {
        entries['author'] = userId
      }

      return entries
    })

    exportJSON(formattedEntries, `Astral-Tree-Entries-${new Date()}`)
  }
  return (
    <Button color='accent' onClick={handleExportEntries} disabled={entries.length === 0}>
      <i className='fas fa-file-export' /> Export
    </Button>
  )
}

ButtonClearEntries.propTypes = {
  userId: PropTypes.number,
  entries: EntriesPropTypes,
}

ButtonClearEntries.defaultProps = {}

export default connect(mapStateToProps)(ButtonClearEntries)
