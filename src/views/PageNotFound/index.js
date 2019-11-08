import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { Media } from "reactstrap"
import { nebulus } from "../../images/AWS"
import "./styles.css"

const mapStateToProps = ({}) => ({})

const mapDispatchToProps = {}

class PageNotFound extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {}

  static defaultProps = { title: "Page Not Found" }

  componentWillMount() {
    this.getState(this.props)
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const { title } = props
    this.setState({ title })
  }

  render() {
    const { title } = this.state
    return (
      <body className="bg-purple">
        <div className="stars">
          <div className="custom-navbar">
            <div className="brand-logo">
              <img
                src="https://astraltree.s3.us-east-2.amazonaws.com/media/Logo.png"
                width="80px"
              />
            </div>
          </div>
          <div className="central-body">
            <img
              className="image-404"
              src="http://salehriaz.com/404Page/img/404.svg"
              width="300px"
            />
            <a
              href="/home"
              className="btn-go-home"
            >
              GO BACK HOME
            </a>
          </div>
          <div className="objects">
            <img
              className="object_rocket"
              src="http://salehriaz.com/404Page/img/rocket.svg"
              width="40px"
            />
            <div className="earth-moon">
              <img
                className="object_earth"
                src="http://salehriaz.com/404Page/img/earth.svg"
                width="100px"
              />
              <img
                className="object_moon"
                src="http://salehriaz.com/404Page/img/moon.svg"
                width="80px"
              />
            </div>
            <div className="box_astronaut">
              <img
                className="object_astronaut"
                src="http://salehriaz.com/404Page/img/astronaut.svg"
                width="140px"
              />
            </div>
          </div>
          <div className="glowing_stars">
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
            <div className="star"></div>
          </div>
        </div>
      </body>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(PageNotFound)
