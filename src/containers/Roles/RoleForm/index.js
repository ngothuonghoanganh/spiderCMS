// Import From Node_Module
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { get } from 'lodash';
// Import form file
import {
  fetchOneRoleByName,
  addRole,
  updateRole as editRole,
} from './../actions';
import { alertPopup } from './../../../utils/alertPopup';
import { getItemLocalStore } from '../../../utils/handleLocalStore';
import * as constants from './../constants';
import Loading from './../../../components/Loading';
import { constant } from '../../../constants/constant';
import { Redirect } from 'react-router-dom';
const { updateRole, createRole } = constant.permissions;
class RoleForm extends React.Component {
  // Constructor
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      rolename: '',
      description: '',
      rolelabel: '',
      defaultState: null,
      loading: false,
    };
  }
  // Component Did Mount
  componentWillMount() {
    const { history, match, fetchOneRoleByName } = this.props;
    if (!this.isAllow()) {
      history.push('/roles');
    }
    const rolename = get(match, 'params.rolename');
    if (rolename) {
      this.setState({
        loading: true,
      });
      fetchOneRoleByName(rolename, (callback, data = {}) => {
        if (callback) {
          this.setState({
            defaultState: data,
            loading: false,
            ...data,
          });
        }
      });
    }
  }

  // Event Change Input Value
  onChange = ({ target: { name, value, checked } }) => {
    value = name === 'checkbox' ? checked : value;
    this.setState({ [name]: value });
  };

  // Event Submit Form
  onSubmit = (e) => {
    e.preventDefault();
    const { id, rolename, description, defaultState, label } = this.state;
    const { addRole, editRole, history } = this.props;
    if (!rolename) {
      alertPopup('WARNING !!!', 'Your Role Name is empty !!! ');
    } else if (!id) {
      this.setState({
        loading: false,
      });
      addRole(this.state, (callback, title = '', message = '') => {
        if (callback) {
          history.push('/roles');
        } else {
          alertPopup(title, message);
        }
      });
    } else {
      let data = {};
      if (rolename !== get(defaultState, 'rolename')) {
        data = {
          roleId: id,
          fields: {
            rolename,
            description,
            label,
          },
        };
      } else {
        data = {
          roleId: id,
          fields: {
            description,
            label,
          },
        };
      }
      this.setState({
        loading: false,
      });

      editRole(data, (callback, title = '', message = '') => {
        if (callback) {
          history.push('/roles');
        } else {
          alertPopup(title, message);
        }
      });
    }
  };
  // Click Reset Button
  onReset = () => {
    const { defaultState } = this.state;
    if (defaultState) {
      this.setState(defaultState);
    } else {
      this.setState({
        rolename: '',
        description: '',
        label: '',
      });
    }
  };

  // Check Permission
  checkPer = (permission) => {
    const { listPermissions } = this.props;
    return listPermissions && listPermissions.indexOf(permission) >= 0;
  };

  // onCancel = () => {
  //   console.log(this.props);
  //   //history.push('/roles');
  // };

  // Redirect Page
  isAllow = () =>
    this.checkPer(constants.PER_CREATE_ROLE) ||
    (this.checkPer(constants.PER_UPDATE_ROLE) &&
      get(this.props.match, 'params.rolename'));

  render() {
    const { rolename, description, loading, label } = this.state;
    const { match, listPermissions } = this.props;
    return (
      <div className="container-fluid">
        {listPermissions.includes(createRole) ||
        listPermissions.includes(updateRole) ? (
          <div className="form-add card-border-orange bg-white">
            <div className="card-header card-header-divider">
              <h3>
                {match.url === '/roles/superadmin/edit-role'
                  ? 'Edit Role'
                  : 'Role Information'}
              </h3>
              <span className="card-subtitle">
                Please fill out the form below completely
              </span>
            </div>

            {loading && <Loading />}
            <div className="wrap-form mt-4">
              <form
                className="form-horizontal"
                onReset={this.onReset}
                onSubmit={this.onSubmit}>
                <div className="row form-group mt-3">
                  <label
                    htmlFor="rolename"
                    className="col-4 col-md-2 col-form-label">
                    Role Name<strong className="text-danger"> *</strong>
                  </label>
                  <div className="col-md-8">
                    <input
                      type="text"
                      className="form-control"
                      id="rolename"
                      placeholder="Role Name"
                      name="rolename"
                      value={rolename}
                      onChange={this.onChange}
                      required
                    />
                  </div>
                </div>
                <div className="row form-group mt-3">
                  <label
                    htmlFor="label"
                    className="col-4 col-md-2 col-form-label">
                    Role Label<strong className="text-danger"> *</strong>
                  </label>
                  <div className="col-md-8">
                    <input
                      type="text"
                      className="form-control"
                      id="label"
                      placeholder="Role Label"
                      name="label"
                      value={label}
                      onChange={this.onChange}
                      required
                    />
                  </div>
                </div>
                <div className="row form-group mt-3">
                  <label
                    htmlFor="description"
                    className="col-4 col-md-2 col-form-label">
                    Description
                  </label>
                  <div className="col-md-8">
                    <textarea
                      className="form-control"
                      id="description"
                      placeholder="Role Description"
                      name="description"
                      rows="4"
                      value={description}
                      onChange={this.onChange}
                    />
                  </div>
                </div>
                <div className="row form-group pb-5 pt-3">
                  <label className="col-4 col-md-2 control-label"></label>
                  <div className="col-md-8">
                    <button type="submit" className="btn btn-orange">
                      Save
                    </button>
                    <button
                      type="reset"
                      className="btn btn-secondary ml-3"
                      // onClick={this.onCancel()}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <Redirect to="/" />
        )}
      </div>
    );
  }
}

RoleForm.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object,
  listPermissions: PropTypes.array.isRequired,
  addRole: PropTypes.func.isRequired,
  editRole: PropTypes.func.isRequired,
};

const mapStateToProps = () => ({
  listPermissions: getItemLocalStore('listPermissions'),
});

const mapDispatchToProps = (dispatch) => ({
  fetchOneRoleByName: bindActionCreators(fetchOneRoleByName, dispatch),
  addRole: bindActionCreators(addRole, dispatch),
  editRole: bindActionCreators(editRole, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(RoleForm);
