import React from 'react';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { get, isEmpty } from 'lodash';
import './AddUser.css';
import APIcaller from '../../utils/APIcaller';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadPosition, loadDepartment } from '../Department/helpers';
import { endpoint } from './../../constants/config';
import * as responses from '../../constants/response';
import * as messages from '../../constants/messages';
import Loading from '../../components/Loading';
import { getItemLocalStore } from '../../utils/handleLocalStore';
import { alertPopup } from '../../utils/alertPopup';
import errorHandler from '../../utils/handlerError';
import ListPermissions from '../../components/ListPermission';
import { constant } from '../../constants/constant';
import { Redirect } from 'react-router-dom';
const { createUser, assignPermission, assignRole } = constant.permissions;
class AddUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      avatar: '',
      loading: false,
      listRoles: [],
      listRolesProfile: [],
      allPermission: [],
    };
  }

  loadRoleData = async () => {
    const res = await APIcaller(`${endpoint.roles}`);
    const roleData = get(res, 'data.data');
    // console.log('res', res);

    const roleSpAdmin = 'superadmin';
    if (Array.isArray(roleData)) {
      return roleData.filter(({ rolename }) => rolename !== roleSpAdmin);
    }
    return [];
  };

  loadListPermissionsProfile = async (id) => {
    let result = [];
    const res = await APIcaller(
      `${endpoint.accountPermissionCurrent}?accountId=${id}`
    );
    const message = get(res, 'data.responseKey');
    if (message === responses.getListSuccess) {
      result = res.data.data.filter(
        ({ groupPermissionName }) =>
          groupPermissionName !== constant.groupPermissionSuperAdmin
      );
    } else {
      alertPopup('FAILD!!!!', errorHandler(message));
    }
    return result;
  };

  componentDidMount() {
    this.setState({ loading: true }, async () => {
      try {
        const listRoles = await this.loadRoleData();
        const listRolesProfile = listRoles
          .filter(({ rolename }) => rolename.toLowerCase() === 'user')
          .map(({ id }) => id);

        const accountId = getItemLocalStore('accountid');
        const allPermission = await this.loadListPermissionsProfile(accountId);
        this.setState({
          listRoles,
          allPermission,
          listRolesProfile,
          loading: false,
        });
      } catch (error) {
        console.log(error);
        this.setState({ loading: false });
      }
    });
  }

  onChange = ({ target: { name, type, check, value } }) => {
    this.setState({ [name]: type !== 'checkbox' ? value : check });
  };

  onImageDrop = (files) => {
    this.setState(
      {
        loading: true,
      },
      async () => {
        const formData = new FormData();
        formData.append('file', files[0]);
        formData.append('profileId', 'new');
        const res = await axios.post(
          `${endpoint.url}/${endpoint.image_upload}`,
          formData,
          {
            headers: {
              token: getItemLocalStore('token'),
              accountid: getItemLocalStore('accountid'),
            },
          }
        );

        const message = get(res, 'data.message');
        const imgData = get(res, 'data.data');
        if (imgData) {
          this.setState({
            avatar: imgData.url,
          });
        } else {
          alertPopup('FAILED!!!', errorHandler(message));
        }
        this.setState({ loading: false });
      }
    );
  };

  onSave = (e) => {
    e.preventDefault();
    const {
      username,
      password,
      email,
      confirmPassword,
      firstName,
      lastName,
      allPermission,
      phone,
      gender,
      avatar,
    } = this.state;
    const { history } = this.props;
    const ROLE = [3];
    try {
      if (password === confirmPassword) {
        this.setState({ loading: true }, async () => {
          const res = await APIcaller(
            `${endpoint.account}`,
            'POST',
            {},
            {
              username,
              password,
              email,
              roles: ROLE,
            }
          );

          const message = get(res, 'data.responseKey');

          if (message === responses.createSuccess) {
            if (res.data.data) {
              const id = get(res, 'data.data.profileId', null);
              const accountId = get(res, 'data.data.id', null);
              const resProfile = await APIcaller(
                `${endpoint.profileid}?profileId=${id}`,
                'PATCH',
                {},
                {
                  profileId: id,
                  accountId: id,
                  fields: {
                    firstName,
                    lastName,
                    gender,
                    phone,
                    haveAccount: 1,
                    avatar,
                  },
                }
              );

              const messageProfile = get(resProfile, 'data.responseKey');
              if (messageProfile === responses.updateSuccess) {
                let permissions = [];
                allPermission.forEach(
                  ({ isActive, permission, groupPermissionId }) => {
                    const permis = permission
                      .filter((permis) => permis.isActive === 1)
                      .map(({ id }) => id);
                    permissions.push(permis);
                    // if (isActive > 0) permissions.push(groupPermissionId);
                  }
                );
                permissions = permissions.flat();

                if (permissions.length) {
                  await APIcaller(
                    `${endpoint.accountPermission}`,
                    'POST',
                    {},
                    {
                      accountId,
                      permissions,
                    }
                  );
                }
                history.push(`/${endpoint.users}/${endpoint.view}/${id}`);
              } else {
                alertPopup('FAILED!!!!', errorHandler(messageProfile));
              }
            }
          } else {
            alertPopup('FAILED!!!!', errorHandler(message));
          }
          this.setState({ loading: false });
        });
      } else {
        alertPopup('FAILED!!!!', messages.ERROR_PASS);
      }
    } catch (error) {
      console.log(error);
    }
  };

  onReset = (e) => {
    e.preventDefault();
    this.setState({
      username: '',
      password: '',
      email: '',
      firstName: '',
      lastName: '',
      phone: '',
      gender: '',
      avatar: '',
    });
    const { history } = this.props;
    history.push(`/${endpoint.users}`);
  };

  onSubmitPermission = (allPermission) => {
    this.setState({ allPermission });
  };

  handelChangeRole = (e) => {
    const { listRolesProfile } = this.state;
    let newListRolesProfile = listRolesProfile;
    const { target } = e;
    const id = Number(target.value);
    const index = newListRolesProfile.indexOf(id);
    if (index > -1) {
      newListRolesProfile.splice(index, 1);
    } else {
      newListRolesProfile.push(id);
    }

    this.setState({
      listRolesProfile: [...newListRolesProfile],
    });
  };

  updateValue = (newValue) => {
    this.setState({ selectValue: newValue, maritalStatus: newValue });
  };

  mergeRoleGroupWithActive = (listroles = [], listRolesProfile = []) => {
    return listroles.map((role) => ({
      ...role,
      isUsing: listRolesProfile.includes(role.id),
    }));
  };

  showRole = (listroles = []) => {
    let result = [];
    const { listRolesProfile } = this.state;
    if (listroles.length) {
      result = listroles.map(({ rolename, id, isUsing }, index) => {
        return (
          <div className="form-check form-check-inline" key={index}>
            <label className="form-check-label">
              <input
                required={isEmpty(listRolesProfile)}
                key={index}
                type="checkbox"
                name={rolename}
                onChange={this.handelChangeRole}
                value={id}
                className="form-check-input"
                checked={isUsing}
              />
              {rolename}
            </label>
          </div>
        );
      });
    }
    return result;
  };

  render() {
    const {
      email,
      password,
      username,
      firstName,
      lastName,
      confirmPassword,
      avatar,
      loading,
      listRoles,
      listRolesProfile,
      allPermission,
    } = this.state;

    const listPermission = getItemLocalStore('listPermissions');

    if (listPermission.includes(createUser)) {
      return (
        <div className="container-fluid">
          <div className="form-add card-border-orange bg-white">
            <div className="card-header card-header-divider">
              <h3>User Information</h3>
              <span className="card-subtitle">
                Please fill out the form below completely
              </span>
            </div>
            <div className="wrap-form">
              <div className="row py-3">
                <div className="col-lg-4">
                  <Dropzone
                    className="dropzone-user"
                    onDrop={this.onImageDrop}
                    accept="image/jpeg,image/jpg,image/tiff,image/gif">
                    <span className="clickUp">Click to upload.</span>
                    {loading && <Loading />}
                    <img
                      alt=""
                      src={`${!avatar ? '#' : endpoint.url}/${
                        endpoint.imageTemp
                      }/${avatar}`}
                      className={!avatar ? 'hidden' : 'showimg'}
                    />
                  </Dropzone>
                </div>
                <div className="col-lg-8 personal-info">
                  <form className="form-horizontal" onSubmit={this.onSave}>
                    <div className="row form-group">
                      <label
                        htmlFor="firstName"
                        className="col-md-4 col-form-label ">
                        First name<strong className="text-danger"> *</strong>
                      </label>
                      <div className="col-md-8">
                        <input
                          required
                          type="text"
                          placeholder="Fist name"
                          className="form-control"
                          id="firstName"
                          name="firstName"
                          value={firstName}
                          onChange={this.onChange}
                        />
                      </div>
                    </div>
                    <div className="row form-group">
                      <label
                        htmlFor="lastName"
                        className="col-md-4 col-form-label ">
                        Last name<strong className="text-danger"> *</strong>
                      </label>
                      <div className="col-md-8">
                        <input
                          required
                          type="text"
                          placeholder="Last name"
                          className="form-control"
                          id="lastName"
                          name="lastName"
                          value={lastName}
                          onChange={this.onChange}
                        />
                      </div>
                    </div>
                    <div className="row form-group">
                      <label
                        htmlFor="userName"
                        className="col-md-4 col-form-label ">
                        Username<strong className="text-danger"> *</strong>
                      </label>
                      <div className="col-md-8">
                        <input
                          type="text"
                          placeholder="User Name"
                          className="form-control"
                          id="userName"
                          name="username"
                          value={username}
                          onChange={this.onChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="row form-group">
                      <label
                        htmlFor="inputEmail"
                        className="col-md-4 col-form-label "
                        placeholder="Email">
                        Email<strong className="text-danger"> *</strong>
                      </label>
                      <div className="col-md-8">
                        <input
                          type="email"
                          required
                          className="form-control"
                          id="inputEmail"
                          placeholder="Email"
                          name="email"
                          value={email}
                          onChange={this.onChange}
                        />
                      </div>
                    </div>
                    <div className="row form-group">
                      <label
                        htmlFor="password"
                        className="col-md-4 col-form-label ">
                        Password<strong className="text-danger"> *</strong>
                      </label>
                      <div className="col-md-8">
                        <input
                          id="password"
                          required
                          type="password"
                          placeholder="Password"
                          className="form-control"
                          name="password"
                          value={password}
                          onChange={this.onChange}
                          title="8 characters minimum"
                          pattern=".{8,}"
                        />
                      </div>
                    </div>
                    <div className="row form-group">
                      <label
                        htmlFor="confirmPassword"
                        className="col-md-4 col-form-label ">
                        Confirm Password
                        <strong className="text-danger"> *</strong>
                      </label>
                      <div className="col-md-8">
                        <input
                          required
                          id="confirmPassword"
                          type="password"
                          placeholder="Confirm Password"
                          className="form-control"
                          name="confirmPassword"
                          value={confirmPassword}
                          onChange={this.onChange}
                        />
                        {confirmPassword !== password && confirmPassword ? (
                          <strong className="text-danger">
                            Password does not match
                          </strong>
                        ) : (
                          ''
                        )}
                      </div>
                    </div>

                    {listPermission.includes(assignPermission) && (
                      <div className="row form-group">
                        <label className="col-md-4 col-form-label">
                          {' '}
                          Permissions
                        </label>
                        <div className="col-md-8 pt-2">
                          <div className="button-group">
                            {!!allPermission.length && (
                              <ListPermissions
                                permissions={allPermission}
                                onSubmitPermission={this.onSubmitPermission}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    {listPermission.includes(assignRole) && (
                      <div className="row form-group">
                        <label className="col-md-4 col-form-label ">
                          Roles
                          <strong className="text-danger"> *</strong>
                        </label>
                        <div className="col-md-8 pt-2">
                          {this.showRole(
                            this.mergeRoleGroupWithActive(
                              listRoles,
                              listRolesProfile
                            )
                          )}
                        </div>
                      </div>
                    )}
                    <div className="form-group row">
                      <label className="col-md-4 control-label"></label>
                      <div className="col-md-8">
                        <button type="submit" className="btn btn-orange">
                          Save
                        </button>
                        <button
                          onClick={this.onReset}
                          className="btn btn-secondary ml-3">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return <Redirect to="/" />;
  }
}
AddUser.defaultProps = {
  loadPosition: null,
};
const mapStateToProps = (state) => ({
  listPosition: state.positionData.positions,
});
const mapDispatchToProps = (dispatch) => ({
  loadDepartment: bindActionCreators(loadDepartment, dispatch),
  loadPosition: bindActionCreators(loadPosition, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(AddUser);
