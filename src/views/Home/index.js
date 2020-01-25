import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { Container, Row, Col } from "reactstrap"
import RatingIcon from "../../components/RatingIcon"
import { connect as reduxConnect } from "react-redux"
import { withRouter } from "react-router-dom"

import MomentJs from "moment"
import { RouteMap, RouterPush, RouterLinkPush } from "../../ReactRouter/Routes"
import LogoImage from "../../components/BackgroundImage/LogoImage"
import "./styles.css"

const mapStateToProps = ({ Entries: { items, filteredItems } }) => {
  let sumRating = 0
  let sumRatingTimeUpdatingEntries = 0
  let previousDate = false
  let charCount = 0
  let wordCount = 0
  let tagCountMap = {}
  let viewCount = 0

  const entries = items.concat(filteredItems)

  for (var i = 0, { length } = entries; i < length; i++) {
    const {
      id,
      tags,
      EntryFiles,
      title,
      html,
      date_created,
      date_created_by_author,
      lastUpdated,
      date_updated,
      views,
      rating,
      address,
      latitude,
      longitude,
      author
    } = entries[i]
    sumRating += rating

    let updatedDated = MomentJs(lastUpdated || date_updated)

    if (previousDate) {
      sumRatingTimeUpdatingEntries += previousDate.diff(updatedDated, "milliseconds")
    }

    previousDate = updatedDated

    charCount += title.length
    wordCount += title.split(" ").length
    viewCount += views

    for (let j = 0, l = tags.length; j < l; j++) {
      const { title } = tags[j]

      tagCountMap[title] = tagCountMap[title] + 1 || 1
    }
  }

  const averageRating = (sumRating / length).toFixed(3)
  const averageMillisecondsUpdatingEntries = Math.abs(sumRatingTimeUpdatingEntries / length)
  const averageSecondsUpdatingEntries = averageMillisecondsUpdatingEntries / 1000
  const averageMinutesUpdatingEntries = averageSecondsUpdatingEntries / 60
  const averageHoursUpdatingEntries = averageMinutesUpdatingEntries / 60
  const averageDaysUpdatingEntries = averageMinutesUpdatingEntries / 24
  const averageWeeksUpdatingEntries = averageDaysUpdatingEntries / 7
  const averageMonthsUpdatingEntries = averageWeeksUpdatingEntries / 4.34524
  const averageYearsUpdatingEntries = averageMonthsUpdatingEntries / 12

  const averageTimesUpdatingEntries = [
    { title: "Milliseconds", value: averageMillisecondsUpdatingEntries },
    { title: "Seconds", value: averageSecondsUpdatingEntries },
    { title: "Minutes", value: averageMinutesUpdatingEntries },
    { title: "Hours", value: averageHoursUpdatingEntries },
    { title: "Days", value: averageDaysUpdatingEntries },
    { title: "Weeks", value: averageWeeksUpdatingEntries },
    { title: "Months", value: averageMonthsUpdatingEntries },
    { title: "Years", value: averageYearsUpdatingEntries }
  ]

  return {
    averageRating,
    averageTimesUpdatingEntries,
    charCount,
    wordCount,
    viewCount,
    tagCountMap
  }
}

const mapDispatchToProps = {}

class Home extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {}

  static defaultProps = {}

  renderAverageTimesUpdatingEntries = averageTimesUpdatingEntries =>
    averageTimesUpdatingEntries.map(time => {
      const { title, value } = time
      return (
        <Col xs={12}>
          <span className="Stat">{`${title}: ${value.toFixed(3)}`}</span>
        </Col>
      )
    })

  renderTagCounts = tagCountMap =>
    Object.keys(tagCountMap)
      .sort((a, b) => tagCountMap[b] - tagCountMap[a])
      .map(key => {
        const title = key
        const value = tagCountMap[title]

        return (
          <Col xs={12}>
            <span className="Stat">{`${title}: ${value}`}</span>
          </Col>
        )
      })

  render() {
    const {
      averageRating,
      averageTimesUpdatingEntries,
      charCount,
      wordCount,
      viewCount,
      tagCountMap
    } = this.props

    return (
      <Container className="Home Container">
        <Row>
          <Col xs={12}>
            <h4>Average Rating</h4>
            <RatingIcon rating={averageRating} />
            <span className="Stat ml-1">{averageRating}</span>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <h4>Char Count</h4>
            <i className="fab fa-wordpress-simple" />
            <span className="Stat ml-1">{charCount}</span>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <h4>Word Count</h4>
            <i className="fas fa-keyboard" />
            <span className="Stat ml-1">{wordCount}</span>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <h4>View Count</h4>
            <i className="far fa-eye" />
            <span className="Stat ml-1">{viewCount}</span>
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <h4>Tag Count</h4>
          </Col>
        </Row>
        <Row style={{ maxHeight: 180, overflowY: "auto" }}>{this.renderTagCounts(tagCountMap)}</Row>
        <Row>
          <Col xs={12}>
            <h4>Average Time Updating Entires</h4>
          </Col>
        </Row>
        <Row>{this.renderAverageTimesUpdatingEntries(averageTimesUpdatingEntries)}</Row>
      </Container>
    )
  }
}
export default withRouter(reduxConnect(mapStateToProps, mapDispatchToProps)(Home))
