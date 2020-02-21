import "./styles/index.css"
import React, { Suspense, lazy } from "react"
import ReactDOM from "react-dom"
import { LoadingScreen, NavBar } from "./components"
import App from "./App"
import storeFactory from "./redux"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { getReduxState } from "./redux/Persister/actions"
import * as serviceWorker from "./serviceWorker"

const AlertNotifications = lazy(() => import("./components/AlertNotifications"))
const Persister = lazy(() => import("./components/Persister"))
const BackgroundImage = lazy(() => import("./components/BackgroundImage"))

const { NODE_ENV } = process.env

const initialState = getReduxState()
const ReduxStore = storeFactory(initialState)

ReactDOM.render(
  <Provider store={ReduxStore}>
    <Suspense fallback={<LoadingScreen />}>
      <Persister />
      <AlertNotifications />
      <BrowserRouter>
        <BackgroundImage />
        <NavBar />
        <App />
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
