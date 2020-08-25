import React, { useRef, useMemo, useEffect } from "react"
import { connect } from "store/provider"
import PropTypes from "prop-types"
import { EntryPropTypes } from "reducers//Entries/propTypes"
import { Container } from "reactstrap"
import ToolbarModal from "../../ToolbarModal"
import { BasicMap } from "../../../../"
import { WatchUserLocation } from "reducers//User/actions"
import { SetMapBoundsCenterZoom } from "reducers//Map/actions"
import { GetAddress } from "reducers//Actions/Google"
import "./styles.css"

const mapStateToProps = ({ Map, User: { location } }) => ({
  Map,
  UserLocation: location,
})

const mapDispatchToProps = { WatchUserLocation, SetMapBoundsCenterZoom }

const LocationButtonModal = ({
  Map,
  entry,
  UserLocation,
  xs,
  onChangeCallback,
  WatchUserLocation,
  SetMapBoundsCenterZoom,
}) => {
  let watchId = useRef(null)
  const prevMap = useMemo(() => Map, [])
  const saveDisabeld = useMemo(
    () =>
      !(
        entry.latitude ||
        entry.longitude ||
        UserLocation.latitude ||
        UserLocation.longitude
      ),
    [entry, UserLocation]
  )

  useEffect(() => {
    return () => {
      handleCancel()
    }
  }, [])

  const handleClick = () => {
    const { latitude, longitude } = entry
    if (!watchId.current) {
      watchId.current = WatchUserLocation()
    }
    if (latitude && longitude) {
      SetMapBoundsCenterZoom({
        center: { lat: latitude, lng: longitude },
        zoom: 16,
      })
    }
  }

  const handleSave = async () => {
    const {
      address,
      latitude: entryLatitude,
      longitude: entryLongitude,
    } = entry
    const { latitude: userLatitude, longitude: userLongitude } = UserLocation
    const latitude = userLatitude || entryLatitude
    const longitude = userLongitude || entryLongitude
    if (!address && latitude && longitude) {
      await GetAddress(latitude, longitude).then((address) =>
        onChangeCallback({ address, latitude, longitude })
      )
    } else {
      onChangeCallback({ address, latitude, longitude })
    }
    handleCancel()
  }

  const handleCancel = () => {
    if (watchId.current) {
      watchId.current = WatchUserLocation(watchId.current)
    }
    SetMapBoundsCenterZoom(prevMap)
  }

  return (
    <ToolbarModal
      className="p-0"
      title="Add Location"
      onClickCallback={handleClick}
      onCancelCallback={handleCancel}
      onSaveCallback={handleSave}
      ButtonIcon="fas fa-map-marker-alt"
      button="Add Location"
      xs={xs}
      disabledSave={saveDisabeld}
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
  Map: PropTypes.shape({
    bounds: PropTypes.shape({
      nw: PropTypes.shape({ lat: PropTypes.number, lng: PropTypes.number }),
      se: PropTypes.shape({ lat: PropTypes.number, lng: PropTypes.number }),
      sw: PropTypes.shape({ lat: PropTypes.number, lng: PropTypes.number }),
      ne: PropTypes.shape({ lat: PropTypes.number, lng: PropTypes.number }),
    }),
    center: PropTypes.shape({ lat: PropTypes.number, lng: PropTypes.number }),
    zoom: PropTypes.number,
  }),
  UserLocation: PropTypes.object,
  xs: PropTypes.number,
  entry: EntryPropTypes,
  onChangeCallback: PropTypes.func.isRequired,
  WatchUserLocation: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(LocationButtonModal)
