import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import storeFactory from "./store";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import LoadingScreen from "./components/LoadingScreen";
import * as serviceWorker from "./serviceWorker";
import { getState } from "./store/persist";

const initialState = getState();
const ReduxStore = storeFactory(initialState);

ReactDOM.render(
  <Provider store={ReduxStore}>
    <BrowserRouter>
      <Suspense fallback={<LoadingScreen />}>
        <App />
      </Suspense>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

serviceWorker.register();
