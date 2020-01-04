import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { Button } from "reactstrap"
import defaultStyles from "./defaultStyles"
import { CENTER_OF_US, DEFAULT_ZOOM } from "../../../constants"

class RecenterZoomButton extends PureComponent {
  constructor(props) {
    super(props)

    this.watchId = null

    this.state = {}
  }

  static propTypes = {}

  static defaultProps = {}

  componentWillUnmount() {
    const { WatchUserLocation } = this.props
    if (this.watchId) {
      this.watchId = WatchUserLocation(this.watchId)
    }
  }

  handleOnClick = ({
    panTo,
    UserLocation: { latitude, longitude },
    WatchUserLocation
  }) => {
    if (!this.watchId) {
      this.watchId = WatchUserLocation()
    }
    if (latitude && longitude) {
      panTo({
        center: { lat: latitude, lng: longitude },
        zoom: 16
      })
    }
  }

  render() {
    return (
      <Button color="white" style={{ ...defaultStyles, padding: 0 }}>
        <i
          className="fas fa-user-circle fa-2x"
          aria-label="myLocation"
          onClick={() => this.handleOnClick(this.props)}
        />
      </Button>
    )
  }
}
export default RecenterZoomButton
