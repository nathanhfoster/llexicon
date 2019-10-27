import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { Container, Row, Col, Jumbotron } from "reactstrap"
import { connect as reduxConnect } from "react-redux"
import { withRouter } from "react-router-dom"
import { RouterPush, RouterLinkPush } from "../../helpers/routing"
import BasicForm from "../../components/BasicForm"
import FacebookGoogleLogin from "../../components/FacebookGoogleLogin"
import { UserLogin } from "../../actions/User"
import "./styles.css"

const mapStateToProps = ({}) => ({})

const mapDispatchToProps = { UserLogin }

class Login extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = { UserLogin: PropTypes.func.isRequired }

  static defaultProps = {}

  componentWillMount() {
    this.getState(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    this.setState({})
  }

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  handleOnSubmit = payload => {
    const { UserLogin } = this.props
    UserLogin(payload)
  }

  render() {
    return (
      <Container fluid className="Login">
        <Jumbotron className="LoginFormContainer">
          <BasicForm
            onSubmit={payload => this.handleOnSubmit(payload)}
            submitLabel="Login"
          />
          <FacebookGoogleLogin />
        </Jumbotron>
      </Container>
    )
  }
}
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(Login)
)
