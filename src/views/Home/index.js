import React, { lazy, useMemo, Fragment } from "react"
import PropTypes from "prop-types"
import { Container, Row, Col, ButtonGroup, Button, Jumbotron } from "reactstrap"
import { BasicCard, Header, NewEntryButton } from "../../components"
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

const AddToHomeScreen = lazy(() => import("../../components/AddToHomeScreen"))
const Footer = lazy(() => import("../../components/Footer"))

const mapStateToProps = ({ User: { id } }) => ({ userId: id })

const Home = ({ userId }) => {
  const history = useHistory()
  const features = [
    {
      faIcon: "fas fa-download",
      title: "Installable",
      text:
        "Install this app to your device just like you would in an app store",

      button: <AddToHomeScreen />
    },
    {
      faIcon: "fas fa-sync-alt",
      title: "Sync",
      text: "Automatically sync your entries across all devices",
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
      header: <Bell className="AboutFeatureImage" />,
      title: "Notifications",
      text: "Daily motivation to journal your life",
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
      header: <WifiSlash className="AboutFeatureImage" />,
      title: "Offline",
      text: "Doesn't require an internet connection",
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
      header: <UserHeadset className="AboutFeatureImage" />,
      title: "Support",
      text: "Open to feature suggestions, bug reports, or conversation!",
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
      faIcon: "fas fa-link",
      title: "Linkable",
      text: "Share any public view you want with your friends and family"
      // button: <Button color="accent">Learn More</Button>
    },
    {
      header: <PhoneLaptop className="AboutFeatureImage" />,
      title: "Responsive",
      text: "UI fits the screen dimensions of any device"
    },
    {
      header: <CloudDownload className="AboutFeatureImage" />,
      title: "Fresh",
      text: "Always get the latest verision of the app"
    },
    {
      header: <Mobile className="AboutFeatureImage" />,
      title: "App-like",
      text: "Looks and interacts like a native app"
    },
    {
      header: <ShieldCheck className="AboutFeatureImage" />,
      title: "Secure",
      text: "Always served over HTTPS"
    }
  ]

  const renderFeatures = useMemo(
    () =>
      features.map((feature, i) => (
        <Col key={i} xs={12} sm={6} md={4} className="pt-3 pt-sm-4">
          <BasicCard {...feature} />
        </Col>
      )),
    [features]
  )

  return (
    <Container tag="article" className="Home Container">
      <Row>
        <Col xs={12} className="pt-3 pt-sm-4">
          <BasicCard
            header={<LogoImage height={256} width={256} />}
            title={<Header>Astral Tree</Header>}
            text={<h3>The first progressive web app journal</h3>}
            button={<NewEntryButton />}
          />
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
