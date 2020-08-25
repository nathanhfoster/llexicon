import React, { lazy, useMemo } from "react"
import PropTypes from "prop-types"
import { Container, Row, Col, Button } from "reactstrap"
import {
  AddToHomeScreen,
  BasicCard,
  Header,
  NewEntryButton,
} from "../../components"
import { RouteMap, RouterPush } from "store/reducers/router/actions"
import LogoImage from "../../components/BackgroundImage/LogoImage"
import { connect } from "store/provider"
import {
  Bell,
  CloudDownload,
  Mobile,
  PhoneLaptop,
  ShieldCheck,
  UserHeadset,
  WifiSlash,
} from "../../images/SVG"
import "./styles.css"

const Footer = lazy(() => import("../../components/Footer"))

const mapStateToProps = ({ User: { id } }) => ({ userId: id })

const About = ({ userId, prompt, promptToInstall }) => {
  const features = useMemo(
    () => [
      {
        faIcon: "fas fa-download",
        title: "Installable",
        text:
          "Install this app to your device just like you would in an app store",

        button: (
          <AddToHomeScreen prompt={prompt} promptToInstall={promptToInstall} />
        ),
      },
      {
        faIcon: "fas fa-sync-alt",
        title: "Sync",
        text: "Automatically sync your entries across all devices",
        button: (
          <Button
            color="accent"
            onClick={() => RouterPush(RouteMap.SIGNUP)}
            disabled={userId ? true : false}
          >
            Sign Up
          </Button>
        ),
      },
      {
        header: <Bell className="AboutFeatureImage" />,
        title: "Notifications",
        text: "Daily motivation to journal your life",
        button: (
          <Button
            color="accent"
            onClick={() => RouterPush(RouteMap.SETTINGS_PUSH_NOTIFICATIONS)}
          >
            Grant Access
          </Button>
        ),
      },
      {
        header: <WifiSlash className="AboutFeatureImage" />,
        title: "Offline",
        text: "Doesn't require an internet connection",
        button: (
          <Button
            color="accent"
            onClick={() => RouterPush(RouteMap.SETTINGS_PREFERENCES)}
          >
            Go Offline
          </Button>
        ),
      },
      {
        header: <UserHeadset className="AboutFeatureImage" />,
        title: "Support",
        text: "Open to feature suggestions, bug reports, or conversation!",
        button: (
          <Button color="accent" onClick={() => RouterPush(RouteMap.SUPPORT)}>
            Support Page
          </Button>
        ),
      },

      {
        faIcon: "fas fa-link",
        title: "Linkable",
        text: "Share any public view you want with your friends and family",
        // button: <Button color="accent">Learn More</Button>
      },
      {
        header: <PhoneLaptop className="AboutFeatureImage" />,
        title: "Responsive",
        text: "UI fits the screen dimensions of any device",
      },
      {
        header: <CloudDownload className="AboutFeatureImage" />,
        title: "Fresh",
        text: "Always get the latest verision of the app",
      },
      {
        header: <Mobile className="AboutFeatureImage" />,
        title: "App-like",
        text: "Looks and interacts like a native app",
      },
      {
        header: <ShieldCheck className="AboutFeatureImage" />,
        title: "Secure",
        text: "Always served over HTTPS",
      },
    ],
    [userId, prompt, promptToInstall]
  )

  const renderFeatures = useMemo(
    () =>
      features.map((feature, i) => (
        <Col key={i} xs={12} sm={6} md={4} className="pt-3 pt-sm-4">
          <BasicCard
            {...feature}
            cardHeaderClassName="Center"
            cardBodyClassName="AboutCardBody"
            cardTitleClassName="Center"
            cardTextClassName="Center"
          />
        </Col>
      )),
    [features]
  )

  const homeCardHeader = useMemo(
    () => <LogoImage height={256} width={256} />,
    []
  )

  const homeCardTitle = useMemo(
    () => ({ name: "Astral Tree", render: <Header>Astral Tree</Header> }),
    []
  )

  const homeCardText = useMemo(
    () => (
      <div>
        <h3>The first progressive web app journal</h3>
      </div>
    ),
    []
  )

  const homeCardButton = useMemo(() => <NewEntryButton />, [])

  return (
    <Container tag="article" className="About Container">
      <Row>
        <Col xs={12} className="pt-3 pt-sm-4">
          <BasicCard
            cardHeaderClassName="Center"
            header={homeCardHeader}
            title={homeCardTitle}
            cardTextClassName="Center"
            text={homeCardText}
            button={homeCardButton}
          />
        </Col>
      </Row>
      <Row>{renderFeatures}</Row>
      <Row className="mt-3 mt-sm-4">
        <Col xs={12}>
          <Footer />
        </Col>
      </Row>
    </Container>
  )
}

About.propTypes = {
  userId: PropTypes.number,
}

export default connect(mapStateToProps)(About)
