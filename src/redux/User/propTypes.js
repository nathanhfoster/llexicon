import PropTypes from 'prop-types'

export const SocialAuthenticationProps = PropTypes.shape({
  provider: PropTypes.string,
  provider_id: PropTypes.string,
  user: PropTypes.number,
  access_token: PropTypes.string,
  expires_in: PropTypes.string,
  expires_at: PropTypes.string,
  name: PropTypes.string,
  email: PropTypes.string,
  picture: PropTypes.string,
})
export const SocialAuthenticationsProps = PropTypes.arrayOf(SocialAuthenticationProps)

export const groupProps = PropTypes.number

export const groupsProps = PropTypes.arrayOf(groupProps)

export const userPermissionProps = PropTypes.number

export const userPermissionsProps = PropTypes.arrayOf(userPermissionProps)

export const settingsProps = PropTypes.shape({
  show_animated_background: PropTypes.bool,
  push_messages: PropTypes.bool,
  offline_mode: PropTypes.bool,
  id: PropTypes.number,
  user: PropTypes.number,
})

export const UserProps = PropTypes.shape({
  token: PropTypes.string,
  id: PropTypes.number,
  picture: PropTypes.string,
  username: PropTypes.string,
  email: PropTypes.string,
  first_name: PropTypes.string,
  last_name: PropTypes.string,
  is_superuser: PropTypes.bool,
  is_staff: PropTypes.bool,
  is_active: PropTypes.bool,
  last_login: PropTypes.string,
  opt_in: PropTypes.bool,
  date_joined: PropTypes.string,
  SocialAuthentications: SocialAuthenticationsProps,
  groups: groupsProps,
  user_permissions: userPermissionsProps,
  Settings: settingsProps,
  facebook_id: PropTypes.string,
  google_id: PropTypes.string,
  uploaded_picture: PropTypes.string,
})
