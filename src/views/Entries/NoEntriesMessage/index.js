import React, { memo } from "react"
import { Container, Row, Col, Button, Jumbotron } from "reactstrap"
import { RouterPush } from "../../../ReactRouter/Routes"
import { useHistory } from "react-router-dom"

const NoEntiresMessage = () => {
  const history = useHistory()

  const handleClick = () => RouterPush(history, "/home")

  return (
    
    <Jumbotron>
      <Button onClick={handleClick}>No Entries</Button>
    </Jumbotron>
  )
}

export default memo(NoEntiresMessage)
