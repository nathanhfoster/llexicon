import 'css/index.css'
import React, { lazy, Suspense } from 'react'
import ReactDOM from 'react-dom'
import storeFactory from './redux'
import { IndexDbKey } from 'redux/localState'
import { Persistor } from 'components'
import { AstralTreeDB } from 'components/Persistor'
import { history } from 'redux/router/reducer'
import { LoadingScreen } from 'components'
import { getUserClientId } from 'redux/localState'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import * as serviceWorker from 'serviceWorker'
import { GetAppVersion } from 'redux/App/actions'
import { lazyDelay } from 'utils'
import ReactGA from 'react-ga'
import prototypes from 'prototypes'

prototypes()

export const store = storeFactory()

const { REACT_APP_GOOGLE_TRACKING_ID } = process.env

const { userId, version, appVersion, userIdUsernameEmail } = getUserClientId()

const App = lazy(() =>
  import('./App').then(async result => {
    await AstralTreeDB.getItem(IndexDbKey)
    return lazyDelay(0)(result)
  }),
)

ReactGA.initialize(REACT_APP_GOOGLE_TRACKING_ID, {
  // debug: inDevelopmentMode,
  // titleCase: false,
  // dimension14: "userIdUsernameEmail",
  gaOptions: {
    userId,
    version,
    appVersion,
    userIdUsernameEmail,
  },
})
// Initialize google analytics page view tracking
history.listen(location => {
  const { userId, version, appVersion, userIdUsernameEmail } = getUserClientId()
  const page = location.pathname

  // ReactGA.set({ dimension1: "test" })
  // ReactGA.pageview(page, { dimension1: "test" }) // Record a pageview for the given page

  ReactGA.set({ userId, version, appVersion, userIdUsernameEmail, page }) // Update the user's current page
  ReactGA.pageview(page) // Record a pageview for the given page
})

// ReactGA.ga((tracker) => {

//   ReactGA.set({ dimension1: profileId });

//   ReactGA.pageview(pageName, { dimension1: profileId });
// })

ReactDOM.render(
  <Provider store={store}>
    <Suspense fallback={<LoadingScreen />}>
      <Persistor />
      <Router history={history}>
        <App />
      </Router>
    </Suspense>
  </Provider>,
  document.getElementById('root'),
)

store.dispatch(GetAppVersion())

serviceWorker.register(serviceWorker.serviceWorkerConfig(store))
