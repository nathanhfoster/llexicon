import React, { Fragment, memo } from 'react'
import { EntriesPropTypes } from 'redux/Entries/propTypes'
import { connect as reduxConnect } from 'react-redux'
import { Container, Row, Col } from 'reactstrap'
import MomentJs from 'moment'
import deepEquals from '../../../utils/deepEquals'
import { formatBytes } from '../../../utils'
import './styles.css'

const mapStateToProps = ({ Entries: { items, filteredItems, count } }) => ({
  items,
  filteredItems,
  count,
})

const EntryStatistics = ({ items, filteredItems, count }) => {
  let sumRating = 0
  let sumRatingTimeUpdatingEntries = 0
  let previousDate = false
  let charCount = 0
  let wordCount = 0
  let tagCountMap = {}
  let peopleCountMap = {}
  let viewCount = 0
  let entriesToPost = 0
  let entriesToUpdate = 0
  let entriesToDelete = 0

  const entries = items.concat(filteredItems)

  let validRatedEntries = 0

  const totalEntries = entries.length

  let minimumWordsInAnEntry = Infinity
  let maximumWordsInAnEntry = -Infinity

  for (var i = 0; i < totalEntries; i++) {
    const {
      id,
      author,
      tags,
      people,
      EntryFiles,
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
      size,
      is_public,
      _size,
      _shouldDelete,
      _shouldPost,
      _lastUpdated,
    } = entries[i]
    if (rating !== 0) {
      sumRating += rating
      validRatedEntries += 1
    }

    if (_shouldDelete) {
      entriesToDelete += 1
    }

    if (_shouldPost) {
      entriesToPost += 1
    }

    if (_lastUpdated) {
      entriesToUpdate += 1
    }

    let updatedDated = MomentJs(date_updated)

    if (previousDate) {
      sumRatingTimeUpdatingEntries += previousDate.diff(updatedDated, 'milliseconds')
    }

    previousDate = updatedDated

    const entryString = `${title} ${html}`
    const currentCharCount = entryString.length
    const currentWordCount = entryString.split(' ').length

    charCount += currentCharCount
    wordCount += currentWordCount
    viewCount += views

    if (currentWordCount < minimumWordsInAnEntry) minimumWordsInAnEntry = currentWordCount
    if (currentWordCount > maximumWordsInAnEntry) maximumWordsInAnEntry = currentWordCount

    for (let j = 0, l = tags.length; j < l; j++) {
      const { name } = tags[j]

      tagCountMap[name] = tagCountMap[name] + 1 || 1
    }

    for (let k = 0, len = people.length; k < len; k++) {
      const { name } = people[k]
      peopleCountMap[name] = peopleCountMap[name] + 1 || 1
    }
  }

  const averageRating = sumRating / validRatedEntries
  const averageWordsPerEntry = wordCount / totalEntries

  // const averageMillisecondsUpdatingEntries = Math.abs(sumRatingTimeUpdatingEntries / totalEntries)
  // const averageSecondsUpdatingEntries = averageMillisecondsUpdatingEntries / 1000
  // const averageMinutesUpdatingEntries = averageSecondsUpdatingEntries / 60
  // const averageHoursUpdatingEntries = averageMinutesUpdatingEntries / 60
  // const averageDaysUpdatingEntries = averageHoursUpdatingEntries / 24
  // const averageWeeksUpdatingEntries = averageDaysUpdatingEntries / 7
  // const averageMonthsUpdatingEntries = averageWeeksUpdatingEntries / 4.34524
  // const averageYearsUpdatingEntries = averageMonthsUpdatingEntries / 12

  // const averageTimesUpdatingEntries = [
  //   { title: "Milliseconds", value: averageMillisecondsUpdatingEntries },
  //   { title: "Seconds", value: averageSecondsUpdatingEntries },
  //   { title: "Minutes", value: averageMinutesUpdatingEntries },
  //   { title: "Hours", value: averageHoursUpdatingEntries },
  //   { title: "Days", value: averageDaysUpdatingEntries },
  //   { title: "Weeks", value: averageWeeksUpdatingEntries },
  //   { title: "Months", value: averageMonthsUpdatingEntries },
  //   { title: "Years", value: averageYearsUpdatingEntries },
  // ]

  const entryAverages = [
    { title: 'Rating', value: averageRating },
    { title: 'Words / entry', value: averageWordsPerEntry },
    // { title: "Time Writing Entries", value: averageTimesUpdatingEntries },
  ]

  const entryCounts = [
    { title: 'Entries', value: totalEntries },
    { title: 'Entries to Post', value: entriesToPost },
    { title: 'Entries to Update', value: entriesToUpdate },
    { title: 'Entries to Delete', value: entriesToDelete },
    { title: 'Views', value: viewCount },
    { title: 'Characters', value: charCount },
    { title: 'Words', value: wordCount },
    { title: 'Minimum words / entry', value: minimumWordsInAnEntry },
    { title: 'Maximum words / entry', value: maximumWordsInAnEntry },
  ]

  const renderEntryStats = (stats, fixedValue = 2) =>
    stats.map((stat, i) => {
      const { title, value } = stat
      if (Array.isArray(value)) {
        return (
          <Fragment key={`${title}-${i}`}>
            <Col xs={12}>
              <span className='HomeSubHeader'>{title}</span>
            </Col>
            {value.map(v => renderStat(i, v, fixedValue))}
          </Fragment>
        )
      }
      return renderStat(i, stat, fixedValue)
    })

  const renderTagCounts = () =>
    Object.keys(tagCountMap)
      .sort((a, b) => tagCountMap[b] - tagCountMap[a])
      .map((name, i) => {
        const value = tagCountMap[name]

        return renderStat(i, { title: name, value })
      })

  const renderPeopleCounts = () =>
    Object.keys(peopleCountMap)
      .sort((a, b) => peopleCountMap[b] - peopleCountMap[a])
      .map((name, i) => {
        const value = peopleCountMap[name]

        return renderStat(i, { title: name, value })
      })

  const renderStat = (key, { title, value, type = 'number' }, fixedValue = 0) => (
    <Col xs={12} key={`${title}-${key}`}>
      <span style={{ fontSize: 14, fontWeight: 600 }}>{`${title}: `}</span>
      <span className='Stat'>{type === 'number' ? Number(value).toFixed(fixedValue) : value}</span>
    </Col>
  )

  return (
    <Container className='EntryStatistics Container'>
      <Row>
        <Col xs={12} className='p-0'>
          <h1>Entry Statistics</h1>
        </Col>
      </Row>
      <Row className='StatContainer'>
        <Col xs={12}>
          <span className='HomeSubHeader'>Average</span>
        </Col>
        {renderEntryStats(entryAverages)}
      </Row>
      <Row className='StatContainer'>
        <Col xs={12}>
          <span className='HomeSubHeader'>Count</span>
        </Col>
        {renderEntryStats(entryCounts, 0)}
      </Row>
      <Row className='StatContainer'>
        <Col xs={12}>
          <span className='HomeSubHeader'>Tags</span>
        </Col>
        {renderTagCounts()}
      </Row>
      <Row className='StatContainer'>
        <Col xs={12}>
          <span className='HomeSubHeader'>People</span>
        </Col>
        {renderPeopleCounts()}
      </Row>
    </Container>
  )
}

EntryStatistics.propTypes = {
  items: EntriesPropTypes,
  filteredItems: EntriesPropTypes,
}

const isEqual = (prevProps, nextProps) => deepEquals(prevProps, nextProps)

export default reduxConnect(mapStateToProps)(memo(EntryStatistics, isEqual))
