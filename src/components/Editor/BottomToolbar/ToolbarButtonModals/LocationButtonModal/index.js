import React, { useRef, useEffect } from "react"
import { connect as reduxConnect } from "react-redux"
import PropTypes from "prop-types"
import { Container } from "reactstrap"
import ToolbarModal from "../../ToolbarModal"
import BasicMap from "../../../../BasicMap"
import { WatchUserLocation } from "../../../../../redux/User/actions"
import { GetAddress } from "../../../../../redux/Actions/Google"
import "./styles.css"

const mapStateToProps = ({ User: { location } }) => ({ UserLocation: location })

const mapDispatchToProps = { WatchUserLocation }

const LocationButtonModal = ({
  entry,
  UserLocation,
  xs,
  onChangeCallback,
  WatchUserLocation
}) => {
  let watchId = useRef(null)

  useEffect(() => {
    return () => {
      handleCancel()
    }
  }, [])

  if (!(entry.latitude || entry.longitude)) {
    entry.latitude = UserLocation.latitude
    entry.longitude = UserLocation.longitude
  }

  const handleClick = () => {
    if (!watchId.current) {
      watchId.current = WatchUserLocation()
    }
  }

  const handleSave = () => {
    const { address, latitude, longitude } = entry
    if (!address && latitude && longitude) {
      GetAddress(latitude, longitude)
        .then(address => onChangeCallback({ latitude, longitude, address }))
        .catch(e => onChangeCallback({ latitude, longitude }))
    }
    handleCancel()
  }

  const handleCancel = () => {
    if (watchId.current) {
      watchId.current = WatchUserLocation(watchId.current)
    }
  }

  return (
    <ToolbarModal
      className="p-0"
      title="Add Location"
      onClickCallback={handleClick}
      onCancelCallback={handleCancel}
      onSaveCallback={handleSave}
      ButtonIcon="fas fa-map-marker-alt"
      buttonTitle="Add Location"
      xs={xs}
      saveDisabled={!UserLocation.latitude || !UserLocation.longitude}
    >
      <Container fluid className="LocationButtonModal p-0">
        <BasicMap
          renderUserLocation
          entry={entry}
          getAddressOnMarkerClick
          onChangeCallback={onChangeCallback}
        />
      </Container>
    </ToolbarModal>
  )
}

LocationButtonModal.propTypes = {
  UserLocation: PropTypes.object,
  xs: PropTypes.number,
  entry: PropTypes.object.isRequired,
  onChangeCallback: PropTypes.func.isRequired,
  WatchUserLocation: PropTypes.func.isRequired
}

export default reduxConnect(
  mapStateToProps,
  mapDispatchToProps
)(LocationButtonModal)
