import React, { useMemo, Fragment } from "react"
import PropTypes from "prop-types"
import { connect } from "store/provider"
import { RouteMap, RouterPush } from "reducers//router/actions"
import { GetUserEntriesByDate } from "reducers//Entries/actions"
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

  const shouldRenderPlusButton = !shouldRenderEntryPreview
    ? false
    : calendarDate.isSame(currentDate, "day")

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

  const renderEntryPreviews = useMemo(
    () =>
      entries.map((entry) => (
        <EntryPreview
          key={entry.id}
          id={entry.id}
          {...entry}
          date={date}
          staticContext={staticContext}
          view={view}
        />
      )),
    [entries]
  )

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
        <div className="TileContentContainer">{renderEntryPreviews}</div>
      )}
    </Fragment>
  )
}

TileContent.propTypes = {
  GetUserEntriesByDate: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(TileContent)
