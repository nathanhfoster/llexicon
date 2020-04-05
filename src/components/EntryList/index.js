import React, { useMemo, memo } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { BasicList } from "../"
import { withRouter } from "react-router-dom"
import Moment from "react-moment"
import MomentJS from "moment"
import { RouterPush, RouteMap } from "../../routes"
import Star from "../BackgroundImage/Star"
import TagsContainer from "../TagsContainer"
import "./styles.css"

const mapStateToProps = ({
  Window: { innerHeight, navBarHeight, isMobile }
}) => {
  const calendarTileHeight = innerHeight * 0.07 - 46 / 6
  const calendarHeight = 64 + 24 + calendarTileHeight * 6
  return {
    listHeight: isMobile
      ? innerHeight - navBarHeight - calendarHeight - 64 + 10
      : innerHeight - navBarHeight
  }
}

const EntryList = ({ history, entriesWithinView, activeDate, listHeight }) => {
  const entries = useMemo(
    () =>
      entriesWithinView
        .filter(entry => {
          const { date_created_by_author, _shouldDelete } = entry
          const date = MomentJS(activeDate)
          const startDate = MomentJS(date_created_by_author)
          const sameDayEvent = startDate.isSame(date, "day")
          return !_shouldDelete && sameDayEvent
        })
        .map((e, i) => {
          const {
            id,
            author,
            tags,
            title,
            html,
            date_created,
            date_created_by_author,
            date_updated,
            views,
            EntryFiles
          } = e
          const showImageIcon = EntryFiles.length > 0
          return {
            id,
            value: (
              <div
                key={id}
                onClick={() =>
                  RouterPush(
                    history,
                    RouteMap.ENTRY_DETAIL.replace(":entryId", `${id}`)
                  )
                }
                className="listItem"
              >
                <div className="Overflow eventTitle">
                  <Star size={8} color="White" animation={false} opacity={1} />
                  <span className="ml-1">{title || "No title"}</span>
                </div>

                <div className="Overflow eventDate">
                  {showImageIcon && <i className="fas fa-image mr-1" />}
                  <Moment format="h:mma">{date_created_by_author}</Moment>
                </div>

                <TagsContainer tags={tags} />
              </div>
            )
          }
        }),
    [entriesWithinView, activeDate]
  )

  const listItemStyles = { padding: "2px 4px", color: "white" }

  return (
    <BasicList
      list={entries}
      height={listHeight}
      itemSize={72}
      listItemStyles={listItemStyles}
    />
  )
}

EntryList.propTypes = {
  activeDate: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.instanceOf(Date)
  ]).isRequired,
  entriesWithinView: PropTypes.arrayOf(PropTypes.object)
}

export default reduxConnect(mapStateToProps)(withRouter(memo(EntryList)))
