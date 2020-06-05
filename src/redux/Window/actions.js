import { WindowActionTypes } from "./types"

const SetWindow = (payload) => ({
  type: WindowActionTypes.SET_WINDOW,
  payload,
})

export { SetWindow }
