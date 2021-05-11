import { isAFunction } from 'utils'
import actions from './actionTypes'

const DEFUALT_CASE_TEST = { action: { type: 'RETURNING_INITIAL_STATE' } }
/**
 * @typedef {Object} Test
 * @property {String} [name] - Optional name of the test
 * @property {Object|Function} state - The first parameter to passed into the reducer
 * @property {Object|Function} action - The second parameter to be passed into the reducer
 * @property {Object} [expectedState] - Optional expected output of  the reducer
 */

/**
 * Runs reducer tests and ensures 100% action type case coverage
 * @param {String} reducerName - Describes the name of the test group
 * @param {Function} reducer - The refernece to the reducer
 * @param {Object} initialState - The initialState exported by the reducer
 * @param {Array.<Test>} tests - List of test objects to be tested
 * @returns {void}
 */

export default (reducer, initialState, tests) => {
  // Make sure 100% action type case coverage
  const otherActionTypes = Object.values(actions)

  let testsCopy = tests.reduce(
    (acc, test) => {
      const { type } = test.action
      const actionTypeIndex = otherActionTypes.indexOf(type)
      // Remove action type if it is already being covered
      if (actionTypeIndex !== -1) {
        otherActionTypes.splice(actionTypeIndex, 1)
      }
      acc.push(test)
      return acc
    },
    // unshift reducer's default case
    [DEFUALT_CASE_TEST],
  )

  const actionTypeTestsNotCovered = otherActionTypes.map(type => ({
    name: `The ${type} action type should be covered in the tests because it is changing the state of the ${reducer.name}`,
    state: undefined,
    action: { type },
  }))

  testsCopy = testsCopy.concat(actionTypeTestsNotCovered)

  describe(reducer.name, () => {
    const runTest = ({ name, state, action, expectedState }, testNumber) => {
      const testNamePrefix = `Test ${testNumber}`
      return it(
        name
          ? `${testNamePrefix} ${name} reducer`
          : `${testNamePrefix} should handle ${action.type} action type`,
        () => {
          const resolvedAction = isAFunction(action) ? action(state) : action
          const returnedState = reducer(state, resolvedAction)

          // expectedState by default is initialState
          const resolvedExpectedState = isAFunction(expectedState)
            ? expectedState(state, resolvedAction)
            : expectedState || initialState

          expect(returnedState).toEqual(resolvedExpectedState)
        },
      )
    }

    testsCopy.forEach((test, i) => runTest(test, i))
  })
}
