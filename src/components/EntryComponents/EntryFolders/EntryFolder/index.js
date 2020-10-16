import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Button } from 'reactstrap'
import './styles.css'

const EntryFolder = ({ title, onClick }) => (
  <Button outline className='EntryFolder p-0' onClick={onClick} color='accent'>
    <i className='fas fa-folder fa-2x' />
    <div className='EntryFolderTitle Overflow'>{title}</div>
  </Button>
)

EntryFolder.propTypes = { title: PropTypes.string }

export default memo(EntryFolder)
