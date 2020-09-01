import { useContext as reactUseContext } from "react"
import connect from "./connect"
import { ContextProvider, ContextConsumer, store } from "./provider"

const useContext = (context = ContextConsumer) => reactUseContext(context)

// TODO dependencies
const useSelector = (mapState, dependencies) => {
  const { state } = useContext()
  const returnedState = mapState(state)

  return returnedState
}

const useDispatch = () => useContext().dispatch

export {
  connect,
  ContextProvider,
  ContextConsumer,
  useSelector,
  useDispatch,
  store,
  useContext,
}
