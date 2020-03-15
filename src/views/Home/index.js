import React, { lazy, useMemo } from "react"
import PropTypes from "prop-types"
import { Container, Row, Col, Button } from "reactstrap"
import {
  AddToHomeScreen,
  BasicCard,
  EntriesTable,
  Header
} from "../../components"
import LogoImage from "../../components/BackgroundImage/LogoImage"
import { connect as reduxConnect } from "react-redux"
import "./styles.css"

const HomeButtons = lazy(() => import("../../components/EntryNavButtons"))
const Footer = lazy(() => import("../../components/Footer"))

const mapStateToProps = ({ Entries: { items } }) => ({ entries: items })

const Home = ({ entries, prompt, promptToInstall }) => {
  return (
    <Container tag="article" className="Home Container">
      <Row className="mb-3">
        <Col xs={12} className="pt-3 pt-sm-4">
          <BasicCard
            header={<LogoImage height={256} width={256} />}
            title={<Header>Astral Tree</Header>}
            text={
              <AddToHomeScreen
                prompt={prompt}
                promptToInstall={promptToInstall}
              />
            }
            button={<HomeButtons />}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <Header fill="var(--primaryColor)">Entries Table</Header>
        </Col>
        <Col xs={12}>
          <EntriesTable entries={entries} />
        </Col>
      </Row>
      <hr style={{ height: 40 }} />
      <Footer />
    </Container>
  )
}

Home.propTypes = {
  userId: PropTypes.number
}

export default reduxConnect(mapStateToProps)(Home)
