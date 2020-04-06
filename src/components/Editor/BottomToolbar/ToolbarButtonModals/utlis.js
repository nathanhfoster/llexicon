import { removeArrayDuplicates } from "../../../../helpers"

const validatedTagString = (s) => {
  const validatedTagString = s.replace(/[^A-Z0-9]+/gi, " ")
  const validatedTagStringSplit = validatedTagString.split(" ")
  const filteredString = removeArrayDuplicates(validatedTagStringSplit).join(
    " "
  )
  return filteredString
}

const validateTagOrPeopleString = (string) =>
  removeArrayDuplicates(string)
    .filter((string) => string)
    .map((string) => ({ name: string.trim() }))

export { validatedTagString, validateTagOrPeopleString }
