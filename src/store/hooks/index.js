import { useContext as reactUseContext } from "react"
import { ContextConsumer } from "../provider"

const useContext = (context = ContextConsumer) => reactUseContext(context)

// TODO dependencies
const useSelector = (mapState, dependencies) => {
  const { state } = useContext()
  const returnedState = mapState(state)

  return returnedState
}

const useDispatch = () => useContext().dispatch

export {
  useSelector,
  useDispatch,
  useContext,
}
