import React, { lazy, useMemo } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { Container, Row, Col, Button } from "reactstrap"
import {
  AddToHomeScreen,
  BasicCard,
  EntriesTable,
  Header,
} from "../../components"
import LogoImage from "../../components/BackgroundImage/LogoImage"
import { RouterPush, RouteMap } from "../../routes"
import "./styles.css"

const HomeButtons = lazy(() => import("../../components/EntryNavButtons"))
const EntriesMostViewed = lazy(() =>
  import("../../components/EntriesMostViewed")
)
const EntriesRandom = lazy(() => import("../../components/EntriesRandom"))
const EntriesRediscover = lazy(() =>
  import("../../components/EntriesRediscover")
)

const mapStateToProps = ({ User: { token }, Entries: { items } }) => ({
  entries: items,
  userToken: token,
})

const Home = ({ entries, userToken, prompt, promptToInstall, history }) => {
  const handleOnClick = () =>
    RouterPush(history, RouteMap[!userToken ? "ABOUT" : "SETTINGS_ENTRIES"])

  const viewableEntries = useMemo(
    () => entries.filter((item) => !item._shouldDelete),
    [entries]
  )

  return (
    <Container tag="article" className="Home Container">
      <Row className="mb-3">
        <Col xs={12} className="px-0 pt-3 pt-sm-4">
          <BasicCard
            header={<LogoImage height={256} width={256} />}
            title={<Header>Astral Tree</Header>}
            text={
              <Button
                color={!userToken ? "info" : "success"}
                onClick={handleOnClick}
              >
                {!userToken ? "Learn More" : "Settings"}
              </Button>
            }
            button={<HomeButtons />}
          />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col xs={12} className="p-0">
          <Header fill="var(--accentColor)">Entries Table</Header>
        </Col>
        <EntriesTable entries={viewableEntries} />
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
  userId: PropTypes.number,
}

export default reduxConnect(mapStateToProps)(Home)
