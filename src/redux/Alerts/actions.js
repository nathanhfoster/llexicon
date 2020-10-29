import { AlertActionTypes } from "../Alerts/types"

const SetApiResponseStatus = (payload) => ({
  type: AlertActionTypes.ALERTS_SET_API_RESPONSE_STATUS,
  payload,
})

const SetAlert = (payload) => ({
  type: AlertActionTypes.ALERTS_SET_MESSAGE,
  payload,
})

const ClearAlerts = () => ({ type: AlertActionTypes.ALERTS_CLEAR })

const UpdateAppVersion = () => (dispatch, getState) => {
  const { serviceWorkerRegistration } = getState().Alerts
  dispatch(ClearAlerts())

  // navigator.serviceWorker.getRegistrations().then(function(registrations) {
  //   for(let registration of registrations) {
  //    registration.unregister()
  //  } })

  if (serviceWorkerRegistration?.waiting)
    serviceWorkerRegistration.waiting.postMessage({ type: "SKIP_WAITING" })
  setTimeout(() => {
    // const currentUrl = window.location.href
    // window.close()
    // window.open(currentUrl, "_blank")

    window.location.reload()
  }, 400)
}

export { SetApiResponseStatus, SetAlert, ClearAlerts, UpdateAppVersion }
