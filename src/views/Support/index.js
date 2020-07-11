import React, { useMemo, memo } from "react"
import PropTypes from "prop-types"
import { Container, Row, Col, Button } from "reactstrap"
import { BasicCard } from "../../components"
import LogoImage from "../../components/BackgroundImage/LogoImage"
import { UserHeadset } from "../../images/SVG"
import "./styles.css"

const SUPPORT_EMAIL = "nateinthegame@gmail.com"

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
          href={`mailto:${SUPPORT_EMAIL}?subject=Astral%20Tree%20Support`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {SUPPORT_EMAIL}
        </Button>
      ),
    },
  ]

  const renderSupportCards = useMemo(
    () =>
      supportCards.map((supportCard, i) => (
        <Col key={i} md={4} sm={6} xs={12} className="p-2">
          <BasicCard cardHeaderClassName="Center" {...supportCard} />
        </Col>
      )),
    []
  )
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
      <Row>{renderSupportCards}</Row>
    </Container>
  )
}

export default memo(Support)
