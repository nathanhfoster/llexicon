import React  from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button } from 'reactstrap'
import { RouterPush } from 'redux/router/actions'
import './styles.css'

const mapStateToProps = ({
  router: {
    location: { search },
  },
}) => ({ search })

const EntryFolder = ({ title, search }) => {
  const handleOnClickCallback = () => {
    RouterPush(search.concat(`+${title}`))
  }

  return (
    <Button
      outline
      title={title}
      className='EntryFolder p-0'
      onClick={handleOnClickCallback}
      color='accent'
    >
      <i className='fas fa-folder fa-2x' />
      <div className='EntryFolderTitle Overflow'>{title}</div>
    </Button>
  )
}

EntryFolder.propTypes = { title: PropTypes.string }

export default connect(mapStateToProps)(EntryFolder)
