import "./css/index.css"
import React, { Suspense, lazy } from "react"
import ReactDOM from "react-dom"
import App from "./App"
import { Reducers } from "./redux/RootReducer"
import { ContextProvider, store } from "./store/provider"
import { history } from "./redux/router/reducer"
import { getUserClientId, PersistedStorageReduxKey } from "./redux/localState"
import { Router as ConnectedRouter } from "react-router-dom"
import { deepParseJson, getRandomInt } from "./utils"
import { LoadingScreen } from "./components"
import * as serviceWorker from "./serviceWorker"
import { GetAppVersion } from "./redux/App/actions"
import ReactGA from "react-ga"
import prototypes from "./prototypes"
prototypes()

const persistedState = deepParseJson(
  localStorage.getItem(PersistedStorageReduxKey)
)

const { NODE_ENV, REACT_APP_GOOGLE_TRACKING_ID } = process.env

const inDevelopmentMode = NODE_ENV === "development"

const { userId, version, appVersion, userIdUsernameEmail } = getUserClientId()

ReactGA.initialize(REACT_APP_GOOGLE_TRACKING_ID, {
  // debug: inDevelopmentMode,
  // titleCase: false,
  // dimension14: "userIdUsernameEmail",
  gaOptions: {
    userId,
    version,
    appVersion,
    userIdUsernameEmail,
  },
})
// Initialize google analytics page view tracking
history.listen((location) => {
  const { userId, version, appVersion, userIdUsernameEmail } = getUserClientId()
  const page = location.pathname

  // ReactGA.set({ dimension1: "test" })
  // ReactGA.pageview(page, { dimension1: "test" }) // Record a pageview for the given page

  ReactGA.set({ userId, version, appVersion, userIdUsernameEmail, page }) // Update the user's current page
  ReactGA.pageview(page) // Record a pageview for the given page
})

// ReactGA.ga((tracker) => {

//   ReactGA.set({ dimension1: profileId });

//   ReactGA.pageview(pageName, { dimension1: profileId });
// })

// const initialState = getReduxState()
// const ReduxStore = storeFactory(initialState)

ReactDOM.render(
  <ContextProvider
    rootReducer={Reducers}
    persistKey={PersistedStorageReduxKey}
    initialState={persistedState}
  >
    <Suspense fallback={<LoadingScreen />}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Suspense>
  </ContextProvider>,
  document.getElementById("root")
)

// Doesn't get called in development since there is no service worker
inDevelopmentMode && store.isReady && store.dispatch(GetAppVersion())

serviceWorker.register(serviceWorker.serviceWorkerConfig(store))
