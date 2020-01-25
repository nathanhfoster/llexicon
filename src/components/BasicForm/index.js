import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { Button, Form, FormGroup, Label, Input } from "reactstrap"
import { connect as reduxConnect } from "react-redux"
import { withRouter } from "react-router-dom"
import { RouterPush, RouterLinkPush } from "../../ReactRouter/Routes"
import "./styles.css"

const mapStateToProps = ({}) => ({})

const mapDispatchToProps = {}

class BasicForm extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {
    title: PropTypes.string,
    inputs: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        defaultValue: PropTypes.string,
        label: PropTypes.string,
        type: PropTypes.string,
        name: PropTypes.string,
        placeholder: PropTypes.string,
        check: PropTypes.bool
      }).isRequired
    ),
    onSubmit: PropTypes.func,
    submitLabel: PropTypes.string
  }

  static defaultProps = {
    inputs: [
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
    ],
    submitLabel: "Submit"
  }

  handleSubmit = e => {
    e.preventDefault()
    const { inputs, onSubmit } = this.props
    let payload = {}

    for (let i = 0, { length } = inputs; i < length; i++) {
      const { id, value, type, checked } = e.target[i]
      if (value) {
        payload[id] = value
      } else if (type === "radio") {
        // console.log("RADIO: ", checked)
        payload[id] = checked
      }
    }

    onSubmit(payload)
  }

  renderInputs = inputs =>
    inputs.map(input => {
      const { id, defaultValue, label, type, name, placeholder, check } = input
      return (
        <FormGroup check={check} key={id}>
          <Label check={check} for={id}>
            {label}
          </Label>
          <Input
            defaultValue={defaultValue}
            type={type}
            name={name || id}
            id={id}
            placeholder={placeholder}
          />
        </FormGroup>
      )
    })

  render() {
    const { title, inputs, submitLabel } = this.props
    return (
      <Form onSubmit={this.handleSubmit} method="post">
        {title && <h2 className="Center">{title}</h2>}
        {this.renderInputs(inputs)}
        <div className="Center">
          <Button color="primary" type="submit">
            {submitLabel}
          </Button>
        </div>
      </Form>
    )
  }
}
export default withRouter(reduxConnect(mapStateToProps, mapDispatchToProps)(BasicForm))
