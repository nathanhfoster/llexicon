import { useState } from "react"

const useInput = (defaultValue) => {
  const [value, setValue] = useState(defaultValue)

  const onChange = ({ target: { value: inputValue } }) => setValue(inputValue)

  return { value, setValue, onChange }
}

export default useInput
