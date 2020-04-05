import { removeArrayDuplicates } from "../../../../helpers"
const validatedString = s => {
  const validatedString = s.replace(/[^A-Z0-9]+/gi, " ")
  const filteredString = removeArrayDuplicates(validatedString.split(" ")).join(
    " "
  )
  return filteredString
}

export { validatedString }
