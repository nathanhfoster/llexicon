import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import {
  Container,
  Nav,
  NavItem,
  NavLink,
  TabPane,
  TabContent,
  Row,
  Col,
  Jumbotron
} from "reactstrap"
import { connect as reduxConnect } from "react-redux"
import { withRouter } from "react-router-dom"
import { RouterPush, RouterLinkPush, RouteMap } from "../../ReactRouter/Routes"
import BasicForm from "../../components/BasicForm"
import FacebookGoogleLogin from "../../components/FacebookGoogleLogin"
import { UserLogin, CreateUser } from "../../actions/User"
import "./styles.css"
const { LOGIN, SIGNUP } = RouteMap

const mapStateToProps = ({}) => ({})

const mapDispatchToProps = { UserLogin, CreateUser }

class Login extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {
    UserLogin: PropTypes.func.isRequired,
    CreateUser: PropTypes.func.isRequired
  }

  static defaultProps = {}

  componentWillMount() {
    this.getState(this.props)
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    const {
      location: { pathname }
    } = props

    this.setState({ activeTab: pathname })
  }

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  handleLogin = payload => {
    const { UserLogin } = this.props
    UserLogin(payload)
  }

  handleSignUp = payload => {
    const { CreateUser } = this.props
    CreateUser(payload)
  }

  render() {
    const { history } = this.props
    const { activeTab } = this.state
    return (
      <Container fluid className="Login">
        <Nav tabs>
          <NavItem>
            <NavLink
              className={`${activeTab === LOGIN ? "active" : ""}`}
              onClick={() => RouterPush(history, LOGIN)}
            >
              Login
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={`${activeTab === SIGNUP ? "active" : ""}`}
              onClick={() => RouterPush(history, SIGNUP)}
            >
              Sign Up
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab}>
          <TabPane tabId={LOGIN}>
            <Row>
              <Col xs={12}>
                <Jumbotron className="LoginFormContainer">
                  <BasicForm
                    title="Login"
                    onSubmit={payload => this.handleLogin(payload)}
                    submitLabel="Login"
                  />
                  <FacebookGoogleLogin />
                </Jumbotron>
              </Col>
            </Row>
          </TabPane>
        </TabContent>
        <TabContent activeTab={activeTab}>
          <TabPane tabId={SIGNUP}>
            <Row>
              <Col xs={12}>
                <Jumbotron className="LoginFormContainer">
                  <BasicForm
                    title="Sign Up"
                    onSubmit={payload => this.handleSignUp(payload)}
                    submitLabel="Sign Up"
                    inputs={[
                      {
                        label: "Email",
                        type: "email",
                        name: "email",
                        id: "email",
                        placeholder: "Email..."
                      },
                      {
                        label: "Username",
                        type: "text",
                        name: "username",
                        id: "username",
                        placeholder: "Username..."
                      },
                      {
                        label: "Password",
                        type: "password",
                        name: "password",
                        id: "password",
                        placeholder: "Password..."
                      }
                    ]}
                  />
                  <FacebookGoogleLogin />
                </Jumbotron>
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </Container>
    )
  }
}
export default withRouter(
  reduxConnect(mapStateToProps, mapDispatchToProps)(Login)
)
