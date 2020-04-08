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

const { NODE_ENV } = process.env

// const initialState = getReduxState()
// const ReduxStore = storeFactory(initialState)

ReactDOM.render(
  // <React.StrictMode>
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <Suspense fallback={<LoadingScreen />}>
        <AlertNotifications />
        <BrowserRouter>
          <App />
        </BrowserRouter>
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
