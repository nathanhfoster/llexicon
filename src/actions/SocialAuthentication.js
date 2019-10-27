import { ReduxActions } from "../constants"
import { Axios } from "."
import qs from "qs"
import { RefreshPatchUser } from "./User"
import { GetUserSettings } from "./Settings"

const SocialAuthentication = payload => dispatch => {
  const { provider_id } = payload
  Axios()
    .post(
      `social-authentications/${provider_id}/provider/`,
      qs.stringify(payload)
    )
    .then(res => {
      const { token, id } = res.data
      dispatch(RefreshPatchUser(token, id))
      dispatch({
        type: ReduxActions.USER_SET,
        payload: res.data
      })
    })
    .catch(err => console.log("SocialAuthentication: ", err))
}

export { SocialAuthentication }
