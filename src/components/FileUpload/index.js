import React, { PureComponent } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { FormGroup, Label, Input, Media, FormText } from "reactstrap"

import "./styles.css"

class FileUpload extends PureComponent {
  constructor(props) {
    super(props)

    this.state = {}
  }

  static propTypes = {}

  static defaultProps = {}

  static getDerivedStateFromProps(nextProps, prevState) {
    return nextProps
  }

  render() {
    const { value, onChangeCallback } = this.props
    return (
      <FormGroup className="FileUploadContainer">
        <FormText color="white">Import Entries</FormText>
        <Label className="FileUpload" for="fileUpload">
          {!value ? (
            <i className="fas fa-file-import fa-2x" />
          ) : (
            <Media src={value} />
          )}
        </Label>
        <Input
          type="file"
          name={value}
          id="fileUpload"
          onChange={onChangeCallback}
          multiple
        />
      </FormGroup>
    )
  }
}
export default FileUpload
