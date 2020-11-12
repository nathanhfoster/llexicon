import { getStringBytes } from 'utils'
import { PersistedStorageReduxKey, isQuotaExceeded } from 'redux/localState'

const LOCAL_STORAGE_LIMIT = 10 * 1024 * 1024
const LOCAL_STORAGE_QOUTA_LIMIT_TEST = 'qoutaLimitTest'
const LOCAL_STORAGE_QOUTA_LIMIT_TEST_ITERATIONS = ~~(LOCAL_STORAGE_LIMIT / 100)

const getLocalStorageCapacity = () => {
  let i = 0
  let previousLocalStorage = ''
  try {
    for (
      i = LOCAL_STORAGE_QOUTA_LIMIT_TEST_ITERATIONS;
      i <= LOCAL_STORAGE_LIMIT;
      i += LOCAL_STORAGE_QOUTA_LIMIT_TEST_ITERATIONS
    ) {
      const currentLocalStorageTest = localStorage.getItem(LOCAL_STORAGE_QOUTA_LIMIT_TEST) || ''
      const currentReduxLocalStorage = localStorage.getItem(PersistedStorageReduxKey) || ''
      previousLocalStorage = currentLocalStorageTest.concat(currentReduxLocalStorage)
      localStorage.setItem(LOCAL_STORAGE_QOUTA_LIMIT_TEST, new Array(i).join('a'))
    }
  } catch (e) {
    if (isQuotaExceeded(e)) {
      const previousLocalStorageBytes = getStringBytes(previousLocalStorage)

      localStorage.removeItem(LOCAL_STORAGE_QOUTA_LIMIT_TEST)
      return previousLocalStorageBytes
    }
  }
}

export { getLocalStorageCapacity }
