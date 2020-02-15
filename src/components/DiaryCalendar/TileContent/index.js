import React, { Fragment, memo } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { RouteMap, RouterPush } from "../../ReactRouter/Routes"
import { GetUserEntriesByDate } from "../../../redux/Entries/actions"
import { withRouter } from "react-router-dom"
import EntryPreview from "./EntryPreview"
import MomentJS from "moment"
import deepEquals from "../../../helpers/deepEquals"
import "./styles.css"

const mapStateToProps = (
  { Window: { isMobile } },
  { date, view, staticContext, activeDate, entriesWithinView }
) => {
  const calendarDate = MomentJS(date)
  const currentDate = MomentJS(activeDate)

  const sameMonth = calendarDate.isSame(currentDate, "month")

  const shouldRenderEntryPreview = view === "month" && sameMonth

  const shouldRenderPlusButton =
    shouldRenderEntryPreview && isMobile
      ? calendarDate.isSame(currentDate, "day")
      : true

  const entries = entriesWithinView.filter(entry => {
    const { date_created_by_author, _shouldDelete } = entry

    const entryDate = MomentJS(date_created_by_author)
    const eventFound = entryDate.isSame(calendarDate, "day")

    return !_shouldDelete && eventFound
  })

  return {
    shouldRenderEntryPreview,
    shouldRenderPlusButton,
    entries,
    date,
    staticContext,
    view
  }
}

const mapDispatchToProps = { GetUserEntriesByDate }

const TileContent = ({
  shouldRenderEntryPreview,
  shouldRenderPlusButton,
  entries,
  date,
  staticContext,
  view,
  history
}) => {
  const handleTodayClick = () =>
    setTimeout(() => RouterPush(history, RouteMap.NEW_ENTRY), 10)

  const renderEntryPreviews = entries =>
    entries.map(entry => {
      const { id, ...restOfProps } = entry

      return (
        <EntryPreview
          key={id}
          id={id}
          {...restOfProps}
          date={date}
          staticContext={staticContext}
          view={view}
          history={history}
        />
      )
    })

  // console.log("TileContent: ")

  return (
    <Fragment>
      {shouldRenderPlusButton && (
        <i
          className="fas fa-feather-alt TileContentFeather"
          onClick={handleTodayClick}
        />
      )}
      {shouldRenderEntryPreview && (
        <div className="TileContentContainer">
          {renderEntryPreviews(entries)}
        </div>
      )}
    </Fragment>
  )
}

TileContent.propTypes = {
  GetUserEntriesByDate: PropTypes.func.isRequired
}

const isEqual = (prevProps, nextProps) => {
  const {
    entries,
    shouldRenderEntryPreview,
    shouldRenderPlusButton
  } = prevProps

  const entriesAreEqual = deepEquals(entries, nextProps.entries)

  const shouldRenderEntryPreviewAreEqual =
    shouldRenderEntryPreview === nextProps.shouldRenderEntryPreview

  const shouldRenderPlusButtonAreEqual =
    shouldRenderPlusButton === nextProps.shouldRenderPlusButton

  const equal =
    entriesAreEqual &&
    shouldRenderEntryPreviewAreEqual &&
    shouldRenderPlusButtonAreEqual

  return equal
}

export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(memo(TileContent, isEqual))
)
