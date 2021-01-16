import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { isAFunction } from 'utils'
import { isQuotaExceeded } from 'redux/localState'
import localforage from 'localforage'
import { LoadReducerStatePending, LoadReducerState, SetLocalStorageUsage } from 'redux/App/actions'
import { IndexDbKey, PersistedStorageReduxKey } from 'redux/localState'
import { usePreviousValue } from 'hooks'

export const LOCAL_STORAGE_REDUCERS = [
  // 'Admin',
  // 'Alerts',
  'App',
  // 'Calendar',
  // 'Entries',
  // 'Map',
  'User',
  // 'TextEditor',
  'Window',
]

export const INDEX_DB_REDUCERS = [
  'Admin',
  'Alerts',
  // 'App',
  'Calendar',
  'Entries',
  'Map',
  // 'User',
  'TextEditor',
  // 'Window',
]

export const DATEBASE_SIZE = 5000 * 1024 * 1024

export const AstralTreeDB = localforage.createInstance({
  driver: localforage.WEBSQL, // Force WebSQL; same as using setDriver()
  name: IndexDbKey,
  version: 1.0,
  size: DATEBASE_SIZE, // Size of database, in bytes. WebSQL-only for now.
  storeName: 'keyvaluepairs', // Should be alphanumeric, with underscores.
  description: 'Astral Tree local database',
})

const mapStateToProps = state => ({ state })

const mapDispatchToProps = { LoadReducerStatePending, LoadReducerState, SetLocalStorageUsage }

const Persistor = ({
  debounce,
  whenQuotaExceeds,
  state,
  LoadReducerStatePending,
  LoadReducerState,
  SetLocalStorageUsage,
}) => {
  // console.log(state.Entries.items)
  const prevState = usePreviousValue(state)

  useEffect(() => {
    ;(async () => {
      LoadReducerStatePending()
      const persistedSate = await AstralTreeDB.getItem(IndexDbKey).then(s => JSON.parse(s))
      await LoadReducerState(persistedSate)
      SetLocalStorageUsage()
    })()
  }, [])

  useEffect(() => {
    const persistDebounce = setTimeout(() => {
      const localStoragePayload = stateToReduce =>
        LOCAL_STORAGE_REDUCERS.reduce((acc, reducer) => {
          acc[reducer] = stateToReduce[reducer]
          return acc
        }, {})

      try {
        localStorage.setItem(PersistedStorageReduxKey, JSON.stringify(localStoragePayload(state)))
      } catch (e) {
        if (isQuotaExceeded(e) && isAFunction(whenQuotaExceeds)) {
          localStorage.setItem(
            PersistedStorageReduxKey,
            JSON.stringify(whenQuotaExceeds(prevState)),
          )
        }
      }

      const indexDBPayload = stateToReduce =>
        INDEX_DB_REDUCERS.reduce((acc, reducer) => {
          acc[reducer] = stateToReduce[reducer]
          return acc
        }, {})

      try {
        AstralTreeDB.setItem(IndexDbKey, JSON.stringify(indexDBPayload(state)))
      } catch (e) {
        console.log(e)
      }
    }, debounce)

    return () => {
      clearTimeout(persistDebounce)
      // AstralTreeDB.clear()
    }
  }, [state, prevState, debounce, whenQuotaExceeds])

  return null
}

Persistor.propTypes = {
  debounce: PropTypes.number.isRequired,
  whenQuotaExceeds: PropTypes.func,
  state: PropTypes.objectOf(PropTypes.object),

  LoadReducerStatePending: PropTypes.func.isRequired,
  LoadReducerState: PropTypes.func.isRequired,
  SetLocalStorageUsage: PropTypes.func.isRequired,
}

Persistor.defaultProps = { debounce: 400 }

export default connect(mapStateToProps, mapDispatchToProps)(Persistor)
