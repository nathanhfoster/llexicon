import 'css/index.css'
import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom'
import storeFactory from './redux'
import { IndexDbKey } from 'redux/localState'
import { Persistor, LoadingScreen } from 'components'
import { AstralTreeDB } from 'components/Persistor'
import { history } from 'redux/router/reducer'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import * as serviceWorker from 'serviceWorker'
import { GetAppVersion } from 'redux/App/actions'
import { lazyDelay } from 'utils'
import prototypes from 'prototypes'

prototypes()

export const store = storeFactory()

const App = lazy(() =>
  import('./App').then(async result => {
    // for testing purposes
    if (document.getElementById('root')) {
      await AstralTreeDB.getItem(IndexDbKey)
    }
    return lazyDelay(0)(result)
  }),
)

ReactDOM.render(
  <Provider store={store}>
    <Suspense fallback={<LoadingScreen />}>
      <Persistor />
      <Router history={history}>
        <App />
      </Router>
    </Suspense>
  </Provider>,
  document.getElementById('root') || document.createElement('div'), // for testing purposes
)

store.dispatch(GetAppVersion())

serviceWorker.register(serviceWorker.serviceWorkerConfig(store))
