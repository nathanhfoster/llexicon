import React, { Fragment, useState, useEffect, memo } from "react"
import PropTypes from "prop-types"
import { Button } from "reactstrap"
import BasicModal from "../BasicModal"
import "./styles.css"

const ConfirmAction = ({
  onClickCallback,
  className,
  disabled,
  icon,
  title
}) => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    return () => {
      setShow(false)
    }
  }, [])

  const toggleShow = () => setShow(!show)

  return (
    <BasicModal
      show={show}
      button={
        <Button
          disabled={disabled}
          color="inherit"
          onClick={toggleShow}
          className={className}
        >
          {icon}
          {title}
        </Button>
      }
      title={title}
      footer={
        <Fragment>
          <Button color="danger" onClick={onClickCallback}>
            Confirm
          </Button>{" "}
          <Button color="primary" onClick={toggleShow}>
            Cancel
          </Button>
        </Fragment>
      }
    >
      <span className="Center">
        Are you sure you want to complete this action?
      </span>
    </BasicModal>
  )
}

ConfirmAction.propTypes = {
  onClickCallback: PropTypes.func.isRequired,
  title: PropTypes.string,
  icon: PropTypes.object,

  className: PropTypes.string
}

ConfirmAction.defaultProps = {
  show: false,
  disabled: false,
  icon: <i className="fas fa-trash mr-1" />
}

export default memo(ConfirmAction)
