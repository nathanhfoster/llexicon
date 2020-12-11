import React, { useMemo, Fragment } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { Media } from "reactstrap"
import { RouteMap, RouterPush } from "redux/router/actions"
import { GetUserEntriesByDate } from "redux/Entries/actions"
import EntryPreview from "./EntryPreview"
import MomentJS from "moment"
import { I_FRAME_REGEX, SRC_REGEX, IMAGE_REGEX } from "utils"
import "./styles.css"

const mapStateToProps = (
  { Calendar: { activeEntry }, Window: { isMobile } },
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
    activeEntryExists:
      Boolean(activeEntry.id) &&
      activeEntry._calendarDate?.getDate() === date.getDate(),
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
  activeEntryExists,
  shouldRenderEntryPreview,
  shouldRenderPlusButton,
  entries,
  date,
  staticContext,
  view,
}) => {
  const handleTodayClick = () =>
    setTimeout(() => RouterPush(RouteMap.NEW_ENTRY), 10)

  const renderEntryPreviews = useMemo(() => {
    const entryPreviews = entries.map((entry) => {
      return (
        <EntryPreview
          {...entry}
          key={entry.id}
          date={date}
          staticContext={staticContext}
          view={view}
        />
      )
    })

    return entryPreviews
  }, [date, entries, staticContext, view])

  const firstEntryFileSource = useMemo(() => {
    let firstEntryFileSource
    for (let i = 0, { length } = entries; i < length; i++) {
      const entry = entries[i]

      if (!firstEntryFileSource) {
        let foundFile = entry.EntryFiles.find(({ entry_id, url }) => url)

        // if (I_FRAME_REGEX.test(entry.html)) {
        //   I_FRAME_REGEX.lastIndex = 0
        //   let iterator
        //   while ((iterator = I_FRAME_REGEX.exec(entry.html))) {
        //     if (firstEntryFileSource) break
        //     const { 0: iFrame, groups, index, input, length } = iterator
        //     const [src] = iFrame.match(SRC_REGEX)
        //     // const youTubeVideoId = src?.match(YOUTUBE_VIDEO_ID)?.pop()
        //     // const thumbnailSrc = getYouTubeThumnail(youTubeVideoId)
        //   }
        // }

        let foundImageRegex

        if (IMAGE_REGEX.test(entry.html)) {
          IMAGE_REGEX.lastIndex = 0
          let iterator
          while ((iterator = IMAGE_REGEX.exec(entry.html))) {
            if (firstEntryFileSource) break
            const { 0: image, 1: src, groups, index, input, length } = iterator
            foundImageRegex = src
          }

          firstEntryFileSource = foundImageRegex || foundFile?.url
        }
      }

      return firstEntryFileSource
    }
  }, [entries])

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
        <Fragment>
          <div
            id={`portal-tile-image-${date.getDate()}`}
            className="EntryPreviewImage"
          />
          {!activeEntryExists && firstEntryFileSource && (
            <div className="EntryPreviewImage">
              <Media src={firstEntryFileSource} />
            </div>
          )}
          <div className="TileContentContainer">{renderEntryPreviews}</div>
        </Fragment>
      )}
    </Fragment>
  )
}

TileContent.propTypes = {
  GetUserEntriesByDate: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(TileContent)
