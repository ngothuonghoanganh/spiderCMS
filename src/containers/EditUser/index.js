import React from 'react';
import Dropzone from 'react-dropzone';
import axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import { get, isEmpty } from 'lodash';
import moment from 'moment';
import { connect } from 'react-redux';
import * as responses from '../../constants/response';
import './index.css';
import { endpoint } from './../../constants/config';
import ListPermissions from '../../components/ListPermission';
import Loading from '../../components/Loading';
import { constant } from '../../constants/constant';
import {
  handleLocalStore,
  handlerError as errorHandler,
  APIcaller,
  popup,
} from '../../utils';
const { getItemLocalStore } = handleLocalStore;
const { alertPopup } = popup;
const {
  updateEmployee,
  updateUser,
  assignPermission,
  assignRole,
} = constant.permissions;
class EditUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      avatar: '',
      loading: false,
      firstName: '',
      lastName: '',
      email: '',
      startDate: '',
      accountId: '',
      userName: '',
      temp: '',
      listRolesProfile: '',
      allPermission: [],
    };
  }

  loadRoleData = async () => {
    const res = await APIcaller(`${endpoint.roles}`);
    const roleData = get(res, 'data.data');
    const roleSpAdmin = 'superadmin';
    // console.log('roleData', res);

    if (Array.isArray(roleData)) {
      return roleData.filter(({ rolename }) => rolename !== roleSpAdmin);
    }
    return [];
  };

  loadProfileData = async (id) => {
    let result = {};
    const res = await APIcaller(`${endpoint.profileid}?profileId=${id}`);
    // console.log(res);
    const message = get(res, 'data.responseKey');
    if (message === responses.getOneSuccess) {
      const profileData = get(res, 'data.data');
      const tempAvatarUrl = `avatar/${profileData.avatar}`;
      const {
        account: { username, id },
      } = profileData;
      result = {
        ...profileData,
        userName: username,
        temp: username,
        accountId: id,
        urlImageTemp: tempAvatarUrl,
        startDate: get(profileData, 'startDate')
          ? moment(profileData.startDate)
          : '',
      };
    } else if (message === 'authen') {
      window.location.href = '/signin';
    } else if (message === responses.noPermission) {
      this.props.history.push('/');
    } else {
      alertPopup('FAILED!!!!!', message);
    }
    return result;
  };

  loadListRolesProfile = async (id) => {
    let result = [];
    const res = await APIcaller(`${endpoint.accountRole}?accountId=${id}`);
    console.log(res);
    const message = get(res, 'data.responseKey');
    if (message === responses.getListSuccess) {
      result = res.data.data;
    } else {
      alertPopup('FAILD!!!!', errorHandler(message));
    }
    return result;
  };

  loadListPermissionsProfile = async (id) => {
    let result = [];
    const res = await APIcaller(
      `${endpoint.accountPermissionCurrent}?accountId=${id}`
    );
    // console.log(res);

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
    const list = this.props;
    const id = get(list, 'match.params.id');
    this.setState({ loading: true }, async () => {
      try {
        const listRoles = await this.loadRoleData();
        const profileData = await this.loadProfileData(id);
        const { accountId } = profileData;
        const listRolesProfile = await this.loadListRolesProfile(accountId);
        const allPermission = await this.loadListPermissionsProfile(accountId);
        this.setState({
          listRoles,
          ...profileData,
          listRolesProfile,
          allPermission,
          loading: false,
        });
      } catch (error) {
        console.log(error);
      }
    });
  }

  onChange = ({ target: { name, value, type, checked } }) => {
    this.setState({ [name]: type === 'checkbox' ? checked : value });
  };

  onImageDrop = (files) => {
    this.setState(
      {
        loading: true,
      },
      async () => {
        const list = this.props;
        const idProfile = list.match.params.id;
        const formData = new FormData();
        formData.append('profileId', idProfile);
        formData.append('file', files[0]);
        // Make an AJAX upload request using Axios
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
        const data = get(res, 'data.data');
        if (data) {
          const temp = `temp/${data.url}`;
          this.setState({
            avatar: data.url,
            urlImageTemp: temp,
          });
        }
        this.setState({ loading: false });
      }
    );
  };

  onSave = (e) => {
    e.preventDefault();
    const {
      firstName,
      lastName,
      email,
      startDate,
      avatar,
      accountId,
      userName,
      temp,
      listRolesProfile,
      allPermission,
    } = this.state;

    if (temp !== userName) {
      APIcaller(
        `${endpoint.updateUser}`,
        'PATCH',
        {},
        {
          accountId,
          roles: listRolesProfile,
          fields: {
            username: userName,
          },
        }
      );
    } else {
      APIcaller(
        `${endpoint.accountRole}`,
        'POST',
        {},
        {
          accountId,
          roles: listRolesProfile,
        }
      );
    }

    let permissions = [];
    allPermission.forEach(({ isActive, permission, groupPermissionId }) => {
      const permis = permission
        .filter((permis) => permis.isActive === 1)
        .map(({ id }) => id);
      permissions.push(permis);
      // if (isActive > 0) permissions.push(groupPermissionId);
    });
    permissions = permissions.flat();

    if (permissions.length) {
      APIcaller(
        `${endpoint.accountPermission}`,
        'POST',
        {},
        {
          accountId,
          permissions,
        }
      );
    }

    const list = this.props;
    const { history } = this.props;

    APIcaller(
      `${endpoint.profileid}`,
      'PATCH',
      {},
      {
        profileId: list.match.params.id,
        fields: {
          firstName,
          lastName,
          email,
          avatar,
          startDate,
        },
      }
    ).then((res) => {
      const message = get(res, 'data.responseKey');
      const id = get(res, 'data.data.id');
      if (message !== responses.objExisted) {
        history.push(`/${endpoint.users}/${endpoint.view}/${id}`);
      } else {
        alertPopup('FAILD!!!!', errorHandler(message));
      }
    });
  };

  mergeRoleGroupWithActive = (listroles = [], listRolesProfile = []) => {
    return listroles.map((role) => ({
      ...role,
      isUsing: listRolesProfile.includes(role.id),
    }));
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

  handelChangePermission = (allPermission) => {
    this.setState({ allPermission });
  };

  render() {
    const {
      firstName,
      lastName,
      email,
      avatar,
      urlImageTemp,
      loading,
      listRoles,
      listRolesProfile,
      allPermission,
    } = this.state;
    const listPermission = getItemLocalStore('listPermissions');
    const userID = getItemLocalStore('userData.profileId');
    const list = this.props;
    const idProfile = list.match.params.id;
    const checkListPermissionForRendering =
      listPermission.includes(updateUser) ||
      listPermission.includes(updateEmployee);

    return (
      <div className="container-fluid">
        {checkListPermissionForRendering ? (
          <div className="form-add card-border-orange bg-white">
            <div className="card-header card-header-divider">
              <h3>Edit Information</h3>
              <span className="card-subtitle">
                Please fill out the form below completely
              </span>
            </div>
            <div className="wrap-form">
              <div className="row">
                <div className="col-lg-4">
                  <Dropzone
                    className="dropzone-user"
                    onDrop={this.onImageDrop}
                    accept="image/*">
                    <span className="clickUp">Click to upload.</span>
                    {loading && <Loading />}
                    <img
                      alt=""
                      src={`${!avatar ? '#' : endpoint.url}/${
                        endpoint.image
                      }/${urlImageTemp}`}
                      className={!avatar ? 'hidden' : 'showimg'}
                    />
                  </Dropzone>
                </div>
                <div className="col-lg-8 personal-info">
                  <form className="form-horizontal" onSubmit={this.onSave}>
                    <div className="row form-group mt-3">
                      <label
                        htmlFor="firstname"
                        className="col-md-4 col-form-label">
                        First Name
                      </label>
                      <div className="col-md-8">
                        <input
                          id="firstname"
                          type="text"
                          className="form-control"
                          placeholder="Fist Name"
                          name="firstName"
                          value={firstName}
                          onChange={this.onChange}
                        />
                      </div>
                    </div>
                    <div className="row form-group mt-3">
                      <label
                        htmlFor="lastname"
                        className="col-md-4 col-form-label">
                        Last Name
                      </label>
                      <div className="col-md-8">
                        <input
                          id="lastname"
                          type="text"
                          className="form-control"
                          placeholder="Last Name"
                          name="lastName"
                          value={lastName}
                          onChange={this.onChange}
                        />
                      </div>
                    </div>
                    {/* <div className="row form-group mt-3">
                      <label
                        htmlFor="userName"
                        className="col-md-4 col-form-label">
                        Username<strong className="text-danger"> *</strong>
                      </label>
                      <div className="col-md-8">
                        <input
                          required
                          id="userName"
                          type="text"
                          className="form-control"
                          name="userName"
                          value={userName}
                          onChange={this.onChange}
                        />
                      </div>
                    </div> */}
                    <div className="row form-group">
                      <label
                        htmlFor="email"
                        className="col-md-4 col-form-label">
                        Email<strong className="text-danger"> *</strong>
                      </label>
                      <div className="col-md-8">
                        <input
                          required
                          id="email"
                          className="form-control"
                          name="email"
                          value={email}
                          onChange={this.onChange}
                        />
                      </div>
                    </div>

                    {userID !== idProfile &&
                      listPermission.includes(assignPermission) && (
                        <div className="row form-group">
                          <label className="col-md-4 col-form-label">
                            Permissions
                          </label>
                          <div className="col-md-8 pt-2">
                            <div className="button-group">
                              {!!allPermission.length && (
                                <ListPermissions
                                  onSubmitPermission={
                                    this.handelChangePermission
                                  }
                                  permissions={allPermission}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    {userID !== idProfile &&
                      listPermission.includes(assignRole) && (
                        <div className="row form-group">
                          <label className="col-md-4 col-form-label ">
                            Roles<strong className="text-danger"> *</strong>
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
                    <div className="row form-group mt-4">
                      <label className="col-md-4 control-label"></label>
                      <div className="col-md-8">
                        <button type="submit" className="btn btn-orange">
                          Save
                        </button>
                        <Link
                          className="btn btn-secondary ml-3"
                          to={`/${endpoint.users}`}>
                          Cancel
                        </Link>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Redirect to="/" />
        )}
      </div>
    );
  }
}

EditUser.defaultProps = {
  loadPosition: null,
};

const mapStateToProps = (state) => ({
  listPosition: state.positionData.positions,
});

export default connect(mapStateToProps, null)(EditUser);
