import React, { useMemo, lazy } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { Container, Row, Col, Button } from "reactstrap"
import { AddToHomeScreen, BasicCard, Header } from "../../components"
import LogoImage from "../../components/BackgroundImage/LogoImage"
import { RouterPush, RouteMap } from "../../routes"
import "./styles.css"

const EntryNavButtons = lazy(() => import("../../components/EntryNavButtons"))
const EntriesTable = lazy(() => import("../../components/EntriesTable"))
const EntriesMostViewed = lazy(() =>
  import("../../components/EntriesMostViewed")
)
const EntriesRandom = lazy(() => import("../../components/EntriesRandom"))
const EntriesRediscover = lazy(() =>
  import("../../components/EntriesRediscover")
)

const mapStateToProps = ({ User: { id } }) => ({
  userIsLoggedIn: !!id,
})

const Home = ({ userIsLoggedIn, prompt, promptToInstall, history }) => {
  const homeCardHeader = useMemo(
    () => <LogoImage height={256} width={256} />,
    []
  )

  const homeCardTitle = useMemo(() => <Header>Astral Tree</Header>, [])

  const homeCardText = useMemo(
    () => (
      <Button
        color={!userIsLoggedIn ? "info" : "success"}
        onClick={() =>
          RouterPush(
            history,
            !userIsLoggedIn ? RouteMap.ABOUT : RouteMap.SETTINGS_ENTRIES
          )
        }
      >
        {!userIsLoggedIn ? "Learn More" : "Settings"}
      </Button>
    ),
    [userIsLoggedIn]
  )

  const homeCardButton = useMemo(() => <EntryNavButtons />, [])

  return (
    <Container tag="article" className="Home Container">
      <Row className="mb-3">
        <Col xs={12} className="px-0 pt-3 pt-sm-4">
          <BasicCard
            header={homeCardHeader}
            title={homeCardTitle}
            text={homeCardText}
            button={homeCardButton}
          />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col xs={12} className="p-0">
          <Header fill="var(--quinaryColor)">Entries Table</Header>
        </Col>
        <EntriesTable />
      </Row>
      <Row className="HomeRow mb-3 pb-1">
        <EntriesRediscover />
      </Row>
      <Row className="HomeRow mb-3 pb-1">
        <EntriesMostViewed />
      </Row>
      <Row className="HomeRow pb-1">
        <EntriesRandom />
      </Row>
    </Container>
  )
}

Home.propTypes = {
  userIsLoggedIn: PropTypes.bool.isRequired,
}

Home.defaultProps = { userIsLoggedIn: false }

export default reduxConnect(mapStateToProps)(Home)
