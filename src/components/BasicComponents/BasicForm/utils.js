const getFormPayload = elements =>
  elements.reduce((payload, e) => {
    const { id, name, value, type, checked, files, options } = e

    if (name) {
      if (type === 'radio' || type === 'checkbox') {
        payload[name] = checked
      } else if (type === 'select') {
        const selectedOptions = options?.filter(({ selected }) => selected)
        payload[name] = selectedOptions?.length > 0 ? selectedOptions : undefined
      } else if (type === 'file') {
        payload[name] = files
      } else {
        payload[name] = value
      }
    }

    return payload
  }, {})

export { getFormPayload }
