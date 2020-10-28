import React, { useRef, useMemo, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { EntryPropTypes } from 'redux/Entries/propTypes'
import { Container } from 'reactstrap'
import ToolbarModal from '../../ToolbarModal'
import { BasicMap } from 'components'
import { WatchUserLocation } from 'redux/User/actions'
import { SetMapBoundsCenterZoom } from 'redux/Map/actions'
import { GetAddress } from 'redux/Actions/Google'
import './styles.css'

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
  onChange,
  WatchUserLocation,
  SetMapBoundsCenterZoom,
}) => {
  let watchId = useRef(null)
  const prevMap = useMemo(() => Map, [])
  const saveDisabeld = useMemo(
    () => !(entry.latitude || entry.longitude || UserLocation.latitude || UserLocation.longitude),
    [entry, UserLocation],
  )

  useEffect(() => {
    return () => {
      handleCancel()
    }
  }, [])

  const handleClick = useCallback(() => {
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
  }, [watchId.current, entry.latitude, entry.longitude])

  const handleSave = useCallback(async () => {
    const { address, latitude: entryLatitude, longitude: entryLongitude } = entry
    const { latitude: userLatitude, longitude: userLongitude } = UserLocation
    const latitude = userLatitude || entryLatitude
    const longitude = userLongitude || entryLongitude
    if (!address && latitude && longitude) {
      await GetAddress(latitude, longitude).then(address =>
        onChange({ address, latitude, longitude }),
      )
    } else {
      onChange({ address, latitude, longitude })
    }
    handleCancel()
  }, [
    entry.address,
    entry.latitude,
    entry.longitude,
    UserLocation.latitude,
    UserLocation.longitude,
  ])

  const handleCancel = useCallback(() => {
    if (watchId.current) {
      watchId.current = WatchUserLocation(watchId.current)
    }
    SetMapBoundsCenterZoom(prevMap)
  }, [watchId.current])

  return (
    <ToolbarModal
      className='p-0'
      title='Add Location'
      onClick={handleClick}
      onCancelCallback={handleCancel}
      onSaveCallback={handleSave}
      ButtonIcon='fas fa-map-marker-alt'
      button='Add Location'
      xs={xs}
      disabledSave={saveDisabeld}
    >
      <Container fluid className='LocationButtonModal p-0'>
        <BasicMap renderUserLocation entry={entry} getAddressOnMarkerClick onChange={onChange} />
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
  onChange: PropTypes.func.isRequired,
  WatchUserLocation: PropTypes.func.isRequired,
}

export default connect(mapStateToProps, mapDispatchToProps)(LocationButtonModal)
