import React from 'react'
import App from './App'
import { render, screen, INITIAL_STATE } from 'redux/testUtils'

let props
let wrapper
describe('App', () => {
  beforeEach(() => {
    props = {}
    wrapper = render(<App {...props} />, { initialState: INITIAL_STATE })
  })

  it('should mount', () => {
    expect(wrapper).toBeDefined()
  })
})
