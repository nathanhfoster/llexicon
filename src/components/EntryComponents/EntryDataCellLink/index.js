import React, { memo } from "react"
import PropTypes from "prop-types"
import { NavLink } from "react-router-dom"
import {
  RouterLinkPush,
  GetEntryDetailUrl,
} from "../../../redux/router/actions"

const EntryDataCellLink = ({ className, entryId, children }) => {
  const entryDetailUrl = GetEntryDetailUrl(entryId)
  const route = RouterLinkPush(entryDetailUrl)
  return (
    <NavLink
      className={className}
      to={route}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </NavLink>
  )
}

EntryDataCellLink.propTypes = {
  className: PropTypes.string,
  entryId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
}

EntryDataCellLink.defaultProps = {
  className: null,
}

export default memo(EntryDataCellLink)
