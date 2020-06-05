import { WindowActionTypes } from "../Window/types"

const SetWindow = (payload) => ({
  type: WindowActionTypes.SET_WINDOW,
  payload,
})

export { SetWindow }
