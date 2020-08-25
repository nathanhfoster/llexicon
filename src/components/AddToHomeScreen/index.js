import React, { useState, useEffect, useCallback, useMemo, memo } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "store/provider"
import { Container, Row, Col, Button } from "reactstrap"
import getBrowserIcon from "./getBrowserIcon"
import { BasicModal } from "../"

const mapStateToProps = ({
  Window: {
    isInStandalone,
    isOnMobileBrowser,
    navigator: { userAgent },
  },
}) => ({ isInStandalone, isOnMobileBrowser, userAgent })

const AddToHomeScreenModal = ({
  width,
  isInStandalone,
  isOnMobileBrowser,
  userAgent,
  prompt,
  promptToInstall,
}) => {
  const [isDisabled, setDisabledState] = useState(true)

  const styles = { width }

  const handlePromptInstall = useCallback(
    () => (!isDisabled ? promptToInstall() : null),
    [isDisabled]
  )

  useEffect(() => {
    if (prompt) {
      setDisabledState(false)
    }
  }, [prompt])

  const icon = getBrowserIcon(isOnMobileBrowser, userAgent)

  const button = useMemo(
    () => (
      <Button style={styles} color="success" onClick={handlePromptInstall}>
        {icon} Install
      </Button>
    ),
    [isDisabled, promptToInstall]
  )

  const body = useMemo(
    () => (
      <Container fluid>
        <Row>
          <Col tag="h3" xs={12} className="Center">
            <i className="fab fa-safari mr-1" />
            Safari
          </Col>
          <Col xs={12}>
            <iframe
              height="315px"
              width="100%"
              src="https://www.youtube.com/embed/bV8xE6lOdoY?modestbranding=1&rel=0&&showinfo=0&fs=0&showsearch=0&autoplay=0&ps=docs&controls=1"
              frameborder="0"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </Col>
        </Row>
      </Container>
    ),
    []
  )

  const saveButton = useMemo(
    () => (
      <Button className="mr-1" color="success">
        Ok
      </Button>
    ),
    []
  )

  return isInStandalone ? null : isDisabled ? (
    <BasicModal
      button={button}
      title="Install Astral Tree"
      onSaveCallback={handlePromptInstall}
      saveButton={saveButton}
      cancelButton={null}
    >
      {body}
    </BasicModal>
  ) : (
    button
  )
}

AddToHomeScreenModal.propTypes = {
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isInStandalone: PropTypes.bool,
  isOnMobileBrowser: PropTypes.bool,
  userAgent: PropTypes.string,
  prompt: PropTypes.func,
  promptToInstall: PropTypes.func,
}

AddToHomeScreenModal.defaultProps = {
  width: "auto",
}

export default memo(reduxConnect(mapStateToProps)(AddToHomeScreenModal))
