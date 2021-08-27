import React, { useEffect, useMemo, memo } from 'react'
import PropTypes from 'prop-types'
import { EntriesPropTypes } from 'redux/Entries/propTypes'
import { useDispatch } from 'react-redux'
import { BasicTable, Header, EntryDataCellLink, TagsContainer, EntriesTable } from 'components'
import Moment from 'react-moment'
import { Container, Row, Col } from 'reactstrap'
import { stringMatch, stripHtml, formatBytes } from '../../../utils'
import { GetUserEntriesDetails } from 'redux/Admin/actions'

const { REACT_APP_API_URL } = process.env

const UserEntriesTable = ({ user, entries, height }) => {
  const dispatch = useDispatch()
  const hasDetails = entries && entries.find(entry => entry.html)
  const styles = useMemo(() => ({ height }), [height])
  useEffect(() => {
    dispatch(GetUserEntriesDetails(user.id))
  }, [])

  if (!hasDetails) return null

  return (
    <Container className='UserEntriesTable Container'>
      <Row className='Center'>
        <Col xs={12} className='p-0'>
          <Header fill='var(--quinaryColor)'>User Entries Table</Header>
        </Col>
      </Row>
      <Row className='HomeRow mb-3 pb-1' style={styles}>
        <EntriesTable entries={entries} />
      </Row>
    </Container>
  )
}

UserEntriesTable.propTypes = {
  entries: EntriesPropTypes,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
}

UserEntriesTable.defaultProps = {
  height: 424,
}

export default memo(UserEntriesTable)
