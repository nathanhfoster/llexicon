import React from "react"
import PropTypes from "prop-types"
import { Container, Row, Col, Button } from "reactstrap"
import { ImportEntries } from "../../../components"
import { connect as reduxConnect } from "react-redux"
import { copyStringToClipboard } from "../../../helpers"
import { SyncEntries, GetAllUserEntries } from "../../../redux/Entries/actions"
import MomentJs from "moment"

const mapStateToProps = ({ Entries: { items, filteredItems } }) => ({
  items,
  filteredItems
})

const mapDispatchToProps = { SyncEntries, GetAllUserEntries }

const ImportExportEntries = ({
  items,
  filteredItems,
  SyncEntries,
  GetAllUserEntries
}) => {
  const entries = items.concat(filteredItems)

  const GetAllEntries = () =>
    SyncEntries(() => new Promise(resolve => resolve(GetAllUserEntries())))
    
  const handleExportEntries = () => {
    const formattedEntries = entries.map((entry, i) => {
      const {
        id,
        author,
        tags,
        title,
        html,
        date_created,
        date_created_by_author,
        date_updated,
        views,
        latitude,
        longitude
      } = entry
      const dateFormat = "YYYY-MM-DD hh:mm:ss"

      return {
        id,
        author,
        tags: tags.reduce(
          (entryString, entry) => (entryString += `${entry.title},`),
          ""
        ),
        title,
        html,
        date_created: MomentJs(date_created).format(dateFormat),
        date_created_by_author: MomentJs(date_created_by_author).format(
          dateFormat
        ),
        date_updated: MomentJs(date_updated).format(dateFormat),
        views,
        latitude,
        longitude
      }
    })
    copyStringToClipboard(JSON.stringify(formattedEntries))
    alert("Entries copied to clipboard.")
  }

  return (
    <Container fluid>
      <Row>
        <Col xs={12}>
          <Button color="accent" onClick={GetAllEntries}>
            <i className="fas fa-cloud-download-alt" /> Download and Sync All
            Entries
          </Button>
        </Col>
        <Col xs={6}>
          <ImportEntries />
        </Col>
        <Col xs={6}>
          <Button color="accent" onClick={handleExportEntries}>
            <i className="fas fa-clipboard" /> Export Entries
          </Button>
        </Col>
      </Row>
    </Container>
  )
}

ImportExportEntries.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  filteredItems: PropTypes.arrayOf(PropTypes.object).isRequired
}

ImportExportEntries.defaultProps = {}

export default reduxConnect(
  mapStateToProps,
  mapDispatchToProps
)(ImportExportEntries)
