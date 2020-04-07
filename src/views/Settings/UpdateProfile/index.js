import React, { useCallback, useMemo } from "react"
import PropTypes from "prop-types"
import { connect as reduxConnect } from "react-redux"
import { BasicForm, ConfirmAction } from "../../../components"
import { Container, Row, Col } from "reactstrap"
import { UpdateUser, DeleteAccount } from "../../../redux/User/actions"
import { cleanObject } from "../../../helpers"

const mapStateToProps = ({ User }) => ({
  User,
})

const mapDispatchToProps = {
  UpdateUser,
  DeleteAccount,
}

const UpdateProfile = ({ User, UpdateUser, DeleteAccount }) => {
  const handleChangeUser = useCallback((payload) => {
    UpdateUser(cleanObject(payload, true))
  }, [])
  const handleDeleteAccount = useCallback(() => DeleteAccount(), [])
  const updateProfileInputs = useMemo(
    () => [
      {
        label: "Username",
        type: "text",
        id: "username",
        placeholder: "Username...",
        defaultValue: User.username,
      },
      {
        label: "email",
        type: "email",
        id: "email",
        placeholder: "Email...",
        defaultValue: User.email,
      },
      {
        label: "First name",
        type: "text",
        id: "first_name",
        placeholder: "First Name...",
        defaultValue: User.first_name,
      },
      {
        label: "Last name",
        type: "text",
        id: "last_name",
        placeholder: "Last name...",
        defaultValue: User.last_name,
      },
      {
        label: "Password",
        type: "password",
        id: "password",
        placeholder: "Password...",
      },
      // {
      //   label: "Opt in",
      //   type: "radio",
      //   name: "opt_in",
      //   id: "opt_in",
      //   placeholder: "Opt in?"
      // }
    ],
    []
  )
  return (
    <Container fluid className="m-1">
      <Row>
        <Col xs={12}>
          <BasicForm
            title="Update Profile"
            onSubmit={handleChangeUser}
            submitLabel="Update"
            inputs={updateProfileInputs}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12}>
          <ConfirmAction
            title="Delete Account"
            message="Are you sure you want to delete your account? Everything will be erased."
            onConfirm={handleDeleteAccount}
            disabled={!User.id}
          />
        </Col>
      </Row>
    </Container>
  )
}

UpdateProfile.propTypes = { UpdateUser: PropTypes.func.isRequired }

UpdateProfile.defaultProps = {}

export default reduxConnect(mapStateToProps, mapDispatchToProps)(UpdateProfile)
