import * as React from "react"

import { deepParseJson } from "../utils"
import { useProviderReducer } from "./useProviderReducer"
import { PersistedStorageReduxKey } from "../../redux/localState"

const AppStateProvider = React.createContext({})

const ContextProvider = ({
  rootReducer,
  initialState,
  initializer,
  children,
}) => {
  // const persistedState = deepParseJson(
  //   localStorage.getItem(PersistedStorageReduxKey)
  // )

  const contextValue = useProviderReducer(
    rootReducer,
    initialState,
    initializer
  )

  return (
    <AppStateProvider.Provider value={contextValue}>
      {children}
    </AppStateProvider.Provider>
  )
}

export { ContextProvider, AppStateProvider as ContextConsumer }
