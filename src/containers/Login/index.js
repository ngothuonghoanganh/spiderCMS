import React from 'react';
import { Redirect, Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import logIn from './actions';
import './Login.css';
import spider from '../../assets/img/spider-logo.png';
import Loading from '../../components/Loading';
import { clearMessage } from '../Register/actions';

class Login extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      remember: false,
    };
  }
  componentWillMount() {
    this.props.clearMessage();
  }
  onSelected = () => {
    this.setState({
      remember: !this.state.remember,
    });
  };
  onSubmit = (e) => {
    e.preventDefault();
    const { username, password, remember } = this.state;
    this.props.logIn(username, password, remember);
  };
  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };
  handleClick = () => {
    this.setState({
      remember: !this.state.remember,
    });
  };
  render() {
    const { username, password, remember } = this.state;
    const { isLogin, loading, logInResult } = this.props;
    if (isLogin.isLogin === 1) {
      return <Redirect to="/" />;
    }
    return (
      <div className="container d-flex" style={{ height: '100vh' }}>
        {loading && <Loading />}
        <div className="col-md-12 align-self-center p-0">
          <div className="w-form mx-auto">
            <form className="card my-card text-center" onSubmit={this.onSubmit}>
              <h1>
                <a className="navbar-brand">
                  <img
                    className="mr-0 mr-md-2 form-logo-img"
                    src={spider}
                    alt=""
                  />
                </a>
              </h1>
              <h2 className="splash-title">Sign In</h2>
              <span className="splash-description">
                Please enter your account.
              </span>
              <strong className="text-danger mt-1 formText">
                {logInResult.message}
              </strong>
              <div className="form-group mt-3">
                <input
                  required
                  onChange={this.handleChange}
                  value={username}
                  type="text"
                  className="form-control"
                  name="username"
                  placeholder="Username"
                />
              </div>
              <div className="form-group">
                <input
                  required
                  onChange={this.handleChange}
                  value={password}
                  title="8 characters minimum"
                  pattern=".{8,}"
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Password"
                />
              </div>
              <div className="form-group row login-tools">
                <div
                  className="col-6 login-remember"
                  onClick={this.handleClick}
                  style={{ cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    onChange={this.onSelected}
                    checked={remember}
                    className="mr-2"
                  />
                  <span className="formText">Remember Me</span>
                </div>
                <div className="col-6 login-forgot-password">
                  <Link className="color-1 formText" to="forgot">
                    Forgot Password?
                  </Link>
                </div>
              </div>
              <button type="submit" className="btn btn-orange">
                Sign In
              </button>
              <span className="mt-2 formText">
                Don't have an account?{' '}
                <Link className="color-1" to="signup">
                  Sign Up
                </Link>
              </span>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

Login.defaultProps = {
  isLogin: '',
};

Login.propTypes = {
  isLogin: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  logInResult: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  logIn: PropTypes.func,
  loading: PropTypes.bool,
  clearMessage: PropTypes.func,
};

const mapStateToProps = (state) => ({
  logInResult: state.logInResult,
  isLogin: state.logInResult.login,
  loading: state.logInResult.loading,
});
function mapDispatchToProps(dispatch) {
  return {
    logIn: bindActionCreators(logIn, dispatch),
    clearMessage: bindActionCreators(clearMessage, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Login);
