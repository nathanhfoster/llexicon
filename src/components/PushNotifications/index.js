import React from "react"
import usePushNotifications from "../../hooks/usePushNotifications"
import { Container, Row, Col, Button } from "reactstrap"

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
    <main>
      <Loading loading={loading} />

      <p>
        Push notification are {!pushNotificationSupported && "NOT"} supported by
        your device.
      </p>

      <p>
        User consent to recevie push notificaitons is{" "}
        <strong>{userConsent}</strong>.
      </p>

      <Error error={error} />

      <Button
        disabled={!pushNotificationSupported || isConsentGranted}
        onClick={onClickAskUserPermission}
      >
        {isConsentGranted ? "Consent granted" : " Ask user permission"}
      </Button>

      <Button
        disabled={
          !pushNotificationSupported || !isConsentGranted || userSubscription
        }
        onClick={onClickSusbribeToPushNotification}
      >
        {userSubscription
          ? "Push subscription created"
          : "Create Notification subscription"}
      </Button>

      <Button
        disabled={!userSubscription || pushServerSubscriptionId}
        onClick={onClickSendSubscriptionToPushServer}
      >
        {pushServerSubscriptionId
          ? "Subscrption sent to the server"
          : "Send subscription to push server"}
      </Button>

      {pushServerSubscriptionId && (
        <div>
          <p>The server accepted the push subscrption!</p>
          <Button onClick={onClickSendNotification}>Send a notification</Button>
        </div>
      )}

      <section>
        <h4>Your notification subscription details</h4>
        <pre>
          <code>{JSON.stringify(userSubscription, null, " ")}</code>
        </pre>
      </section>
    </main>
  )
}

export default PushNotifications
