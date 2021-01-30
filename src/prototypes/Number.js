const NumberPrototypes = () => {
  Number.prototype.toFixedNumber = function (digits, base) {
    const pow = Math.pow(base || 10, digits)
    const fixedNumber = Math.round(this * pow) / pow
    return fixedNumber
  }
}
export default NumberPrototypes
