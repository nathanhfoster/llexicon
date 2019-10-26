import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Row, Col } from "reactstrap";
import { connect as reduxConnect } from "react-redux";
import FacebookLogin from "react-facebook-login";
import GoogleLogin from "react-google-login";
import { SocialAuthenticationProviders } from "../../constants";
import { SocialAuthentication } from "../../actions/SocialAuthentication";
import "./styles.css";
const { REACT_APP_FACEBOOK_API, REACT_APP_GOOGLE_API } = process.env;

const mapStateToProps = ({ User }) => ({ User });

const mapDispatchToProps = { SocialAuthentication };

class FacebookGoogleLogin extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static propTypes = {
    SocialAuthentication: PropTypes.func.isRequired
  };

  static defaultProps = {};

  componentWillMount() {
    this.getState(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.getState(nextProps);
  }

  getState = props => {
    this.setState({});
  };

  responseFacebook = response => {
    const { SocialAuthentication } = this.props;
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
    } = response;
    const payload = {
      provider: SocialAuthenticationProviders.FACEBOOK,
      provider_id: id,
      access_token: accessToken,
      expires_in: expiresIn,
      expires_at: data_access_expiration_time,
      name,
      email,
      picture: picture.data.url
    };
    SocialAuthentication(payload);
  };

  responseGoogle = response => {
    const { SocialAuthentication } = this.props;
    const { El, tokenId, accessToken, profileObj, tokenObj, w3 } = response;
    const { email, familyName, givenName, googleId, imageUrl, name } = profileObj;
    const {
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
    } = tokenObj;
    const { Eea, Paa, U3, ig, ofa, wea } = w3;
    const payload = {
      provider: SocialAuthenticationProviders.GOOGLE,
      provider_id: El || googleId,
      access_token: id_token,
      expires_in,
      expires_at,
      name,
      email,
      picture: imageUrl
    };
    SocialAuthentication(payload);
  };

  render() {
    const { isLogin } = this.props;
    const Header = isLogin ? "Sign In with" : "Sign Up with";
    return (
      <Row className="FacebookGoogleLogin Container">
        <Col xs={12}>
          <div class="Seperator">
            <h1>or</h1>
          </div>
        </Col>
        <Col xs={12} className="Header Center">
          <h3>{Header}</h3>
        </Col>
        <Col xs={{ size: 6 }}>
          <FacebookLogin
            appId={REACT_APP_FACEBOOK_API}
            autoLoad={false}
            fields="name,email,picture"
            callback={this.responseFacebook}
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
              <button className="GoogleButton" onClick={renderProps.onClick} disabled={renderProps.disabled}>
                <i className="fab fa-google" />
                Google
              </button>
            )}
            buttonText="Google"
            onSuccess={this.responseGoogle}
            onFailure={this.responseGoogle}
            cookiePolicy={"single_host_origin"}
          />
        </Col>
      </Row>
    );
  }
}
export default reduxConnect(mapStateToProps, mapDispatchToProps)(FacebookGoogleLogin);
