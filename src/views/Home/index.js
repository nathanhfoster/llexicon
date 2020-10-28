import React, { useMemo, lazy, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Container, Row, Col, ButtonGroup, Button } from 'reactstrap'
import { AddToHomeScreen, BasicCard, Header, EntriesToggleShowOnlyPublic } from '../../components'
import LogoImage from '../../components/BackgroundImage/LogoImage'
import { RouterPush, RouteMap } from 'redux/router/actions'
import './styles.css'

const EntryNavButtons = lazy(() => import('../../components/EntryComponents/EntryNavButtons'))
const UserEntriesTable = lazy(() => import('../../containers/UserEntriesTable'))

const EntriesMostViewed = lazy(() => import('../../components/EntryComponents/EntriesMostViewed'))
const EntriesRandom = lazy(() => import('../../components/EntryComponents/EntriesRandom'))
const EntriesRediscover = lazy(() => import('../../components/EntryComponents/EntriesRediscover'))

const mapStateToProps = ({ User: { id } }) => ({
  userIsLoggedIn: !!id,
})

const Home = ({ userIsLoggedIn, prompt, promptToInstall }) => {
  const homeCardHeader = useMemo(() => <LogoImage height={256} width={256} />, [])

  const homeCardTitle = useMemo(
    () => ({ name: 'Astral Tree', render: <Header>Astral Tree</Header> }),
    [],
  )

  const homeCardText = useMemo(
    () => (
      <ButtonGroup aria-label='Navigation' size='lg'>
        <Button
          color={!userIsLoggedIn ? 'info' : 'success'}
          onClick={() => RouterPush(!userIsLoggedIn ? RouteMap.ABOUT : RouteMap.SETTINGS_ENTRIES)}
        >
          {!userIsLoggedIn ? 'Learn More' : 'Settings'}
        </Button>
        <EntriesToggleShowOnlyPublic />
      </ButtonGroup>
    ),
    [userIsLoggedIn],
  )

  const homeCardButton = useMemo(() => <EntryNavButtons />, [])

  return (
    <Container tag='article' className='Home Container'>
      <Row className='mb-3'>
        <Col xs={12} className='px-0 pt-3 pt-sm-4'>
          <BasicCard
            cardHeaderClassName='Center'
            header={homeCardHeader}
            title={homeCardTitle}
            cardTextClassName='Center mb-2'
            text={homeCardText}
            button={homeCardButton}
          />
        </Col>
      </Row>
      <Row className='ShowScrollBar mb-3'>
        <Col xs={12} className='p-0'>
          <Header fill='var(--quinaryColor)'>Entries Table</Header>
        </Col>
        <UserEntriesTable />
      </Row>

      <EntriesRediscover />
      <EntriesMostViewed />
      <EntriesRandom />
    </Container>
  )
}

Home.propTypes = {
  userIsLoggedIn: PropTypes.bool.isRequired,
}

Home.defaultProps = { userIsLoggedIn: false }

export default connect(mapStateToProps)(Home)
