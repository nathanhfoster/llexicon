import actions from '../actionTypes'

export const SetApiResponseStatus = payload => ({
  type: actions.ALERTS_SET_API_RESPONSE_STATUS,
  payload,
})

export const SetAlert = payload => ({
  type: actions.ALERTS_SET_MESSAGE,
  payload,
})

export const ClearAlerts = () => ({ type: actions.ALERTS_CLEAR })

export const UpdateAppVersion = () => (dispatch, getState) => {
  const { serviceWorkerRegistration } = getState().Alerts
  dispatch(ClearAlerts())

  // navigator.serviceWorker.getRegistrations().then(function(registrations) {
  //   for(let registration of registrations) {
  //    registration.unregister()
  //  } })

  if (serviceWorkerRegistration?.waiting)
    serviceWorkerRegistration.waiting.postMessage({ type: 'SKIP_WAITING' })
  setTimeout(() => {
    // const currentUrl = window.location.href
    // window.close()
    // window.open(currentUrl, "_blank")

    window.location.reload()
  }, 400)
}
