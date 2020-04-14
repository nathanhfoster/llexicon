import "./styles/index.css"
import React, { Suspense, lazy } from "react"
import ReactDOM from "react-dom"
import App from "./App"
import storeFactory from "./redux"
import { Provider } from "react-redux"
import { BrowserRouter, Router } from "react-router-dom"
import { createBrowserHistory } from "history"
import { LoadingScreen } from "./components"
import { PersistGate } from "redux-persist/integration/react"
import * as serviceWorker from "./serviceWorker"
import ReactGA from "react-ga"

const { store, persistor } = storeFactory()

const history = createBrowserHistory()

const AlertNotifications = lazy(() => import("./components/AlertNotifications"))

const { NODE_ENV, REACT_APP_GOOGLE_TRACKING_ID } = process.env

ReactGA.initialize(REACT_APP_GOOGLE_TRACKING_ID)
// Initialize google analytics page view tracking
history.listen((location) => {
  const { id } = store.getState().User
  ReactGA.set({ userId: id, page: location.pathname }) // Update the user's current page
  ReactGA.pageview(location.pathname) // Record a pageview for the given page
})

// const initialState = getReduxState()
// const ReduxStore = storeFactory(initialState)

ReactDOM.render(
  // <React.StrictMode>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Suspense fallback={<LoadingScreen />}>
        <AlertNotifications />
        <Router history={history}>
          <App />
        </Router>
      </Suspense>
    </PersistGate>
  </Provider>,
  // </React.StrictMode>,
  document.getElementById("root")
)

if (NODE_ENV === "development") {
  serviceWorker.unregister()
} else {
  serviceWorker.register()
}
