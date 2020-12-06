import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import register, { clearMessage } from './actions';
import spider from '../../assets/img/spider-logo.png';
import Loading from '../../components/Loading';
class Register extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      confirm: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  componentWillMount() {
    this.props.clearMessage();
  }
  onSubmit(e) {
    e.preventDefault();
    const { username, email, password } = this.state;
    this.setState({
      username: '',
      email: '',
      password: '',
      confirm: '',
    });
    this.props.register(username, email, password);
  }
  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }
  render() {
    const {
      username, email, password, confirm,
    } = this.state;
    const { isRegistered, loading, message } = this.props;
    if (isRegistered) {
      window.location.href = '/register-success';
    }
    return (
      <div className="container d-flex" style={{ height: '100vh' }}>
        { (loading) &&
        <Loading />
        }
        <div className="col-md-12 align-self-center p-0">
          <div className="w-form mx-auto">
            <form className="card my-card text-center" onSubmit={this.onSubmit}>
              <h1>
                <a className="navbar-brand">
                  <img className="mr-0 mr-md-2 form-logo-img" src={spider} alt="" />
                </a>
              </h1>
              <h2 className="splash-title">Sign Up</h2>
              <span className="splash-description">Please enter your information.</span>
              <strong className="text-danger mt-1">
                { (password && confirm) && (password !== confirm) ? 'Password does not match' : message}
              </strong>
              <div className="form-group mt-3">
                <input
                  required
                  onChange={this.handleChange}
                  type="text"
                  className="form-control"
                  value={username}
                  name="username"
                  placeholder="Username"
                />
              </div>
              <div className="form-group">
                <input
                  required
                  onChange={this.handleChange}
                  type="email"
                  className="form-control"
                  value={email}
                  name="email"
                  placeholder="Email"
                />
              </div>
              <div className="form-row">
                <div className="form-group col-md-6">
                  <input
                    required
                    onChange={this.handleChange}
                    title="8 characters minimum"
                    pattern=".{8,}"
                    type="password"
                    className="form-control"
                    value={password}
                    name="password"
                    placeholder="Password"
                  />
                </div>
                <div className="form-group col-md-6">
                  <input
                    required
                    onChange={this.handleChange}
                    title="8 characters minimum"
                    pattern=".{8,}"
                    type="password"
                    className="form-control"
                    value={confirm}
                    name="confirm"
                    placeholder="Confirm"
                  />
                </div>
              </div>
              <button type="submit" className="btn btn-orange">Sign Up</button>
              <span className="mt-2 formText">Already have an account? <Link className="color-1" to="/signin">Sign In</Link></span>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

Register.defaultProps = {
  isRegistered: '',
  message: '',
};

Register.propTypes = {
  isRegistered: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.string,
  ]),
  message: PropTypes.string,
  register: PropTypes.func,
  loading: PropTypes.bool,
  clearMessage: PropTypes.func,
};

const mapStateToProps = (state) => ({
  isRegistered: state.createUser.isRegistered,
  message: state.createUser.message,
  loading: state.createUser.loading,
  loginResult: state.loginResult,
});

function mapDispatchToProps(dispatch) {
  return {
    register: bindActionCreators(register, dispatch),
    clearMessage: bindActionCreators(clearMessage, dispatch),
  };
}
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Register);
