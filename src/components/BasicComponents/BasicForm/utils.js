const getFormPayload = (elements) => {
  let payload = {}

  for (let i = 0, { length } = elements; i < length; i++) {
    const { id, name, value, type, checked, files } = elements[i]

    if (name) {
      if (type === "radio" || type === "checkbox") {
        payload[name] = checked
      } else if (type === "file") {
        payload[name] = files
      } else {
        payload[name] = value
      }
    }
  }

  return payload
}

export { getFormPayload }
