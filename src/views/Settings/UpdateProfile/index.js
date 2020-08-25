import React, { useCallback, useMemo } from "react"
import PropTypes from "prop-types"
import { UserProps } from "store/reducers/User/propTypes"
import { connect } from "store/provider"
import { BasicForm, ConfirmAction, ButtonClearCache } from "../../../components"
import { Container, Row, Col, ButtonGroup, Button } from "reactstrap"
import { UpdateUser, DeleteAccount } from "store/reducers/User/actions"
import { cleanObject } from "../../../utils"
import { RouteMap, RouterPush } from "store/reducers/router/actions"

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

  const handleSignUp = useCallback(() => {
    RouterPush(RouteMap.SIGNUP)
  }, [])
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
  return User.id ? (
    <Container>
      <Row className="mb-3">
        <Col xs={12}>
          <BasicForm
            title="Update Profile"
            onSubmit={handleChangeUser}
            submitLabel="Update"
            inputs={inputs}
          />
        </Col>
      </Row>
      <Row className="mb-3">
        <Col xs={12} className="Center">
          <ConfirmAction
            message="Are you sure you want to delete your account? Everything will be erased."
            onConfirm={handleDeleteAccount}
            disabled={!User.id}
            button={
              <Button color="danger">
                <i className="fas fa-trash-alt mr-1" />
                Delete Account and Clear Cache
              </Button>
            }
          />
        </Col>
      </Row>
    </Container>
  ) : (
    <ButtonGroup>
      <Button color="accent" onClick={handleSignUp}>
        Sign Up
      </Button>
      <ButtonClearCache />
    </ButtonGroup>
  )
}

UpdateProfile.propTypes = {
  User: UserProps,
  UpdateUser: PropTypes.func.isRequired,
  DeleteAccount: PropTypes.func.isRequired,
}

UpdateProfile.defaultProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(UpdateProfile)
