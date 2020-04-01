const getFormPayload = elements => {
  let payload = {}

  for (let i = 0, { length } = elements; i < length; i++) {
    const { id, value, type } = elements[i]
    if (value) {
      payload[id] = value
    } else if (type === "radio") {
      payload[id] = value
    }
  }

  return payload
}

export { getFormPayload }
