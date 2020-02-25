import { UserActionTypes } from "../User/types"
import { Axios } from "../Actions"
import qs from "qs"
import { RefreshPatchUser } from "../User/actions"

const SocialAuthentication = payload => dispatch => {
  const { provider_id } = payload
  Axios()
    .post(
      `social-authentications/${provider_id}/provider/`,
      qs.stringify(payload)
    )
    .then(({ data }) => {
      const { token, id } = data
      dispatch(RefreshPatchUser(token, id))
      dispatch({
        type: UserActionTypes.USER_SET,
        payload: data
      })
      return data
    })
    .catch(e => console.log("SocialAuthentication: ", e.response))
}

export { SocialAuthentication }
