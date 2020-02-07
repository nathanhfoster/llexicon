import React from "react"
import PropTypes from "prop-types"
import { Container, Row, Col, ButtonGroup, Button } from "reactstrap"
import Feature from "./Feature"
import { connect as reduxConnect } from "react-redux"
import { useHistory } from "react-router-dom"
import { RouteMap, RouterPush } from "../../ReactRouter/Routes"
import LogoImage from "../../components/BackgroundImage/LogoImage"
import AddToHomeScreen from "../../components/AddToHomeScreen"
import "./styles.css"

const mapStateToProps = ({ User: { id } }) => ({ userId: id })

const renderFeatures = features =>
  features.map((feature, i) => (
    <Col key={i} md={4} sm={6} xs={12}>
      <Feature {...feature} />
    </Col>
  ))

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
          tag={Button}
          color="accent"
          onClick={() => RouterPush(history, RouteMap.SIGNUP)}
          disabled={userId}
        >
          Sign Up
        </Button>
      )
    },
    {
      title: "Notifications",
      text: "Daily motivation to journal your life",
      header: (
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 448 512"
          className="AboutFeatureImage"
        >
          <path
            fill="currentColor"
            d="M448 384c-.1 16.4-13 32-32.1 32H32.08C13 416 .09 400.4 0 384a31.25 31.25 0 0 1 8.61-21.71c19.32-20.76 55.47-52 55.47-154.29 0-77.7 54.48-139.9 127.94-155.16V32a32 32 0 1 1 64 0v20.84C329.42 68.1 383.9 130.3 383.9 208c0 102.3 36.15 133.53 55.47 154.29A31.27 31.27 0 0 1 448 384z"
            className="fa-secondary"
          ></path>
          <path
            fill="#ecf0f1"
            d="M160 448h128a64 64 0 0 1-128 0z"
            className="fa-primary"
          ></path>
        </svg>
      ),
      button: (
        <Button
          tag={Button}
          color="accent"
          onClick={() => RouterPush(history, RouteMap.SETTINGS)}
        >
          Comming Soon
        </Button>
      )
    },
    {
      title: "Offline",
      text: "Doesn't require an internet connections",
      header: (
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 640 512"
          className="AboutFeatureImage"
        >
          <path
            fill="currentColor"
            d="M466.74 326.35a222.2 222.2 0 0 0-36.69-25.75L291.29 193.36c81.8-7.62 166.15 17.36 231.38 75.05a15.81 15.81 0 0 1 .56 23.15l-34.44 34a16.31 16.31 0 0 1-22.05.79zM207.6 128.68c126.08-38.46 268.25-10.63 371 83.53a16.25 16.25 0 0 0 22.4-.38l34.24-34a15.9 15.9 0 0 0-.36-23C496.4 26.77 297.77-1.12 133.06 71.06zM256 416a63.88 63.88 0 0 0 127 10l-88.7-68.56A64 64 0 0 0 256 416zM5.09 154.87a15.88 15.88 0 0 0-.35 23L39 211.8a16.25 16.25 0 0 0 22.4.38c7-6.4 14.31-12.22 21.65-18L18.07 144c-4.3 3.67-8.79 7-12.98 10.87zm113.22 113.52a15.9 15.9 0 0 0-.57 23.17l34.28 34a16.17 16.17 0 0 0 21.94.8c13.35-11.6 28-20.66 43.15-28.55L148.75 245a299.77 299.77 0 0 0-30.44 23.39z"
            className="fa-secondary"
          ></path>
          <path
            fill="#ecf0f1"
            d="M636.64 480.55L617 505.82a16 16 0 0 1-22.46 2.81L6.18 53.9a16 16 0 0 1-2.81-22.45L23 6.18a16 16 0 0 1 22.47-2.81L633.83 458.1a16 16 0 0 1 2.81 22.45z"
            className="fa-primary"
          ></path>
        </svg>
      ),
      button: (
        <Button
          tag={Button}
          color="accent"
          onClick={() => RouterPush(history, RouteMap.SETTINGS)}
        >
          Go Offline
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
      header: (
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 640 512"
          className="AboutFeatureImage"
        >
          <path
            fill="currentColor"
            d="M608 128H416a32 32 0 0 0-32 32v320a32 32 0 0 0 32 32h192a32 32 0 0 0 32-32V160a32 32 0 0 0-32-32zm0 352H416V160h192zM96 32h384v64h32V32a32 32 0 0 0-32-32H96a32 32 0 0 0-32 32v256H16a16 16 0 0 0-16 16v16a64.14 64.14 0 0 0 63.91 64H352v-32H63.91A32 32 0 0 1 32 320h320v-32H96z"
            className=""
          ></path>
        </svg>
      )
    },
    {
      title: "Fresh",
      text: "Always get the latest verision of the app",
      faIcon: "fas fa-cloud-download-alt"
    },
    {
      title: "App-like",
      text: "Looks and interacts like a native app",
      header: (
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 320 512"
          className="AboutFeatureImage"
        >
          <path
            fill="currentColor"
            d="M0 384v80a48 48 0 0 0 48 48h224a48 48 0 0 0 48-48v-80zm160 96a32 32 0 1 1 32-32 32 32 0 0 1-32 32z"
            className="fa-secondary"
          ></path>
          <path
            fill="#ecf0f1"
            d="M0 384V48A48 48 0 0 1 48 0h224a48 48 0 0 1 48 48v336z"
            className="fa-primary"
          ></path>
        </svg>
      )
    },
    {
      title: "Secure",
      text: "Always served over HTTPS",
      header: (
        <svg
          aria-hidden="true"
          focusable="false"
          viewBox="0 0 512 512"
          className="AboutFeatureImage"
        >
          <path
            fill="currentColor"
            d="M163.2 230.5c-4.7-4.7-12.3-4.7-17-.1l-22.7 22.5c-4.7 4.7-4.7 12.3-.1 17l90.8 91.5c4.7 4.7 12.3 4.7 17 .1l172.6-171.2c4.7-4.7 4.7-12.3.1-17l-22.5-22.7c-4.7-4.7-12.3-4.7-17-.1L223 290.7zM466.5 83.7l-192-80a48.15 48.15 0 0 0-36.9 0l-192 80C27.7 91.1 16 108.6 16 128c0 198.5 114.5 335.7 221.5 380.3 11.8 4.9 25.1 4.9 36.9 0C360.1 472.6 496 349.3 496 128c0-19.4-11.7-36.9-29.5-44.3zM256 464C158.5 423.4 64 297.3 64 128l192-80 192 80c0 173.8-98.4 297-192 336z"
          ></path>
        </svg>
      )
    }
  ]

  return (
    <Container className="Home Container">
      <Row>
        <Col xs={12} className="Center">
          <LogoImage height={256} width={256} />
        </Col>
      </Row>
      <Row className="Center">
        <Col xs={12}>
          <h1>Astral Tree</h1>
        </Col>
        <Col xs={12}>
          <h3>The first progressive web app journal</h3>
        </Col>
        <Col xs={12}>
          <ButtonGroup size="lg">
            <Button
              tag={Button}
              color="accent"
              onClick={() => RouterPush(history, RouteMap.NEW_ENTRY)}
            >
              <i className="fas fa-feather-alt mr-1" />
              New Entry
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
      <Row>{renderFeatures(features)}</Row>
    </Container>
  )
}

Home.propTypes = {
  userId: PropTypes.number
}

export default reduxConnect(mapStateToProps)(Home)
