import React, { createRef, PureComponent } from "react"
import PropTypes from "prop-types"
import { getRandomInt } from "../../utils"

class Canvas extends PureComponent {
  constructor(props) {
    super(props)
    this.canvasRef = createRef()
    this.state = {}
  }

  static propTypes = {
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    containerStyles: PropTypes.object,
  }

  static defaultProps = {
    height: 1000,
    width: 1500,
    background: "#111",
  }

  componentDidMount() {
    const canvas = this.canvasRef.current
    const context = canvas.getContext("2d")
    const stars = 600
    const colorrange = [0, 60, 240]
    for (var i = 0; i < stars; i++) {
      const x = Math.random() * canvas.offsetWidth
      const y = Math.random() * canvas.offsetHeight
      const radius = Math.random() * 1.2
      const hue = colorrange[getRandomInt(0, colorrange.length - 1)]
      const sat = getRandomInt(50, 100)
      context.beginPath()
      context.arc(x, y, radius, 0, 360)
      context.fillStyle = "hsl(" + hue + ", " + sat + "%, 88%)"
      context.fill()
    }

    // context.fillRect(1000, 1000, 1, 1)
    // const img = this.imageRef.current
    // img.onload = () => {
    //   ctx.drawImage(img, 0, 0)
    //   ctx.font = "40px Courier"
    //   ctx.fillText('HELLO WORLD', 210, 75)
    // }
  }

  render() {
    const { height, width, background } = this.props

    return (
      <div id="CanvasContainer">
        <canvas
          id="Canvas"
          ref={this.canvasRef}
          height={height}
          width={width}
        />
      </div>
    )
  }
}
export default Canvas
