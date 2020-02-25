import React, { useMemo } from "react"
import PropTypes from "prop-types"
import { Container, Row, Col, ButtonGroup, Button, Jumbotron } from "reactstrap"
import { AddToHomeScreen, BasicCard, Footer, Header } from "../../components"
import { RouteMap, RouterPush } from "../../routes"
import LogoImage from "../../components/BackgroundImage/LogoImage"
import { connect as reduxConnect } from "react-redux"
import { useHistory } from "react-router-dom"
import {
  Bell,
  CloudDownload,
  Mobile,
  PhoneLaptop,
  ShieldCheck,
  UserHeadset,
  WifiSlash
} from "../../images/SVG"
import "./styles.css"

const mapStateToProps = ({ User: { id } }) => ({ userId: id })

const Home = ({ userId }) => {
  const history = useHistory()
  const features = [
    {
      title: "Installable",
      text:
        "Install this app to your device just like you would in an app store",
      faIcon: "fas fa-download",
      button: <AddToHomeScreen />
    },
    {
      title: "Sync",
      text: "Automatically sync your entries across all devices",
      faIcon: "fas fa-sync-alt",
      button: (
        <Button
          color="accent"
          onClick={() => RouterPush(history, RouteMap.SIGNUP)}
          disabled={userId ? true : false}
        >
          Sign Up
        </Button>
      )
    },
    {
      title: "Notifications",
      text: "Daily motivation to journal your life",
      header: <Bell className="AboutFeatureImage" />,
      button: (
        <Button
          color="accent"
          onClick={() => RouterPush(history, RouteMap.SETTINGS)}
        >
          Comming Soon
        </Button>
      )
    },
    {
      title: "Offline",
      text: "Doesn't require an internet connection",
      header: <WifiSlash className="AboutFeatureImage" />,
      button: (
        <Button
          color="accent"
          onClick={() => RouterPush(history, RouteMap.SETTINGS)}
        >
          Go Offline
        </Button>
      )
    },
    {
      title: "Support",
      text: "Open to feature suggestions, bug reports, or conversation!",
      header: <UserHeadset className="AboutFeatureImage" />,
      button: (
        <Button
          color="accent"
          onClick={() => RouterPush(history, RouteMap.SUPPORT)}
        >
          Support Page
        </Button>
      )
    },

    {
      title: "Linkable",
      text: "Share any public view you want with your friends and family",
      faIcon: "fas fa-link"
      // button: <Button color="accent">Learn More</Button>
    },
    {
      title: "Responsive",
      text: "UI fits the screen dimensions of any device",
      header: <PhoneLaptop className="AboutFeatureImage" />
    },
    {
      title: "Fresh",
      text: "Always get the latest verision of the app",
      header: <CloudDownload className="AboutFeatureImage" />
    },
    {
      title: "App-like",
      text: "Looks and interacts like a native app",
      header: <Mobile className="AboutFeatureImage" />
    },
    {
      title: "Secure",
      text: "Always served over HTTPS",
      header: <ShieldCheck className="AboutFeatureImage" />
    }
  ]

  const renderFeatures = useMemo(
    () =>
      features.map((feature, i) => (
        <Col key={i} md={4} sm={6} xs={12} className="p-0 p-sm-1 p-md-2 p-lg-3">
          <BasicCard cardHeaderClassName="Center" {...feature} />
        </Col>
      )),
    [features]
  )

  return (
    <Container tag="article" className="Home Container">
      <Row>
        <Col xs={12} className="Center">
          <LogoImage height={256} width={256} />
        </Col>
      </Row>
      <Row className="Center" tag={Jumbotron}>
        <Col xs={12}>
          <Header color="var(--secondaryColor)">Astral Tree</Header>
          <h3>The first progressive web app journal</h3>
        </Col>
        <Col xs={12}>
          <ButtonGroup size="lg">
            <Button
              color="accent"
              onClick={() => RouterPush(history, RouteMap.NEW_ENTRY)}
            >
              <i className="fas fa-feather-alt mr-1" />
              New Entry
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
      <Row>{renderFeatures}</Row>
      <hr style={{ height: 40 }} />
      <Footer />
    </Container>
  )
}

Home.propTypes = {
  userId: PropTypes.number
}

export default reduxConnect(mapStateToProps)(Home)
