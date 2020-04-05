import { removeArrayDuplicates } from "../../../../helpers"
const validatedTagString = (s) => {
  const validatedTagString = s.replace(/[^A-Z0-9]+/gi, " ")
  const validatedTagStringSplit = validatedTagString.split(" ")
  const filteredString = removeArrayDuplicates(validatedTagStringSplit).join(
    " "
  )
  return filteredString
}

const validatedPeopleString = (splitPeopleAsString) => {
  const filteredString = removeArrayDuplicates(splitPeopleAsString)
    .filter((name) => name)
    .map((name) => ({ name }))
  return filteredString
}

export { validatedTagString, validatedPeopleString }
