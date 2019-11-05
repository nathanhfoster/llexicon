import React, { PureComponent, Fragment } from "react"
import PropTypes from "prop-types"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap"
import "./styles.css"

class ConfirmAction extends PureComponent {
  constructor(props) {
    super(props)

    this.state = { show: false }
  }

  static propTypes = {
    onClickCallback: PropTypes.func,
    title: PropTypes.string,
    icon: PropTypes.object
  }

  static defaultProps = { show: false, disabled: false }

  componentWillMount() {
    this.getState(this.props)
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    const { CloseOnReceiveProps } = nextProps
    if (CloseOnReceiveProps) this.setState({ show: false })
    this.getState(nextProps)
  }

  getState = props => {
    const { disabled, icon, title } = props
    this.setState({
      disabled,
      icon,
      title
    })
  }

  componentWillUnmount() {
    this.setState({ show: false })
  }

  handleConfirm = () => {
    const { onClickCallback } = this.props
    onClickCallback()
  }

  toggleShow = () =>
    this.setState(currentState => ({ show: !currentState.show }))

  render() {
    const { show, disabled, icon, title } = this.state
    return (
      <Fragment>
        <Button disabled={disabled} color="inherit" onClick={this.toggleShow}>
          {icon}
        </Button>
        <Modal isOpen={show} toggle={this.toggleShow} className="ConfirmActionModal">
          <ModalHeader toggle={this.toggleShow}>{title}</ModalHeader>
          <ModalBody>Are you sure you want to complete this action?</ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={this.handleConfirm}>
              Confirm
            </Button>{" "}
            <Button color="primary" onClick={this.toggleShow}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </Fragment>
    )
  }
}
export default ConfirmAction
