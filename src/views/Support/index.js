import React, { memo } from "react"
import PropTypes from "prop-types"
import { Container, Row, Col, Button } from "reactstrap"
import BasicCard from "../../components/BasicCard"
import LogoImage from "../../components/BackgroundImage/LogoImage"
import "./styles.css"

const renderSupportCards = supportCards =>
  supportCards.map((supportCard, i) => (
    <Col key={i} md={4} sm={6} xs={12}>
      <BasicCard {...supportCard} />
    </Col>
  ))

const Support = () => {
  const supportCards = [
    {
      title: "Contact Dev",
      text: "Open to feature suggestions, bug reports, or conversation!",
      header: (
        <svg
          aria-hidden="true"
          focusable="false"
          data-prefix="fad"
          data-icon="user-headset"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 448 512"
        >
          <g class="fa-group">
            <path
              fill="currentColor"
              d="M416 192v16a112.15 112.15 0 0 1-112 112h-96a32 32 0 0 1 0-64h32a32 32 0 0 1 32 32h32a80.09 80.09 0 0 0 80-80v-16c0-88.22-71.78-160-160-160S64 103.78 64 192v16a16 16 0 0 1-32 0v-16C32 86.13 118.13 0 224 0s192 86.13 192 192z"
              class="fa-secondary"
            ></path>
            <path
              fill="currentColor"
              d="M320 352h-23.1a174.1 174.1 0 0 1-145.8 0H128A128 128 0 0 0 0 480a32 32 0 0 0 32 32h384a32 32 0 0 0 32-32 128 128 0 0 0-128-128zm-175.65-60.53c-.06-1.17-.35-2.28-.35-3.47a64.07 64.07 0 0 1 64-64h32a64 64 0 0 1 55.41 32H304a48.05 48.05 0 0 0 48-48v-16a128 128 0 0 0-256 0c0 40.42 19.1 76 48.35 99.47z"
              class="fa-primary"
            ></path>
          </g>
        </svg>
      ),
      button: (
        <Button
          tag="a"
          href="mailto:nateinthegame@gmail.com?subject=Astral%20Tree%20Support"
          // target="_blank"
          rel="noopener noreferrer"
        >
          nateinthegame@gmail.com
        </Button>
      )
    }
  ]
  return (
    <Container className="Support">
      <Row>
        <Col xs={12} className="Center">
          <LogoImage height={256} width={256} />
        </Col>
      </Row>
      <Row>
        <Col xs={12} className="Center">
          <h1>Support</h1>
        </Col>
      </Row>
      <Row>{renderSupportCards(supportCards)}</Row>
    </Container>
  )
}

export default memo(Support)
