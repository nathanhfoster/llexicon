import React from "react"
import PropTypes from "prop-types"
import { BasicForm } from "../../../components"
import { connect as reduxConnect } from "react-redux"
import { UpdateUser } from "../../../redux/User/actions"

const mapStateToProps = ({ User }) => ({
  User
})

const mapDispatchToProps = {
  UpdateUser
}

const UpdateProfile = ({ User, UpdateUser }) => {
  const handleChangeUser = payload => UpdateUser(payload)
  return (
    <BasicForm
      title="Update Profile"
      onSubmit={handleChangeUser}
      submitLabel="Update"
      inputs={[
        {
          label: "Username",
          type: "text",
          id: "username",
          placeholder: "Username...",
          defaultValue: User.username
        },
        {
          label: "email",
          type: "email",
          id: "email",
          placeholder: "Email...",
          defaultValue: User.email
        },
        {
          label: "First name",
          type: "text",
          id: "first_name",
          placeholder: "First Name...",
          defaultValue: User.first_name
        },
        {
          label: "Last name",
          type: "text",
          id: "last_name",
          placeholder: "Last name...",
          defaultValue: User.last_name
        },
        {
          label: "Password",
          type: "password",
          id: "password",
          placeholder: "Password..."
        }
        // {
        //   label: "Opt in",
        //   type: "radio",
        //   name: "opt_in",
        //   id: "opt_in",
        //   placeholder: "Opt in?"
        // }
      ]}
    />
  )
}

UpdateProfile.propTypes = { UpdateUser: PropTypes.func.isRequired }

UpdateProfile.defaultProps = {}

export default reduxConnect(mapStateToProps, mapDispatchToProps)(UpdateProfile)
