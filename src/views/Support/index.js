import React, { memo } from "react"
import PropTypes from "prop-types"
import { Container, Row, Col, Button } from "reactstrap"
import { BasicCard } from "../../components"
import LogoImage from "../../components/BackgroundImage/LogoImage"
import { UserHeadset } from "../../images/SVG"
import "./styles.css"

const renderSupportCards = supportCards =>
  supportCards.map((supportCard, i) => (
    <Col key={i} md={4} sm={6} xs={12} className="p-2">
      <BasicCard cardHeaderClassName="Center" {...supportCard} />
    </Col>
  ))

const Support = () => {
  const supportCards = [
    {
      title: "Contact Dev",
      text: "Open to feature suggestions, bug reports, or conversation!",
      faIcon: "fas fa-envelope",
      button: (
        <Button
          color="accent"
          tag="a"
          href="mailto:nateinthegame@gmail.com?subject=Astral%20Tree%20Support"
          target="_blank"
          rel="noopener noreferrer"
        >
          nateinthegame@gmail.com
        </Button>
      )
    }
  ]
  return (
    <Container tag="article" className="Support Container">
      <Row>
        <Col xs={12} className="Center">
          <UserHeadset />
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
