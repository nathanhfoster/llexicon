import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { FormGroup, Input, Media, Button } from 'reactstrap'
import './styles.css'

const FileUpload = ({ title, value, size, onChange }) => {
  const handleButtonClick = () => document.getElementById('fileUpload').click()
  return (
    <FormGroup
      className='FileUploadContainer'
      color='accent'
      tag={Button}
      onClick={handleButtonClick}
      size={size}
    >
      <div for='fileUpload'>
        {!value ? <i className='fas fa-file-import mr-1' /> : <Media src={value} />}
        <Input
          hidden
          type='file'
          name={value}
          id='fileUpload'
          onChange={onChange}
          accept='.json'
          multiple={false}
        />
        {title}
      </div>
    </FormGroup>
  )
}

FileUpload.propTypes = {
  title: PropTypes.string,
  value: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'lg']),
  onChange: PropTypes.func.isRequired,
}

FileUpload.defaultProps = {
  title: 'Import',
  size: 'lg',
}

export default memo(FileUpload)
