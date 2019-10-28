import React, { PureComponent } from "react"
import { connect as reduxConnect } from "react-redux"
import PropTypes from "prop-types"
import { Container, Row, Col } from "reactstrap"
import TextEditor from "../../components/TextEditor"
import { GetUserEntries } from "../../actions/Entries"
import "./styles.css"

const mapStateToProps = ({ User }) => ({ UserId: User.id })

const mapDispatchToProps = { GetUserEntries }

class Home extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {
    UserId: PropTypes.number,
    GetUserEntries: PropTypes.func.isRequired
  }

  static defaultProps = {
    LinkedInUrl: "https://www.linkedin.com/in/nathanhfoster/"
  }

  componentWillMount() {
    this.getState(this.props)
  }

  componentDidMount() {
    const { UserId, GetUserEntries } = this.props
    if (UserId) GetUserEntries()
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps)
  }

  getState = props => {
    this.setState({})
  }

  render() {
    return (
      <Container className="Home">
        <Row>
          <Col xs={12}>
            <TextEditor />
          </Col>
        </Row>
      </Container>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(Home)
