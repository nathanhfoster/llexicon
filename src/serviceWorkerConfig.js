import { AlertActionTypes } from "./redux/Alerts/types"
import { GetAppVersion } from "./redux/App/actions"
const config = (ReduxStore) => ({
  // onUpdate: (registration) => {
  //   registration.unregister().then(() => {
  //     window.location.reload()
  //   })
  // },
  onUpdate: (registration) => {
    const waitingServiceWorker = registration.waiting

    if (waitingServiceWorker) {
      waitingServiceWorker.addEventListener("statechange", (event) => {
        if (event.target.state === "activated") {
          if (ReduxStore) {
            ReduxStore.dispatch(GetAppVersion())
              .then(({ currentVersion, latestVersion }) => {
                const message =
                  currentVersion != latestVersion
                    ? `From version${currentVersion} to ${latestVersion}`
                    : `Version: ${latestVersion}`
                ReduxStore.dispatch({
                  type: AlertActionTypes.ALERTS_SET_MESSAGE,
                  payload: {
                    title: `Update Available`,
                    message,
                    serviceWorkerRegistration: registration,
                  },
                })
              })
              .catch((e) =>
                console.log(
                  "GetAppVersion failed in Service Worker Update: ",
                  e
                )
              )
          } else {
            alert("Update Available")
            window.location.reload()
          }
        }
      })
      waitingServiceWorker.postMessage({ type: "SKIP_WAITING" })
    }
  },
  onSuccess: (registration) => {
    console.info("Service worker on success state")
    console.log(registration)
  },
})

export default config
