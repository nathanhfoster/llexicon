import "overlayscrollbars/css/OverlayScrollbars.css"
import "./styles/index.css"
import React, { Suspense, lazy } from "react"
import ReactDOM from "react-dom"
import LoadingScreen from "./components/LoadingScreen"
import storeFactory from "./store"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import AlertNotifications from "./store/AlertNotifications"
import BackgroundImage from ".//components/BackgroundImage"
import Persister from "./store/Persister"
import { getReduxState } from "./store/Persister/persist"
import * as serviceWorker from "./serviceWorker"
const ReactRouter = lazy(() => import("./ReactRouter"))

const { NODE_ENV } = process.env

const initialState = getReduxState()
const ReduxStore = storeFactory(initialState)

ReactDOM.render(
  <Provider store={ReduxStore}>
    <Suspense fallback={<LoadingScreen />}>
      <Persister />
      <AlertNotifications />
      <App />
      <BrowserRouter>
        <BackgroundImage />
        <ReactRouter />
      </BrowserRouter>
    </Suspense>
  </Provider>,
  document.getElementById("root")
)

if (NODE_ENV === "development") {
  serviceWorker.unregister()
} else {
  serviceWorker.register()
}
