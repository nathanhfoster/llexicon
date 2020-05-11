import { connectRouter } from "connected-react-router"
import { createBrowserHistory } from "history"
const history = createBrowserHistory()

const DEFAULT_STATE_ROUTER = {
  location: {
    hash: "",
    key: "",
    pathname: "",
    search: "",
    state: { previousRoute: "", pathHistory: [] },
  },
  action: null,
  ...history,
}

const router = connectRouter(DEFAULT_STATE_ROUTER)

export { history, router }
