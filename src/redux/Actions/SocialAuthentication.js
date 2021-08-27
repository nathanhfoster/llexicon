import  actions  from '../actionTypes'
import { Axios } from '../Actions'
import qs from 'qs'
import { RefreshPatchUser } from '../User/actions'

export const SocialAuthentication = payload => dispatch => {
  const { provider_id } = payload
  Axios()
    .post(`social-authentications/${provider_id}/provider/`, qs.stringify(payload))
    .then(({ data }) => {
      const { id } = data
      dispatch(RefreshPatchUser(id))
      dispatch({
        type: actions.USER_SET,
        payload: data,
      })
      return data
    })
    .catch(e => console.log('SocialAuthentication: ', e))
}
