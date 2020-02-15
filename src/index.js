import "./styles/index.css"
import "overlayscrollbars/css/OverlayScrollbars.css"
import React, { Suspense, lazy } from "react"
import ReactDOM from "react-dom"
import { LoadingScreen, NavBar, Footer } from "./components"
import storeFactory from "./redux"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import App from "./App"
import AlertNotifications from "./components/AlertNotifications"
import Persister from "./components/Persister"
import { getReduxState } from "./redux/Persister/actions"
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
        <Footer />
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
