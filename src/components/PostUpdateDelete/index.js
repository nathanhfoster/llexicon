import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { ButtonGroup, Button } from "reactstrap"
import "./styles.css"

class PostUpdateDelete extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {
    postCallback: PropTypes.func,
    updateCallback: PropTypes.func
  }

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

  render() {
    const { postCallback, updateCallback } = this.props
    return (
      <ButtonGroup size="lg" className="PostUpdateDelete">
        {postCallback && (
          <Button color="primary" onClick={postCallback}>
            Post
          </Button>
        )}
        {updateCallback && (
          <Button color="primary" onClick={updateCallback}>
            Update
          </Button>
        )}
      </ButtonGroup>
    )
  }
}
export default PostUpdateDelete
