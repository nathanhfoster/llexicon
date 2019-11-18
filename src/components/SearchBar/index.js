import React, { Component } from "react"
import PropTypes from "prop-types"
import {
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  FormText
} from "reactstrap"
import { connect as reduxConnect } from "react-redux"
import "./styles.css"

const mapStateToProps = ({}) => ({})

const mapDispatchToProps = {}

class SearchBar extends Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {}

  static defaultProps = {}

  static getDerivedStateFromProps(nextProps, prevState) {
    return nextProps
  }

  componentDidMount() {}

  componentDidUpdate(prevProps, prevState) {}

  componentWillUnmount() {}

  render() {
    return (
      <Form className="SearchBar">
        <FormGroup row>
          <Col sm={12}>
            <Input
              type="text"
              name="search"
              id="exampleEmail"
              placeholder="Search..."
            />
          </Col>
        </FormGroup>
      </Form>
    )
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(SearchBar)
