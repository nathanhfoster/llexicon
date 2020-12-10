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

  const [renderEntryPreviews, firstEntryFileSource] = useMemo(() => {
    let firstEntryFileSource

    const entryPreviews = entries.map((entry) => {
      if (!firstEntryFileSource) {
        const foundFile = entry.EntryFiles.find(({ url }) => url)

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
        }

        firstEntryFileSource = foundFile?.url || foundImageRegex
      }
      return (
        <EntryPreview
          key={entry.id}
          id={entry.id}
          {...entry}
          date={date}
          staticContext={staticContext}
          view={view}
        />
      )
    })

    return [entryPreviews, firstEntryFileSource]
  }, [date, entries, staticContext, view])

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
          {firstEntryFileSource && (
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
