const getFormPayload = elements => {
  let payload = {}

  for (let i = 0, { length } = elements; i < length; i++) {
    const { id, value, type, check } = elements[i]

    if (id) {
      payload[id] = value
    } else if (type === "radio") {
      payload[id] = check
    }
  }

  return payload
}

export { getFormPayload }
