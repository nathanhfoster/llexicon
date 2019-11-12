import { getRandomInt } from "../helpers"

class ArrayList {
  constructor({ ofNumbers, length }) {
    this.arrayList = new Array()
    if (ofNumbers) {
      this.arrayList = Array.from(new Array(length).keys())
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
    const randomValue = this.splice(randomIndex)[0]

    return randomValue
  }
}

export { ArrayList }
