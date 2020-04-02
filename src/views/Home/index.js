import React, { lazy, useMemo } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { Container, Row, Col, Button } from "reactstrap"
import {
  AddToHomeScreen,
  BasicCard,
  EntriesTable,
  Header
} from "../../components"
import LogoImage from "../../components/BackgroundImage/LogoImage"
import { RouterPush, RouteMap } from "../../routes"
import Moment from "react-moment"
import "./styles.css"

const HomeButtons = lazy(() => import("../../components/EntryNavButtons"))
const EntriesRandom = lazy(() => import("../../components/EntriesRandom"))
const EntriesRediscover = lazy(() =>
  import("../../components/EntriesRediscover")
)

const mapStateToProps = ({ User: { token }, Entries: { items } }) => ({
  entries: items,
  userToken: token
})

const Home = ({ entries, userToken, prompt, promptToInstall, history }) => {
  const today = new Date()
  const handleOnClick = () =>
    RouterPush(history, RouteMap[!userToken ? "ABOUT" : "SETTINGS_ENTRIES"])

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
          <Header fill="var(--quinaryColor)">Entries table</Header>
        </Col>
        <EntriesTable entries={entries} />
      </Row>
      <Row className="HomeRow mb-3 pb-1">
        <Col xs={12} className="p-0">
          <Header fill="var(--quinaryColor)">Rediscover this day</Header>
        </Col>
        <Col xs={12} className="p-0 mt-1">
          <Header fontSize="1.5rem">
            <Moment format="MMMM D">{today}</Moment>
          </Header>
        </Col>
        <EntriesRediscover />
      </Row>
      <Row className="HomeRow pb-1">
        <Col xs={12} className="p-0">
          <Header fill="var(--quinaryColor)">Random entries</Header>
        </Col>
        <EntriesRandom />
      </Row>
    </Container>
  )
}

Home.propTypes = {
  userId: PropTypes.number
}

export default reduxConnect(mapStateToProps)(Home)
