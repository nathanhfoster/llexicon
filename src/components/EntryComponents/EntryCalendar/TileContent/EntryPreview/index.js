import React, { useMemo, Fragment } from "react"
import PropTypes from "prop-types"
import {
  SetCalendarActiveEntry,
  ResetCalendarActiveEntry,
} from "redux/Calendar/actions"
import { EntryPropTypes, EntryPropType } from "redux/Entries/propTypes"
import { Portal } from "components"
import { Media } from "reactstrap"
import { connect } from "react-redux"
import { GoToEntryDetail } from "redux/router/actions"
import Moment from "react-moment"
import Star from "../../../../BackgroundImage/Star"
import { I_FRAME_REGEX, SRC_REGEX, IMAGE_REGEX } from "utils"
import "./styles.css"

const mapStateToProps = (
  { Calendar: { activeEntry }, Window: { isMobile } },
  { id, EntryFiles }
) => ({ shouldRenderImage: activeEntry.id == id, isMobile })

const mapDispatchToProps = { SetCalendarActiveEntry, ResetCalendarActiveEntry }

const EntryPreview = ({
  shouldRenderImage,
  isMobile,
  view,
  date,
  staticContext,
  SetCalendarActiveEntry,
  ResetCalendarActiveEntry,
  ...entryProps
}) => {
  const {
    size,
    author,
    id,
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
    is_public,
    _size,
    _shouldDelete,
    _shouldPost,
    _lastUpdated,
    _isSelected,
  } = entryProps

  const firstEntryFileSource = useMemo(() => {
    let firstEntryFileSource

    if (!firstEntryFileSource) {
      let foundFile = EntryFiles.find(({ entry_id, url }) => url)

      // if (I_FRAME_REGEX.test(html)) {
      //   I_FRAME_REGEX.lastIndex = 0
      //   let iterator
      //   while ((iterator = I_FRAME_REGEX.exec(html))) {
      //     if (firstEntryFileSource) break
      //     const { 0: iFrame, groups, index, input, length } = iterator
      //     const [src] = iFrame.match(SRC_REGEX)
      //     // const youTubeVideoId = src?.match(YOUTUBE_VIDEO_ID)?.pop()
      //     // const thumbnailSrc = getYouTubeThumnail(youTubeVideoId)
      //   }
      // }

      let foundImageRegex

      if (IMAGE_REGEX.test(html)) {
        IMAGE_REGEX.lastIndex = 0
        let iterator
        while ((iterator = IMAGE_REGEX.exec(html))) {
          if (foundImageRegex) break
          const { 0: image, 1: src, groups, index, input, length } = iterator
          foundImageRegex = src
        }

        firstEntryFileSource = foundImageRegex || foundFile?.url
      }
    }

    return firstEntryFileSource
  }, [html])

  const handleOnClick = () => {
    GoToEntryDetail(id)
  }
  const handleOnMouseEnter = () => {
    SetCalendarActiveEntry({
      ...entryProps,
      _image: firstEntryFileSource,
      _calendarDate: date,
      _calendarView: view,
    })
  }
  const handleOnMouseLeave = () => {
    ResetCalendarActiveEntry()
  }

  const portalId = useMemo(() => `portal-tile-image-${date.getDate()}`, [date])

  return (
    <Fragment>
      {shouldRenderImage && (
        <Portal id={portalId}>
          <Media src={firstEntryFileSource} />
        </Portal>
      )}
      {view == "month" && !isMobile ? (
        <div className="TileContent">
          <div
            onClick={handleOnClick}
            onMouseEnter={handleOnMouseEnter}
            onMouseLeave={handleOnMouseLeave}
            className={`hasEventsContainer ${
              shouldRenderImage ? "hasEventsContainerHover" : ""
            }`}
            data-for={`${id}`}
            data-tip={id}
          >
            <Star
              size={8}
              marginRight={2}
              color="PurpleWhite"
              animation={false}
              opacity={1}
            />
            <span className="eventDate mr-1">
              <Moment format="h:mma">{date_created_by_author}</Moment>
            </span>
            <span className="eventTitle Overflow">{title || "No title"}</span>
          </div>
        </div>
      ) : view == "month" ? (
        <Star
          bottom="8px"
          size={8}
          color="PurpleWhite"
          animation={false}
          opacity={1}
        />
      ) : null}
    </Fragment>
  )
}

EntryPreview.propTypes = {
  activeEntry: EntryPropTypes,
  isMobile: PropTypes.bool,
  view: PropTypes.string,
  id: PropTypes.string,
  date: PropTypes.instanceOf(Date),
  staticContext: PropTypes.string,
  view: PropTypes.string,
  SetCalendarActiveEntry: PropTypes.func.isRequired,
  ResetCalendarActiveEntry: PropTypes.func.isRequired,
  ...EntryPropType,
}

export default connect(mapStateToProps, mapDispatchToProps)(EntryPreview)
