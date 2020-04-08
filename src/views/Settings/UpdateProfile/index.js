import React, { useCallback, useMemo } from "react"
import PropTypes from "prop-types"
import { UserProps } from "../../../redux/User/propTypes"
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
  const inputs = useMemo(
    () => [
      {
        label: "Username",
        type: "text",
        name: "username",
        placeholder: "Username...",
        defaultValue: User.username,
        disabled: !User.id,
      },
      {
        label: "email",
        type: "email",
        name: "email",
        placeholder: "Email...",
        defaultValue: User.email,
        disabled: !User.id,
      },
      {
        label: "First name",
        type: "text",
        name: "first_name",
        placeholder: "First Name...",
        defaultValue: User.first_name,
        disabled: !User.id,
      },
      {
        label: "Last name",
        type: "text",
        name: "last_name",
        placeholder: "Last name...",
        defaultValue: User.last_name,
        disabled: !User.id,
      },
      {
        label: "Password",
        type: "password",
        name: "password",
        placeholder: "Password...",
        disabled: !User.id,
      },
      // {
      //   label: "Opt in",
      //   type: "radio",
      //   name: "opt_in",
      //   name: "opt_in",
      //   placeholder: "Opt in?",
      //   disabled: !User.id,
      // },
    ],
    [User]
  )
  return (
    <Container fluid className="m-1">
      <Row>
        <Col xs={12}>
          <BasicForm
            title="Update Profile"
            onSubmit={handleChangeUser}
            submitLabel="Update"
            inputs={inputs}
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

UpdateProfile.propTypes = {
  User: UserProps,
  UpdateUser: PropTypes.func.isRequired,
  DeleteAccount: PropTypes.func.isRequired,
}

UpdateProfile.defaultProps = {}

export default reduxConnect(mapStateToProps, mapDispatchToProps)(UpdateProfile)
