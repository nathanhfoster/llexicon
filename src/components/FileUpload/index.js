import React, { memo } from "react"
import PropTypes from "prop-types"
import { FormGroup, Label, Input, Media, FormText } from "reactstrap"

import "./styles.css"

const FileUpload = ({ value, onChangeCallback }) => (
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

FileUpload.propTypes = {
  value: PropTypes.string,
  onChangeCallback: PropTypes.func.isRequired
}

export default memo(FileUpload)
