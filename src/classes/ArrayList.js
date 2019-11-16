import { getRandomInt, getRandomFloat } from "../helpers"

class ArrayList {
  constructor({ ofNumbers, ofFloats, length }) {
    this.arrayList = new Array()
    if (ofNumbers) {
      this.arrayList = Array.from(new Array(length).keys())
    } else if (ofFloats) {
      for (let i = 0.01; i < length; i += 0.01) {
        this.arrayList.push(i)
      }
    }
  }

  splice = index => this.arrayList.splice(index, 1)

  push = element => this.arrayList.push(element)

  getRandomIndex = () => {
    const randomIndex = getRandomInt(0, this.arrayList.length - 1)
    return randomIndex
  }

  getRandomValue = () => {
    const randomIndex = this.getRandomIndex()
    const randomVale = this.arrayList[randomIndex]
    return randomVale
  }

  getRandomUniqueValue = () => {
    const randomIndex = this.getRandomIndex()
    const randomValue = this.splice(randomIndex)[0].toFixed(3)

    return randomValue
  }
}

export default ArrayList
