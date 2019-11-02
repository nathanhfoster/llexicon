import React, { Suspense, lazy } from "react"
import ReactDOM from "react-dom"
import storeFactory from "./store"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import LoadingScreen from "./components/LoadingScreen"
import App from "./App"
import Persister from "./store/Persister"
import { getState } from "./store/Persister/persist"
import * as serviceWorker from "./serviceWorker"

const { NODE_ENV } = process.env

const initialState = getState()
const ReduxStore = storeFactory(initialState)

ReactDOM.render(
  <Provider store={ReduxStore}>
    <Persister />
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <App />
      </Suspense>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
)

if (NODE_ENV === "development") {
  serviceWorker.unregister()
} else {
  serviceWorker.register()
}
