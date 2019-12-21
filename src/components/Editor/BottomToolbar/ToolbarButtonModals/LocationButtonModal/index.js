import React, { PureComponent } from "react"
import { connect as reduxConnect } from "react-redux"
import PropTypes from "prop-types"
import { Container } from "reactstrap"
import ToolbarModal from "../../ToolbarModal"
import BasicMap from "../../../../BasicMap"
import { WatchUserLocation, SetUserLocation } from "../../../../../actions/User"
import { GetAddress } from "../../../../../actions/Google"
import "./styles.css"

const mapStateToProps = ({ User: { location } }) => ({ UserLocation: location })

const mapDispatchToProps = { WatchUserLocation, SetUserLocation }

class LocationButtonModal extends PureComponent {
  constructor(props) {
    super(props)
    this.watchId = null
    this.state = {}
  }

  static propTypes = {
    latitude: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    longitude: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onChangeCallback: PropTypes.func.isRequired,
    WatchUserLocation: PropTypes.func.isRequired,
    SetUserLocation: PropTypes.func.isRequired
  }

  static defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33
    },
    zoom: 11
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let { UserLocation, latitude, longitude } = nextProps

    if (!(latitude || longitude)) {
      latitude = UserLocation.latitude
      longitude = UserLocation.longitude
    }

    return { UserLocation, latitude, longitude }
  }

  componentWillUnmount() {
    this.handleCancel()
  }

  handleClick = () => {
    const { WatchUserLocation } = this.props

    this.watchId = WatchUserLocation()
  }

  handleCancel = () => {
    const { WatchUserLocation, SetUserLocation } = this.props

    if (this.watchId) {
      WatchUserLocation(this.watchId)
    }

    SetUserLocation(null)
  }

  handleSave = () => {
    const { onChangeCallback } = this.props
    const { latitude, longitude } = this.state

    if (latitude && longitude) {
      GetAddress(latitude, longitude)
        .then(address => onChangeCallback({ latitude, longitude, address }))
        .catch(e => onChangeCallback({ latitude, longitude }))
    }
    this.handleCancel()
  }

  render() {
    const { xs, center, zoom, onChangeCallback } = this.props
    const { UserLocation, latitude, longitude } = this.state

    return (
      <ToolbarModal
        className="p-0"
        modalTitle="Add Location"
        onClickCallback={this.handleClick}
        onCancelCallback={this.handleCancel}
        onSaveCallback={this.handleSave}
        ButtonIcon="fas fa-map-marker-alt"
        buttonTitle="Add Location"
        xs={xs}
        saveDisabled={!UserLocation.latitude || !UserLocation.longitude}
      >
        <Container fluid className="LocationButtonModal p-0">
          <BasicMap
            renderUserLocation
            latitude={latitude}
            longitude={longitude}
            onChangeCallback={onChangeCallback}
          />
        </Container>
      </ToolbarModal>
    )
  }
}
export default reduxConnect(
  mapStateToProps,
  mapDispatchToProps
)(LocationButtonModal)
