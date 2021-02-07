import React, { useState, useCallback, useMemo } from "react"
import PropTypes from "prop-types"
import { connect } from "react-redux"
import { BasicModal, BasicForm } from "components"
import { Button } from "reactstrap"
import { SetTableColumns } from "redux/Entries/actions"
import { EntryPropType, TableColumnsPropType } from "redux/Entries/propTypes"
const COLUMN_INPUT_OPTIONS = Object.keys(EntryPropType)

const mapStateToProps = ({ Entries: { tableColumns } }) => ({ tableColumns })

const mapDispatchToProps = { SetTableColumns }

export const ButtonEditTableColumns = ({ tableColumns, SetTableColumns }) => {
  const [showEditModal, setShowEditModal] = useState(false)
  const handleEditTableColumns = useCallback((formPayload) => {
    const payload = Object.entries(formPayload).reduce((acc, [key, value]) => {
      if (value) acc.push(key)
      return acc
    }, [])
    SetTableColumns(payload)
    setShowEditModal(false)
  }, [])
  const handleCancel = useCallback(() => {
    setShowEditModal(false)
  }, [])

  const inputs = useMemo(
    () =>
      COLUMN_INPUT_OPTIONS.map((e) => ({
        label: e,
        name: e,
        type: "checkbox",
        defaultChecked: tableColumns.includes(e),
      })),
    [tableColumns]
  )

  const modalButton = useMemo(
    () => (
      <Button color="accent" onClick={() => setShowEditModal(true)}>
        <i className="fas fa-columns" />
      </Button>
    ),
    []
  )

  return (
    <BasicModal
      show={showEditModal}
      button={modalButton}
      title="Edit Table Columns"
      onSaveCallback={handleEditTableColumns}
      footer={null}
    >
      <BasicForm
        title="Forgot password"
        onSubmit={handleEditTableColumns}
        onCancel={handleCancel}
        inputs={inputs}
      />
    </BasicModal>
  )
}

ButtonEditTableColumns.propTypes = {
  tableColumns: TableColumnsPropType,
  SetTableColumns: PropTypes.func.isRequired,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ButtonEditTableColumns)
