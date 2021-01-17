import React, { useContext, useState, useRef, useEffect, useCallback, memo } from 'react'
import PropTypes from 'prop-types'
import { EditorConsumer } from '../'
import pretty from 'pretty'

const RawEditor = ({ style, placeholder, value }) => {
  const { handleEditorChange } = useContext(EditorConsumer)
  const [stateValue, setStateValue] = useState(pretty(value))
  const mounted = useRef(false)
/*
  useEffect(() => {
    if (mounted.current) {
      setStateValue(pretty(value))
    }
   mounted.current = true
  }, [value])
*/
  useEffect(() => {
    if (mounted.current) {
      const debounce = setTimeout(() => {
        handleEditorChange({ html: stateValue })
      }, 400)

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
      placeholder={placeholder}
      value={stateValue}
      onChange={handleEditorRawStateChange}
    />
  )
}

RawEditor.propTypes = {
  style: PropTypes.shape({ height: PropTypes.string }).isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
}

export default memo(RawEditor, (a, b) => a.style === b.style)
