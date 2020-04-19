import React, { memo } from "react"
import { Container, Row, Col } from "reactstrap"
import { Header } from "../"
import { RouteMap } from "../../routes"
import "./styles.css"

const PrivacyPolicy = () => (
  <Container className="PrivacyPolicy Container">
    <Row>
      <Col xs={12}>
        <Header>Privacy Policy</Header>
        <p>Let's make this simple.</p>
        <p>Our privacy is important to me.</p>
        <p>I do not sell or reveal your data to any person or entity.</p>
        <p>
          Google Analytics is used to record{" "}
          <a
            href="https://support.google.com/analytics/answer/6004245?hl=en"
            target="_blank"
          >
            basic visit data
          </a>
          .
        </p>
        <p>
          Your data belongs to you and you can completely remove your data at
          any point by going to{" "}
          <a href={RouteMap.SETTINGS_PROFILE}> your profile</a>.
        </p>
        <p>
          I use your browser's{" "}
          <a
            href="https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage"
            target="_blank"
          >
            {" "}
            localStorage API{" "}
          </a>{" "}
          to cache your journal entries on your device regardless if you signed
          in under an account.
        </p>
        <p>
          If you are signed in to an account, I use a
          <a href="https://www.djangoproject.com/" target="_blank">
            {" "}
            Django
          </a>{" "}
          backend service to persist your data across all other devices that are
          logged in to that account.
        </p>
      </Col>
    </Row>
  </Container>
)

export default memo(PrivacyPolicy)
