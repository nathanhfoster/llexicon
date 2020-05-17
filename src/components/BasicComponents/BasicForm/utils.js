const getFormPayload = (elements) => {
  let payload = {}

  for (let i = 0, { length } = elements; i < length; i++) {
    const { id, name, value, type, check } = elements[i]

    if (name) {
      payload[name] = value
    } else if (type === "checkbox" || type === "radio") {
      payload[name] = check
    }
  }

  return payload
}

export { getFormPayload }
