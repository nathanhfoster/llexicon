import React, { useState, useCallback, useMemo, memo } from "react"
import { EntriesPropTypes } from "redux/Entries/propTypes"
import EntryMedia from "./EntryMedia"
import { Container } from "reactstrap"
import { useScrollable } from "hooks"
import "./styles.css"
import { Header } from "components"
import {
  getYouTubeThumnail,
  I_FRAME_REGEX,
  IMAGE_REGEX,
  SRC_REGEX,
  SRC_REGEX_GLOBAL,
  YOUTUBE_VIDEO_ID,
} from "utils"

const ENTRIES_RENDER_OFFSET = 6
const DEFAULT_VIEWABLE_ENTRIES_RANGE = [0, ENTRIES_RENDER_OFFSET * 2]

const EntriesMedia = ({ entries }) => {
  const [viewableEntriesRange, setViewableEntriesRange] = useState(
    DEFAULT_VIEWABLE_ENTRIES_RANGE
  )

  const [beginOffset, endOffset] = viewableEntriesRange

  const handleReachedBottom = useCallback(() => {
    setViewableEntriesRange([beginOffset, endOffset + ENTRIES_RENDER_OFFSET])
  }, [beginOffset, endOffset])

  const handleOnScroll = useScrollable({ handleReachedBottom })

  const { entryMedia: renderEntryMedia, sourceMap } = useMemo(
    () =>
      entries.reduce(
        (acc, { id: entryId, title, html, tags, people, EntryFiles }, i) => {
          const defaultProps = { entryId, title, tags, people }

          if (EntryFiles?.length > 0) {
            EntryFiles.forEach(({ id, url, entry_id }, j) => {
              if (!acc.sourceMap[`${entryId}-${url}`]) {
                acc.sourceMap[`${entryId}-${url}`] =
                  acc.sourceMap[`${entryId}-${url}`] + 1 || 1
                acc.entryMedia.push(
                  <EntryMedia
                    key={`File-${entryId}-${id}-${i}-${j}`}
                    {...defaultProps}
                    src={url}
                  />
                )
              }
            })
          }

          if (I_FRAME_REGEX.test(html)) {
            I_FRAME_REGEX.lastIndex = 0
            let iterator
            while ((iterator = I_FRAME_REGEX.exec(html))) {
              const { 0: iFrame, groups, index, input, length } = iterator
              const [src] = iFrame.match(SRC_REGEX)
              // const youTubeVideoId = src?.match(YOUTUBE_VIDEO_ID)?.pop()
              // const thumbnailSrc = getYouTubeThumnail(youTubeVideoId)
              if (!acc.sourceMap[`${entryId}-${src}`]) {
                acc.sourceMap[`${entryId}-${src}`] =
                  acc.sourceMap[`${entryId}-${src}`] + 1 || 1
                acc.entryMedia.push(
                  <EntryMedia
                    key={`iFrame-${entryId}-${i}-${I_FRAME_REGEX.lastIndex}`}
                    isVideo={true}
                    {...defaultProps}
                    // isVideo={!thumbnailSrc}
                    src={src}
                  />
                )
              }
            }
          }

          if (IMAGE_REGEX.test(html)) {
            IMAGE_REGEX.lastIndex = 0
            let iterator
            while ((iterator = IMAGE_REGEX.exec(html))) {
              const {
                0: image,
                1: src,
                groups,
                index,
                input,
                length,
              } = iterator
              if (!acc.sourceMap[`${entryId}-${src}`]) {
                acc.sourceMap[`${entryId}-${src}`] =
                  acc.sourceMap[`${entryId}-${src}`] + 1 || 1
                acc.entryMedia.push(
                  <EntryMedia
                    key={`Image-${entryId}-${i}-${IMAGE_REGEX.lastIndex}`}
                    {...defaultProps}
                    src={src}
                  />
                )
              }
            }
          }

          return acc
        },
        { entryMedia: [], sourceMap: {} }
      ),
    [entries]
  )

  const renderViewableEntriesMedia = useMemo(
    () => renderEntryMedia.slice(beginOffset, endOffset),
    [renderEntryMedia, beginOffset, endOffset]
  )

  return (
    <Container>
      <div
        className="EntriesMediaContainer Container row"
        onScroll={handleOnScroll}
      >
        {renderViewableEntriesMedia.length > 0 ? (
          renderViewableEntriesMedia
        ) : (
          <Header>No Media</Header>
        )}
      </div>
    </Container>
  )
}

EntriesMedia.propTypes = {
  entries: EntriesPropTypes,
}

export default memo(EntriesMedia)
