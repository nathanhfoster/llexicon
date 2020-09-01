import { useEffect } from "react"
import { connect } from ".."
import { isQuotaExceeded, isAFunction } from "../utils"

const mapStateToProps = (state) => ({ state })

const Persistor = ({ persistKey, debounce = 400, whenQuotaExceeds, state }) => {
  // persist storage if persistConfig exists
  useEffect(() => {
    if (persistKey) {
      // const filteredState = Object.keys(state).reduce((newState, key) => {
      //     if (
      //         (blackList?.length > 0 && blackList.includes(key)) ||
      //         (whiteList?.length > 0 && !whiteList.includes(key))
      //     ) {
      //         delete newState[key];
      //     }
      //     return newState;
      // }, state);

      const persistDebounce = setTimeout(() => {
        let stringifiedState = JSON.stringify(state)
        try {
          localStorage.setItem(persistKey, stringifiedState)
        } catch (e) {
          if (isQuotaExceeded(e) && isAFunction(whenQuotaExceeds)) {
            localStorage.setItem(
              persistKey,
              JSON.stringify(whenQuotaExceeds(state))
            )
          }
        }
      }, debounce)

      return () => {
        clearTimeout(persistDebounce)
      }
    }
  }, [state, persistKey])

  return null
}

export default connect(mapStateToProps)(Persistor)
