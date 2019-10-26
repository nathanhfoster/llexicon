import { ReduxActions } from "../constants";
import { Axios } from ".";
import qs from "qs";
import { UserLogin, CreateUser } from "./User";

const CreateSocialAuthentication = (UserPayload, SocialAuthenticationPayload) => dispatch =>
  Axios()
    .post("social-authentications/google/", qs.stringify(SocialAuthenticationPayload))
    .then(res => {
      dispatch({
        type: ReduxActions.USER_SET,
        payload: res.data
      });
    })
    .catch(e => console.log("CreateSocialAuthentication: ", e.response));

export { CreateSocialAuthentication };
