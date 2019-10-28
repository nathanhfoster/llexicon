import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import ButtonContainer from "../ButtonContainer"
import { clearEditorState } from "../../../../actions/TextEditor"

const mapDispatchToProps = { clearEditorState }

class ClearButton extends PureComponent {
  static propTypes = { clearEditorState: PropTypes.func.isRequired }

  handleClick = () => {
    const { clearEditorState } = this.props
    clearEditorState()
  }

  render() {
    return (
      <ButtonContainer onClick={this.handleClick} title="Clear">
        <i className="fas fa-window-close" />
      </ButtonContainer>
    )
  }
}
export default reduxConnect(null, mapDispatchToProps)(ClearButton)
