import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect as reduxConnect } from 'react-redux'
import { isAFunction , } from 'utils'
import { isQuotaExceeded } from 'redux/localState'
import localforage from 'localforage'

export const FORAGE_NAME = 'AstralTreeDB'

export const DATEBASE_SIZE = 5000 * 1024 * 1024 

export const AstralTreeDB = localforage.createInstance({
  driver: localforage.WEBSQL, // Force WebSQL; same as using setDriver()
  name: FORAGE_NAME,
  version: 1.0,
  size: DATEBASE_SIZE, // Size of database, in bytes. WebSQL-only for now.
  storeName: 'keyvaluepairs', // Should be alphanumeric, with underscores.
  description: 'Astral Tree local database',
})

const mapStateToProps = state => ({ state })

const Persistor = ({ persistKey, debounce, whenQuotaExceeds, state }) => {
  // persist storage if persistConfig exists
  useEffect(() => {
    if (persistKey) {
      const persistDebounce = setTimeout(() => {
        let stringifiedState = JSON.stringify(state)

        // Object.entries(state).forEach(([reducer, value]) => {
        //   try {
        //     AstralTreeDB.setItem(reducer, value)
        //   } catch (e) {
        //     console.log(e)
        //   }
        // })

        try {
          AstralTreeDB.setItem(persistKey, stringifiedState)
        } catch (e) {
          console.log(e)
        }
      }, debounce)

      return () => {
        clearTimeout(persistDebounce)
        // AstralTreeDB.clear()
      }
    }
  }, [state, persistKey])

  return null
}

Persistor.propTypes = {
  persistKey: PropTypes.string.isRequired,
  debounce: PropTypes.number.isRequired,
  whenQuotaExceeds: PropTypes.func,
  state: PropTypes.objectOf(PropTypes.object),
}

Persistor.defaultProps = { persistKey: FORAGE_NAME, debounce: 400 }

export default reduxConnect(mapStateToProps)(Persistor)
