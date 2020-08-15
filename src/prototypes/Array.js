import { getRandomInt } from "../utils"

const ArrayPrototypes = () => {
  Array.prototype.getRandomIndex = function () {
    if (this.length === 0) {
      return 0
    } else {
      const randomIndex = getRandomInt(0, this.length - 1)
      return randomIndex
    }
  }

  Array.prototype.getRandomValue = function () {
    const randomIndex = this.getRandomIndex()
    const randomVale = this[randomIndex]
    return randomVale
  }

  Array.prototype.popRandomValue = function () {
    const randomIndex = this.getRandomIndex()
    const [randomValue] = this.splice(randomIndex, 1)

    return randomValue
  }

  Array.prototype.max = function (key) {
    return key
      ? this.reduce((max, e) => {
          const value = e[key]
          return value > max ? value : max
        }, -Infinity)
      : Math.max.apply(Math, this)
  }
}

export default ArrayPrototypes
