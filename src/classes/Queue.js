class Queue {
  constructor(list = []) {
    this.queue = []

    for (let i = 0; i < list.length; i++) {
      this.enqueue(list[i])
    }
  }

  getLength = () => this.queue.length

  isEmpty = () => this.queue.length === 0

  enqueue = item => {
    this.queue.push(item)
  }

  dequeue = () => this.queue.slice(0)

  peek = () => this.queue[0]
}

export default Queue
