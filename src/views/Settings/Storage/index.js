import React, { memo } from 'react'
import { Container, Row, Col } from 'reactstrap'
import { LocalStorage } from 'components'

export const Storage = () => (
  <Container fluid>
    <Row>
      <Col xs={12} className='p-0'>
        <LocalStorage />
      </Col>
    </Row>
  </Container>
)

export default memo(Storage)
