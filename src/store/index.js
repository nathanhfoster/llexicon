import {
  connect,
  ContextProvider,
  ContextConsumer,
  useSelector,
  useDispatch,
  store,
} from "./provider"

const storeFactory = () => ({
  isReady: false,
  state: null,
  dispatch: () => {
    console.error("Store is NOT ready!")
  },
})

export {
  connect,
  ContextProvider,
  ContextConsumer,
  useSelector,
  useDispatch,
  store,
  storeFactory,
}
