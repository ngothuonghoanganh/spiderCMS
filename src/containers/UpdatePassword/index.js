import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import updatePassword from './actions';
import spider from '../../assets/img/spider-logo.png';

class UpdatePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      password: '',
      confirm: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  onSubmit(e) {
    e.preventDefault();
    const { password, confirm } = this.state;
    const { username } = this.props;
    if (password === confirm) {
      this.props.updatePassword(username, password);
    }
  }
  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }
  render() {
    const { password, confirm } = this.state;
    const { updatePass } = this.props;

    if (updatePass.updateSuccess) {
      return <Redirect to="/signin" />;
    }
    return (
      <div className="container d-flex" style={{ height: '100vh' }}>
        <div className="col-md-12 align-self-center p-0">
          <div className="w-form mx-auto">
            <form className="card my-card text-center" onSubmit={this.onSubmit}>
              <h1>
                <a className="navbar-brand">
                  <img className="mr-0 mr-md-2 form-logo-img" src={spider} alt="" />
                </a>
              </h1>
              <h2 className="splash-title">Update Account</h2>
              <strong className="text-danger mt-2">
                { (password && confirm) && (password !== confirm)
                  ? 'Password does not match'
                  : updatePass.message
                }
              </strong>
              <div className="form-group" style={{ marginTop: '6%' }}>
                <input
                  required
                  onChange={this.handleChange}
                  title="8 characters minimum"
                  pattern=".{8,}"
                  type="password"
                  className="form-control"
                  value={password}
                  name="password"
                  placeholder="New password"
                />
              </div>
              <div className="form-group">
                <input
                  required
                  onChange={this.handleChange}
                  type="password"
                  className="form-control"
                  value={confirm}
                  name="confirm"
                  placeholder="Confirm password"
                />
              </div>
              <button type="submit" className="btn btn-orange">Save</button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

UpdatePassword.propTypes = {
  updatePass: PropTypes.any,
  username: PropTypes.string,
  updatePassword: PropTypes.func,
};

const mapStateToProps = (state) => ({
  updatePass: state.updatePass,
  username: state.checkForgot.forgot.username,
});

function mapDispatchToProps(dispatch) {
  return {
    updatePassword: bindActionCreators(updatePassword, dispatch),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdatePassword);
