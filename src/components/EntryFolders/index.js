import React, { useState, useEffect, useMemo, memo } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import {
  Container,
  Row,
  Col,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  CardBody
} from "reactstrap"

import { NavLink } from "react-router-dom"
import { RouterPush } from "../../routes"
import "./styles.css"

const mapStateToProps = ({ Entries: { EntryTags } }) => ({ EntryTags })

const BASE_FOLDER_DIRECTORY_URL = "folders?folder=All"

const EntryFolders = ({
  EntryTags,
  entries,
  history,
  location: { search }
}) => {
  useEffect(() => {
    if (!search) RouterPush(history, BASE_FOLDER_DIRECTORY_URL)
  }, [])
  const directoryPath = search.replace("?folder=", "").split("+")

  const renderFolderBreadCrumbs = () =>
    directoryPath.map((directory, i) => {
      const newDirectory = directoryPath.slice(0, i + 1).join("+")
      const path = `?folder=${newDirectory}`
      return (
        <BreadcrumbItem key={i}>
          <NavLink to={path}>{directory}</NavLink>
        </BreadcrumbItem>
      )
    })

  const renderFolders = () =>
    EntryTags.map(({ title }) => {
      const handleOnClickCallback = () =>
        RouterPush(history, search.concat(`+${title}`))
      return (
        <Col xs={3} className="p-1">
          <Card className="EntryFolder Center" onClick={handleOnClickCallback}>
            <CardBody>{title}</CardBody>
          </Card>
        </Col>
      )
    })

  return (
    <Container fluid className="EntryFolders">
      <Row tag={Breadcrumb}>{renderFolderBreadCrumbs()}</Row>
      <Row>{renderFolders()}</Row>
    </Container>
  )
}

EntryFolders.propTypes = {}

EntryFolders.defaultProps = {}

export default reduxConnect(mapStateToProps)(memo(EntryFolders))
