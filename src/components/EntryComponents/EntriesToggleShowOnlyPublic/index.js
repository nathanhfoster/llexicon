import React, { useState, useEffect, useMemo, memo } from "react"
import PropTypes from "prop-types"
import { connect } from "store/provider"
import { Button } from "reactstrap"
import { ToggleShowOnlyPublic } from "store/reducers/Entries/actions"

const mapStateToProps = ({ Entries: { showOnlyPublic } }) => ({
  showOnlyPublic,
})

const mapDispatchToProps = { ToggleShowOnlyPublic }

const EntriesToggleShowOnlyPublic = ({
  showOnlyPublic,
  ToggleShowOnlyPublic,
}) => {
  const handleOnClick = () => {
    ToggleShowOnlyPublic()
  }
  return (
    <Button className="py-2 px-3" color="accent" onClick={handleOnClick}>
      <span className="mr-2">{`${
        showOnlyPublic ? "Public" : "Private"
      } Mode`}</span>
      <i className={`fas fa-lock${showOnlyPublic ? "-open" : ""}`} />
    </Button>
  )
}

EntriesToggleShowOnlyPublic.propTypes = {}

EntriesToggleShowOnlyPublic.defaultProps = {}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EntriesToggleShowOnlyPublic)
