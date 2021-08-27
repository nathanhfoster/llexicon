import localforage from 'localforage'
import * as memoryDriver from 'localforage-driver-memory'
/* global describe:true, expect:true, it:true, memoryDriver:true */
describe('When Custom Drivers are used', () => {
  'use strict'
  let errorMessage =
    'Custom driver not compliant; see https://mozilla.github.io/localForage/#definedriver'

  it('fails to define a no-name custom driver', done => {
    localforage.defineDriver(
      {
        _initStorage: jest.fn(),
        iterate: jest.fn(),
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
        length: jest.fn(),
        key: jest.fn(),
        keys: jest.fn(),
      },
      null,
      err => {
        expect(err).toMatchObject(
          Error(
            'Custom driver not compliant; see https://mozilla.github.io/localForage/#definedriver',
          ),
        )
        expect(err.message).toBe(errorMessage)
        done()
      },
    )
  })

  it('fails to define a no-name custom driver [promise]', done => {
    localforage
      .defineDriver({
        _initStorage: jest.fn(),
        iterate: jest.fn(),
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
        length: jest.fn(),
        key: jest.fn(),
        keys: jest.fn(),
      })
      .then(null, err => {
        expect(err).toMatchObject(
          Error(
            'Custom driver not compliant; see https://mozilla.github.io/localForage/#definedriver',
          ),
        )
        expect(err.message).toBe(errorMessage)
        done()
      })
  })

  it('fails to define a custom driver with missing methods', done => {
    localforage.defineDriver(
      {
        _driver: 'missingMethodsDriver',
        _initStorage: jest.fn(),
        iterate: jest.fn(),
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      null,
      err => {
        expect(err).toMatchObject(
          Error(
            'Custom driver not compliant; see https://mozilla.github.io/localForage/#definedriver',
          ),
        )
        expect(err.message).toBe(errorMessage)
        done()
      },
    )
  })

  it('fails to define a custom driver with missing methods [promise]', done => {
    localforage
      .defineDriver({
        _driver: 'missingMethodsDriver',
        _initStorage: jest.fn(),
        iterate: jest.fn(),
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      })
      .then(null, err => {
        expect(err).toMatchObject(
          Error(
            'Custom driver not compliant; see https://mozilla.github.io/localForage/#definedriver',
          ),
        )
        expect(err.message).toBe(errorMessage)
        done()
      })
  })

  it('defines a compliant custom driver', done => {
    localforage.defineDriver(memoryDriver, () => {
      done()
    })
  })

  it('defines a compliant custom driver [promise]', done => {
    localforage.defineDriver(memoryDriver).then(() => {
      done()
    })
  })

  it('sets a custom driver', done => {
    localforage.defineDriver(memoryDriver, () => {
      localforage.setDriver(memoryDriver._driver, () => {
        expect(localforage.driver()).toBe(memoryDriver._driver)
        done()
      })
    })
  })

  it('sets a custom driver [promise]', done => {
    localforage
      .defineDriver(memoryDriver)
      .then(() => localforage.setDriver(memoryDriver._driver))
      .then(() => {
        expect(localforage.driver()).toBe(memoryDriver._driver)
        done()
      })
  })

  it("defines a driver synchronously when it doesn't have _supports()", done => {
    let customDriver = {
      _driver: 'memoryDriver' + +new Date(),
      _initStorage: jest.fn(),
      // _support: jest.fn(),
      iterate: jest.fn(),
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      length: jest.fn(),
      key: jest.fn(),
      keys: jest.fn(),
    }

    localforage.defineDriver(customDriver)
    localforage.setDriver(customDriver._driver).then(() => {
      expect(localforage.driver()).toBe(customDriver._driver)
      done()
    })
  })

  it('defines a driver synchronously when it has boolean _supports()', done => {
    let customDriver = {
      _driver: 'memoryDriver' + +new Date(),
      _initStorage: jest.fn(),
      _support: true,
      iterate: jest.fn(),
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      length: jest.fn(),
      key: jest.fn(),
      keys: jest.fn(),
    }

    localforage.defineDriver(customDriver)
    localforage.setDriver(customDriver._driver).then(() => {
      expect(localforage.driver()).toBe(customDriver._driver)
      done()
    })
  })

  it('defines a driver asynchronously when _supports() returns a Promise<boolean>', done => {
    let customDriver = {
      _driver: 'memoryDriver' + +new Date(),
      _initStorage: jest.fn(),
      _support: () => Promise.resolve(true),
      iterate: jest.fn(),
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      length: jest.fn(),
      key: jest.fn(),
      keys: jest.fn(),
    }

    localforage
      .defineDriver(customDriver)
      .then(() => localforage.setDriver(customDriver._driver))
      .then(() => {
        expect(localforage.driver()).toBe(customDriver._driver)
        done()
      })
  })

  it('sets and uses a custom driver', done => {
    localforage.defineDriver(memoryDriver, () => {
      localforage.setDriver(memoryDriver._driver, err => {
        expect(err).toBe(undefined)
        localforage.setItem('testCallbackKey', 'testCallbackValue', err => {
          expect(err).toBe(null)
          localforage.getItem('testCallbackKey', (err, value) => {
            expect(err).toBe(null)
            expect(value).toBe('testCallbackValue')
            done()
          })
        })
      })
    })
  })

  it('sets and uses a custom driver [promise]', done => {
    localforage
      .defineDriver(memoryDriver)
      .then(() => localforage.setDriver(memoryDriver._driver))
      .then(() => localforage.setItem('testPromiseKey', 'testPromiseValue'))
      .then(() => localforage.getItem('testPromiseKey'))
      .then(value => {
        expect(value).toBe('testPromiseValue')
        done()
      })
  })

  describe('when dropInstance is not defined', () => {
    it('rejects when it is used', done => {
      let customDriver = {
        _driver: 'memoryDriver' + +new Date(),
        _initStorage: jest.fn(),
        _support: () => {
          return Promise.resolve(true)
        },
        iterate: jest.fn(),
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
        length: jest.fn(),
        key: jest.fn(),
        keys: jest.fn(),
      }

      localforage
        .defineDriver(customDriver)
        .then(() => {
          return localforage.setDriver(customDriver._driver)
        })
        .then(() => {
          return localforage.dropInstance()
        })
        .catch(err => {
          expect(err.message).toBe('Method dropInstance is not implemented by the current driver')
          done()
        })
    })
  })

  describe('when dropInstance is defined', () => {
    it('is does not reject', done => {
      let customDriver = {
        _driver: 'memoryDriver' + +new Date(),
        _initStorage: jest.fn(),
        _support: () => {
          return Promise.resolve(true)
        },
        iterate: jest.fn(),
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
        length: jest.fn(),
        key: jest.fn(),
        keys: jest.fn(),
        dropInstance: jest.fn(),
      }

      localforage
        .defineDriver(customDriver)
        .then(() => {
          return localforage.setDriver(customDriver._driver)
        })
        .then(() => {
          return localforage.dropInstance()
        })
        .then(() => {
          done()
        })
    })
  })
})
