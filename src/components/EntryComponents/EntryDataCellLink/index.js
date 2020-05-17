import React, { memo } from "react"
import PropTypes from "prop-types"
import { NavLink } from "react-router-dom"
import {
  RouterLinkPush,
  GetEntryDetailUrl,
} from "../../../redux/router/actions"

const EntryDataCellLink = ({ entryId, children }) => {
  const entryDetailUrl = GetEntryDetailUrl(entryId)
  const route = RouterLinkPush(entryDetailUrl)
  return (
    <NavLink to={route} onClick={(e) => e.stopPropagation()}>
      {children}
    </NavLink>
  )
}

EntryDataCellLink.propTypes = {
  entryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
}

export default memo(EntryDataCellLink)
