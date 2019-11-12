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

  getRandomValue = () => {
    const randomIndex = getRandomInt(0, this.arrayList.length - 1)
    const randomValue = this.arrayList[randomIndex]
    this.splice(randomIndex)
    return randomValue
  }
}

export { ArrayList }
