import React from 'react';
import Dropzone from 'react-dropzone';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { get, upperFirst } from 'lodash';
import moment from 'moment';
import './index.css';
import { updateProfile, changePassWord, loadDataProfile } from './actions';
import { loadPosition, loadDepartment } from '../Department/helpers';
import { uploadImage } from '../../containers/AddEmployee/helpers';
import { endpoint } from './../../constants/config';
import Loading from '../../components/Loading';
import { getItemLocalStore } from '../../utils/handleLocalStore';
import { alertPopup } from '../../utils/alertPopup';
import { constant } from '../../constants/constant';
import { Redirect } from 'react-router-dom';
const { updateUser } = constant.permissions;
class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileUpload: null,
      avatar: '',
      loading: false,
      firstName: '',
      email: '',
      urlImageTemp: '',
      password: '',
      confirmPassword: '',
    };
  }
  componentWillMount() {
    const id = getItemLocalStore('userData.profileId');
    this.props.loadDataProfile(id);
  }
  componentWillReceiveProps(nextProps) {
    const data = nextProps.loadProfileData;
    console.log(data);

    this.setState({
      ...data,
      selectValue: upperFirst(data.maritalStatus),
      birthday: data.birthday ? moment(data.birthday) : '',
      urlImageTemp: `avatar/${data.avatar}`,
    });
  }
  onChange = ({ target: { name, value, checked } }) => {
    value = name === 'checkbox' ? checked : value;
    this.setState({ [name]: value });
  };
  onImageDrop = (files) => {
    this.setState({
      fileUpload: files[0],
      loading: true,
    });
    this.props.uploadImage(files[0], (result, url) => {
      if (result) {
        const temp = `temp/${url}`;
        this.setState({
          avatar: url,
          loading: false,
          urlImageTemp: temp,
        });
      }
    });
  };
  onSave = (e) => {
    const id = getItemLocalStore('userData.profileId');
    e.preventDefault();
    const { password, confirmPassword } = this.state;
    if (password || confirmPassword) {
      this.props.changePassWord(
        this.state,
        (result, title = '', message = '') => {
          if (result) {
            this.props.updateProfile(id, this.state, (resultProfile) => {
              const { history } = this.props;
              if (resultProfile) {
                history.push(`/${endpoint.profile}/${endpoint.view}/${id}`);
              }
            });
          } else {
            alertPopup(title, message);
          }
        }
      );
    } else {
      this.props.updateProfile(id, this.state, (result) => {
        const { history } = this.props;
        if (result) {
          history.push(`/${endpoint.profile}/${endpoint.view}/${id}`);
        }
      });
    }
  };
  updateValue = (newValue) => {
    this.setState({
      selectValue: newValue,
      maritalStatus: newValue,
    });
  };
  render() {
    const {
      firstName,
      lastName,
      email,
      urlImageTemp,
      password,
      confirmPassword,
      loading,
      avatar,
    } = this.state;
    const listPermission = getItemLocalStore('listPermissions');
    return (
      <div className="container-fluid">
        {listPermission.includes(updateUser) ? (
          <div className="form-add card-border-orange bg-white">
            <div className="card-header card-header-divider">
              Edit Information
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
                      <label className="col-md-4 col-form-label">
                        First Name <strong className="text-danger">*</strong>
                      </label>
                      <div className="col-md-8">
                        <input
                          required
                          type="text"
                          className="form-control"
                          placeholder="Fist Name"
                          name="firstName"
                          value={firstName || ''}
                          onChange={this.onChange}
                        />
                      </div>
                    </div>
                    <div className="row form-group mt-3">
                      <label className="col-md-4 col-form-label">
                        Last Name <strong className="text-danger">*</strong>
                      </label>
                      <div className="col-md-8">
                        <input
                          required
                          type="text"
                          className="form-control"
                          placeholder="Last Name"
                          name="lastName"
                          value={lastName || ''}
                          onChange={this.onChange}
                        />
                      </div>
                    </div>
                    <div className="row form-group">
                      <label className="col-md-4 col-form-label">
                        Email <strong className="text-danger">*</strong>
                      </label>
                      <div className="col-md-8">
                        <input
                          required
                          type="email"
                          className="form-control"
                          name="email"
                          value={email}
                          onChange={this.onChange}
                        />
                      </div>
                    </div>
                    <hr />
                    <div className="text-center change-password">
                      Change Password
                    </div>
                    <div className="row form-group">
                      <label
                        htmlFor="password"
                        className="col-md-4 col-form-label ">
                        Current Password
                      </label>
                      <div className="col-md-8">
                        <input
                          type="password"
                          placeholder="Current Password"
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
                        htmlFor="password"
                        className="col-md-4 col-form-label ">
                        New Password
                      </label>
                      <div className="col-md-8">
                        <input
                          type="password"
                          placeholder="New Password"
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
                        htmlFor="password"
                        className="col-md-4 col-form-label ">
                        Confirm Password
                      </label>
                      <div className="col-md-8">
                        <input
                          type="password"
                          placeholder="Confirm Password"
                          className="form-control"
                          name="confirmPassword"
                          value={confirmPassword}
                          onChange={this.onChange}
                        />
                        {confirmPassword !== password && confirmPassword && (
                          <strong className="text-danger">
                            Password does not match
                          </strong>
                        )}
                      </div>
                    </div>

                    <div className="row form-group mt-4">
                      <label className="col-md-4 control-label"></label>
                      <div className="col-md-8">
                        <button type="submit" className="btn btn-orange">
                          Save
                        </button>
                        <button type="reset" className="btn btn-secondary ml-3">
                          Cancel
                        </button>
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

const mapStateToProps = (state) => ({
  loadProfileData: get(state, 'profileUser.data'),
  listPosition: state.positionData.positions,
});
const mapDispatchToProps = (dispatch) => ({
  loadDataProfile: bindActionCreators(loadDataProfile, dispatch),
  uploadImage: bindActionCreators(uploadImage, dispatch),
  updateProfile: bindActionCreators(updateProfile, dispatch),
  changePassWord: bindActionCreators(changePassWord, dispatch),
  loadDepartment: bindActionCreators(loadDepartment, dispatch),
  loadPosition: bindActionCreators(loadPosition, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);
