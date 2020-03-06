import "./styles/index.css"
import React, { Suspense, lazy } from "react"
import ReactDOM from "react-dom"
import App from "./App"
import storeFactory from "./redux"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { LoadingScreen } from "./components"
import { PersistGate } from "redux-persist/integration/react"
import * as serviceWorker from "./serviceWorker"
const { store, persistor } = storeFactory()

const AlertNotifications = lazy(() => import("./components/AlertNotifications"))
const BackgroundImage = lazy(() => import("./components/BackgroundImage"))

const { NODE_ENV } = process.env

// const initialState = getReduxState()
// const ReduxStore = storeFactory(initialState)

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Suspense fallback={<LoadingScreen />}>
        <AlertNotifications />
        <BrowserRouter>
          <BackgroundImage />
          <App />
        </BrowserRouter>
      </Suspense>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
)

if (NODE_ENV === "development") {
  serviceWorker.unregister()
} else {
  serviceWorker.register()
}
