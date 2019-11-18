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
import LogoImage from "../../ReactRouter/BackgroundImage/LogoImage"
import "./styles.css"
const { LOGIN, SIGNUP } = RouteMap

const mapStateToProps = ({}) => ({})

const mapDispatchToProps = { UserLogin, CreateUser }

class Login extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      location: { pathname }
    } = nextProps
    return { activeTab: pathname }
  }

  static propTypes = {
    UserLogin: PropTypes.func.isRequired,
    CreateUser: PropTypes.func.isRequired
  }

  static defaultProps = {}

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
                  <LogoImage center />
                  <BasicForm
                    title="Login"
                    onSubmit={payload => this.handleLogin(payload)}
                    submitLabel="Login"
                    inputs={[
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
        <TabContent activeTab={activeTab}>
          <TabPane tabId={SIGNUP}>
            <Row>
              <Col xs={12}>
                <Jumbotron className="LoginFormContainer">
                  <LogoImage center />
                  <BasicForm
                    title="Sign Up"
                    onSubmit={payload => this.handleSignUp(payload)}
                    submitLabel="Sign Up"
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
