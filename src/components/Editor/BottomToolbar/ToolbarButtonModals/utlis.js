import { removeArrayDuplicates } from "../../../../helpers"

const REMOVE_SPECIAL_CHARACTERS_REGEX = /[!@#$%^&*().?":{}|<>]/gi
const REMOVE_SPECIAL_CHARACTERS_REPLACEMENT = ""

const validatedTagString = (s) =>
  s
    .replace(/[^A-Z0-9]+/gi, ",")
    .replace(
      REMOVE_SPECIAL_CHARACTERS_REGEX,
      REMOVE_SPECIAL_CHARACTERS_REPLACEMENT
    )

// https://regex101.com/
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions

const validatedPersonNameString = (s) =>
  s
    // remove begining whitespace
    .replace(/^[,\s]+/gi, "")
    // remove numbers
    .replace(/[0-9]/g, "")
    // only allow one space
    .replace(/\s{2,}/gi, " ")
    // only allow one comma
    .replace(/\,{2,}/gi, ",")
    // don't allow spaces after comma
    .replace(/\, +/gi, ",")
    // remove special characters
    .replace(
      REMOVE_SPECIAL_CHARACTERS_REGEX,
      REMOVE_SPECIAL_CHARACTERS_REPLACEMENT
    )

const validateTagOrPeopleString = (string) =>
  removeArrayDuplicates(string)
    .filter((string) => string)
    .map((name) => ({ name }))

export {
  validatedTagString,
  validatedPersonNameString,
  validateTagOrPeopleString,
}
