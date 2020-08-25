import { useContext } from "react"
import connect from "./connect"
import { ContextProvider, ContextConsumer, store } from "./provider"

// TODO dependencies
const useSelector = (mapState, dependencies) => {
  const { state } = useContext(ContextConsumer)
  const returnedState = mapState(state)

  return returnedState
}

const useDispatch = () => useContext(ContextConsumer).dispatch

export {
  connect,
  ContextProvider,
  ContextConsumer,
  useSelector,
  useDispatch,
  store,
}
