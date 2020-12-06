import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import forgot from './actions';
import spider from '../../assets/img/spider-logo.png';
import { clearMessage } from '../Register/actions';

class ForgotPassword extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
    };
  }
  componentWillMount() {
    this.props.clearMessage();
  }
  onSubmit = (e) => {
    e.preventDefault();
    const { email } = this.state;
    this.props.forgot(email);
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  render() {
    const { email } = this.state;
    const { checkForgot } = this.props;

    if (checkForgot.isTrue) {
      return <Redirect to="/update-account" />;
    }

    return (
      <div className="container d-flex" style={{ height: '100vh' }}>
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
              <h2 className="splash-title">Forgot Password</h2>
              <span className="splash-description">
                Please enter your email.
              </span>
              <strong className="text-danger pt-2">
                {checkForgot.message}
              </strong>
              <div className="form-group mt-3">
                <input
                  required
                  onChange={this.handleChange}
                  value={email}
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Email"
                />
              </div>
              <button type="submit" className="btn btn-orange">
                Reset Password
              </button>
              <Link to="/signin" className="mt-2 text-right color-1 formText">
                Return to Sign In
              </Link>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

ForgotPassword.propTypes = {
  checkForgot: PropTypes.any,
  forgot: PropTypes.func,
  clearMessage: PropTypes.func,
};

const mapStateToProps = (state) => ({
  checkForgot: state.checkForgot,
});
function mapDispatchToProps(dispatch) {
  return {
    forgot: bindActionCreators(forgot, dispatch),
    clearMessage: bindActionCreators(clearMessage, dispatch),
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
