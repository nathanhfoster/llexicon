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

    const { entry, UserLocation } = props
    this.state = { entry, UserLocation }
  }

  static propTypes = {
    entry: PropTypes.object.isRequired,
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
    let { entry, UserLocation } = nextProps

    if (!(entry.latitude || entry.longitude)) {
      entry.latitude = UserLocation.latitude
      entry.longitude = UserLocation.longitude
    }

    return { entry, UserLocation }
  }

  componentWillUnmount() {
    this.handleCancel()
  }

  handleClick = () => {
    const { WatchUserLocation } = this.props

    if (!this.watchId) {
      this.watchId = WatchUserLocation()
    }
  }

  handleSave = () => {
    const { onChangeCallback } = this.props
    const {
      entry: { address, latitude, longitude }
    } = this.state

    if (!address && latitude && longitude) {
      GetAddress(latitude, longitude)
        .then(address => onChangeCallback({ latitude, longitude, address }))
        .catch(e => onChangeCallback({ latitude, longitude }))
    }
    this.handleCancel()
  }

  handleCancel = () => {
    const { WatchUserLocation, SetUserLocation } = this.props

    if (this.watchId) {
      WatchUserLocation(this.watchId)
    }
  }

  render() {
    const { xs, center, zoom, onChangeCallback } = this.props
    const { entry, UserLocation } = this.state

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
            entry={entry}
            getAddressOnMarkerClick
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
