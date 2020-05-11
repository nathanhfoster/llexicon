import { connectRouter } from "connected-react-router"
import { createBrowserHistory } from "history"

const history = createBrowserHistory()
const router = connectRouter(history)

export { history, router }
