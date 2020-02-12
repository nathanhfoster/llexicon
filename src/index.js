import "./styles/index.css"
import "overlayscrollbars/css/OverlayScrollbars.css"
import React, { Suspense, lazy } from "react"
import ReactDOM from "react-dom"
import LoadingScreen from "./components/LoadingScreen"
import NavBar from "./components/NavBar"
import storeFactory from "./store"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import AlertNotifications from "./store/AlertNotifications"
import Persister from "./store/Persister"
import { getReduxState } from "./store/Persister/persist"
import * as serviceWorker from "./serviceWorker"

const BackgroundImage = lazy(() => import("./components/BackgroundImage"))
const ReactRouter = lazy(() => import("./components/ReactRouter"))

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
        <NavBar />
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
