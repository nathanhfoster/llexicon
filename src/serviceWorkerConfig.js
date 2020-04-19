import { AlertActionTypes } from "./redux/Alerts/types"

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
            ReduxStore.dispatch({
              type: AlertActionTypes.ALERTS_SET_MESSAGE,
              payload: {
                title: `Update Available`,
                message: `There is an update for your service worker!`,
              },
            })
          } else {
            alert("Update Available")
            window.location.reload()
          }
        }
      })
      // Test
      waitingServiceWorker.postMessage({ type: "SKIP_WAITING" })
    }
  },
  onSuccess: (registration) => {
    console.info("Service worker on success state")
    console.log(registration)
  },
})

export default config
