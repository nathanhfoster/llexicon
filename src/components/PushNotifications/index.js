import React from "react"
import usePushNotifications from "../../hooks/usePushNotifications"
import { Container, Row, Col, ButtonGroup, Button } from "reactstrap"

const Loading = ({ loading }) =>
  loading ? (
    <div className="app-loader">Please wait, we are loading something...</div>
  ) : null
const Error = ({ error }) =>
  error ? (
    <section className="app-error">
      <h2>{error.name}</h2>
      <p>Error message : {error.message}</p>
      <p>Error code : {error.code}</p>
    </section>
  ) : null

const PushNotifications = () => {
  const {
    userConsent,
    pushNotificationSupported,
    userSubscription,
    onClickAskUserPermission,
    onClickSusbribeToPushNotification,
    onClickSendSubscriptionToPushServer,
    pushServerSubscriptionId,
    onClickSendNotification,
    error,
    loading,
  } = usePushNotifications()

  const isConsentGranted = userConsent === "granted"

  return (
    <Container fluid className="PushNotifications Container">
      <Row className="mb-3">
        <Col xs={12}>
          <Loading loading={loading} />
        </Col>
        <Col xs={12}>
          <p>
            Push notification are {!pushNotificationSupported && "NOT"}{" "}
            supported by your device.
          </p>
          <p>
            User consent to recevie push notificaitons is{" "}
            <strong>{userConsent}</strong>.
          </p>
        </Col>
        <Col xs={12}>
          <Error error={error} />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col tag={ButtonGroup} xs={12}>
          <Button
            color="accent"
            disabled={!pushNotificationSupported || isConsentGranted}
            onClick={onClickAskUserPermission}
          >
            {isConsentGranted ? "Consent granted" : " Ask user permission"}
          </Button>

          <Button
            color="accent"
            disabled={
              !pushNotificationSupported ||
              !isConsentGranted ||
              userSubscription
            }
            onClick={onClickSusbribeToPushNotification}
          >
            {userSubscription
              ? "Push subscription created"
              : "Create Notification subscription"}
          </Button>

          <Button
            color="accent"
            disabled={!userSubscription || pushServerSubscriptionId}
            onClick={onClickSendSubscriptionToPushServer}
          >
            {pushServerSubscriptionId
              ? "Subscrption sent to the server"
              : "Send subscription to push server"}
          </Button>
        </Col>
      </Row>

      {pushServerSubscriptionId && (
        <Row>
          <Col xs={12}>
            <p>The server accepted the push subscrption!</p>
            <Button color="accent" onClick={onClickSendNotification}>
              Send a notification
            </Button>
          </Col>
        </Row>
      )}
      <Row tag="section" className="my-3">
        <Col xs={12}>
          <h4>Your notification subscription details</h4>
          <pre>
            <code style={{ color: "white" }}>
              {JSON.stringify(userSubscription, null, " ")}
            </code>
          </pre>
        </Col>
      </Row>
    </Container>
  )
}

export default PushNotifications
