import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { FormGroup, Label, Input } from "reactstrap";
import { connect as reduxConnect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { RouterLinkPush } from "../../helpers/routing";
import { RouteMap } from "../../ReactRouter/routes";
import "./styles.css";

const mapStateToProps = ({}) => ({});

const mapDispatchToProps = {};

class RememberMeForgotPassword extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  static propTypes = {};

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

  render() {
    const { history, isLogin, onChange } = this.props;
    return (
      <FormGroup check>
        <Label check>
          <Input type="checkbox" name="rememberMe" onChange={onChange} />
          Keep me logged in
        </Label>

        <Link to={RouterLinkPush(history, RouteMap.PASSWORD_RESET)} className="float-right">
          Forgot password?
        </Link>
      </FormGroup>
    );
  }
}
export default withRouter(reduxConnect(mapStateToProps, mapDispatchToProps)(RememberMeForgotPassword));
