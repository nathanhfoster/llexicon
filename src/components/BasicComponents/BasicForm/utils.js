export const getInputValue = (
  input,
  { id, name, value, type, checked, files, multiple, options },
  isFieldSet = false,
) => {
  if (input.name === name) {
    if (type === 'radio' || type === 'checkbox' || type === 'switch') {
      return { ...input, checked }
    } else if ((type === 'select-one' || type === 'select-multiple') && options?.length > 0) {
      let stateOptions = []

      for (const { value, selected } of options) {
        stateOptions.push({ value, selected })
      }

      return { ...input, options: stateOptions }
    } else if (type === 'file') {
      return { ...input, files }
    } else {
      return { ...input, value }
    }
  } else if (isFieldSet && (type === 'radio' || type === 'checkbox' || type === 'switch')) {
    return { ...input, checked: false }
  }
  return input
}

export const getInputState = input => {
  const { id, name, value, type, checked, files, multiple, options } = input
  if (type === 'radio' || type === 'checkbox' || type === 'switch') {
    const { defaultChecked, ...restOfInput } = input
    return { ...restOfInput, checked: checked || defaultChecked }
  } else if ((type === 'select-one' || type === 'select-multiple') && options?.length > 0) {
    let stateOptions = []

    for (const { name, value, defaultValue, selected } of options) {
      stateOptions.push({
        name,
        value: value || name,
        selected: selected || defaultValue,
      })
    }

    return { ...input, options: stateOptions }
  } else if (type === 'file') {
    return { ...input, files }
  }

  return input
}

export const getState = inputs =>
  inputs.map(input => {
    if (Array.isArray(input)) {
      return input.map(e => getInputState(e))
    }
    return getInputState(input)
  })

export const getInputPayloadValue = (acc, { id, name, value, type, checked, files, options }) => {
  if (name) {
    if (type === 'radio' || type === 'checkbox') {
      acc[name] = checked
    } else if (type === 'select') {
      const selectedOptions = options?.filter(({ selected }) => selected)
      acc[name] = selectedOptions
    } else if (type === 'file') {
      acc[name] = files
    } else {
      acc[name] = value
    }
  }
  return acc
}
