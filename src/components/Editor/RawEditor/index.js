import React, { useContext, useState, useRef, useEffect, useCallback, memo } from 'react'
import PropTypes from 'prop-types'
import { EditorConsumer } from '../'
import pretty from 'pretty'

const RawEditor = ({ style, value }) => {
  const { handleEditorChange } = useContext(EditorConsumer)
  const [stateValue, setStateValue] = useState(pretty(value))
  const mounted = useRef(false)

  useEffect(() => {
    if (mounted.current) {
      setStateValue(pretty(value))
    }
  }, [value])

  useEffect(() => {
    if (mounted.current) {
      const debounce = setTimeout(() => {
        console.log('hacks')
        handleEditorChange({ html: stateValue })
      }, 250)

      return () => {
        clearTimeout(debounce)
      }
    }
    mounted.current = true
  }, [handleEditorChange, stateValue])

  const handleEditorRawStateChange = useCallback(({ target: { value } }) => {
    setStateValue(value)
  }, [])
  return (
    <textarea
      className='Editor raw-editor px-3 py-2'
      style={style}
      value={stateValue}
      onChange={handleEditorRawStateChange}
    />
  )
}

RawEditor.propTypes = {
  style: PropTypes.shape({ height: PropTypes.string }).isRequired,
  value: PropTypes.string.isRequired,
}

export default memo(RawEditor, (a, b) => a.style === b.style)
