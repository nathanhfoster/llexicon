import * as React from "react"
import rootReducer from "../containers"
import { deepParseJson } from "../utils"
import { useProviderReducer } from "./useProviderReducer"
import { PersistedStorageReduxKey } from "../../redux/localState"

const AppStateProvider = React.createContext({})

const ContextProvider = ({ children }) => {
  const persistedState = deepParseJson(
    localStorage.getItem(PersistedStorageReduxKey)
  )
  const contextValue = useProviderReducer(rootReducer, persistedState)

  return (
    <AppStateProvider.Provider value={contextValue}>
      {children}
    </AppStateProvider.Provider>
  )
}

export { ContextProvider, AppStateProvider as ContextConsumer }
