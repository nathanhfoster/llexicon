import React, { Fragment } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { RouteMap, RouterPush } from "../../../redux/router/actions"
import { GetUserEntriesByDate } from "../../../redux/Entries/actions"
import EntryPreview from "./EntryPreview"
import MomentJS from "moment"
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

  const entries = entriesWithinView.filter((entry) => {
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
    view,
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
}) => {
  const handleTodayClick = () =>
    setTimeout(() => RouterPush(RouteMap.NEW_ENTRY), 10)

  const renderEntryPreviews = () =>
    entries.map((entry) => {
      const { id, ...restOfProps } = entry

      return (
        <EntryPreview
          key={id}
          id={id}
          {...restOfProps}
          date={date}
          staticContext={staticContext}
          view={view}
        />
      )
    })

  // console.log("TileContent: ")

  return (
    <Fragment>
      {shouldRenderPlusButton && (
        <i
          className="fas fa-feather-alt TileContentFeather"
          title="Create Entry"
          onClick={handleTodayClick}
        />
      )}
      {shouldRenderEntryPreview && (
        <div className="TileContentContainer">{renderEntryPreviews()}</div>
      )}
    </Fragment>
  )
}

TileContent.propTypes = {
  GetUserEntriesByDate: PropTypes.func.isRequired,
}

export default reduxConnect(mapStateToProps, mapDispatchToProps)(TileContent)
