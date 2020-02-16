import React, { memo } from "react"
import { Row, Col } from "reactstrap"
import { useDispatch } from "react-redux"
import FacebookLogin from "react-facebook-login"
import GoogleLogin from "react-google-login"
import { SocialAuthenticationProviders } from "../../constants"
import { SocialAuthentication } from "../../redux/Actions/SocialAuthentication"
import "./styles.css"
const { REACT_APP_FACEBOOK_API, REACT_APP_GOOGLE_API } = process.env

const FacebookGoogleLogin = () => {
  const dispatch = useDispatch()
  const responseFacebook = response => {
    const {
      accessToken,
      data_access_expiration_time,
      email,
      expiresIn,
      id,
      name,
      picture,
      reauthorize_required_in,
      signedRequest,
      userID
    } = response
    const payload = {
      provider: SocialAuthenticationProviders.FACEBOOK,
      provider_id: id,
      access_token: accessToken,
      expires_in: expiresIn,
      expires_at: data_access_expiration_time,
      name,
      email,
      picture: picture.data.url
    }
    dispatch(SocialAuthentication(payload))
  }

  const responseGoogle = response => {
    const {
      El,
      tokenId,
      accessToken,
      profileObj: { email, familyName, givenName, googleId, imageUrl, name },
      tokenObj: {
        access_token,
        expires_at,
        expires_in,
        first_issued_at,
        id_token,
        idpId,
        login_hint,
        scope,
        session_state,
        token_type
      },
      // w3: { Eea, Paa, U3, ig, ofa, wea }
    } = response

    const payload = {
      provider: SocialAuthenticationProviders.GOOGLE,
      provider_id: El || googleId,
      access_token: id_token,
      expires_in,
      expires_at,
      name,
      email,
      picture: imageUrl
    }

    dispatch(SocialAuthentication(payload))
  }

  return (
    <Row className="FacebookGoogleLogin Container">
      <Col xs={12}>
        <div className="Seperator">
          <h1>or</h1>
        </div>
      </Col>
      <Col xs={{ size: 6 }}>
        <FacebookLogin
          appId={REACT_APP_FACEBOOK_API}
          autoLoad={false}
          fields="name,email,picture"
          callback={responseFacebook}
          disableMobileRedirect={true}
          cssClass="FacebookButton"
          textButton="Facebook"
          icon={<i className="fab fa-facebook-f" />}
        />
      </Col>
      <Col xs={{ size: 6 }}>
        <GoogleLogin
          clientId={REACT_APP_GOOGLE_API}
          render={renderProps => (
            <button
              className="GoogleButton"
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
            >
              <i className="fab fa-google" />
              Google
            </button>
          )}
          buttonText="Google"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={"single_host_origin"}
        />
      </Col>
    </Row>
  )
}

export default memo(FacebookGoogleLogin)
