import { ReduxActions } from "../constants";
import { Axios } from ".";
import qs from "qs";

const GetUserSettings = (token, UserId) => dispatch =>
  Axios(token)
    .get(`user/settings/${UserId}/view/`)
    .then(res => {
      dispatch({
        type: ReduxActions.USER_SET_SETTINGS,
        payload: res.data
      });
    })
    .catch(e => console.log(e));

const PostSettings = (token, payload) => dispatch =>
  Axios(token)
    .post(`user/settings/`, qs.stringify(payload))
    .then(res => {
      dispatch({
        type: ReduxActions.USER_SET_SETTINGS,
        payload: res.data
      });
    })
    .catch(e =>
      dispatch({
        type: ReduxActions.SET_API_RESPONSE,
        payload: e.response
      })
    );

const SetSettings = (token, id, payload) => dispatch =>
  Axios(token)
    .patch(`user/settings/${id}/`, qs.stringify(payload))
    .then(res => {
      dispatch({
        type: ReduxActions.USER_SET_SETTINGS,
        payload: res.data
      });
    })
    .catch(e =>
      dispatch({
        type: ReduxActions.SET_API_RESPONSE,
        payload: e.response
      })
    );

export { GetUserSettings, PostSettings, SetSettings };
