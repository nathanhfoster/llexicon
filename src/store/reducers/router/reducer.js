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

export { history }
