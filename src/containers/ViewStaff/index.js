import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import APIcaller from '../../utils/APIcaller';
import { endpoint } from './../../constants/config';
import * as responses from '../../constants/response';
import moment from 'moment';
import { get, upperFirst, map, isEmpty } from 'lodash';
import { getItemLocalStore } from '../../utils/handleLocalStore';
import { alertPopup } from '../../utils/alertPopup';
import errorHandler from '../../utils/handlerError';
import defaultAvatar from '../../assets/img/default-avatar.png';
class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    const list = this.props;

    APIcaller(`${endpoint.profileid}?profileId=${list.match.params.id}`).then(
      (res) => {
        const message = get(res, 'data.responseKey');

        if (message === responses.getOneSuccess) {
          const profiledData = get(res, 'data.data', '');
          const data = get(res, 'data.data.account', '');
          if (profiledData) {
            this.setState({
              accountData: data,
              position: profiledData.positions.map(
                ({ departmentName, positionName }) =>
                  departmentName + ': ' + positionName
              ),
              department: upperFirst(
                map(profiledData.positions, 'departmentName')
              ),
              profileId: profiledData.id,
              firstName: profiledData.firstName,
              lastName: profiledData.lastName,
              email: profiledData.email,
              skype: profiledData.skype,
              phone: profiledData.phone,
              gender: profiledData.gender,
              startDate: profiledData.startDate,
              birthday: profiledData.birthday,
              avatar: profiledData.avatar,
              endDate: profiledData.endDate,
              maritalStatus: profiledData.maritalStatus,
              userName: profiledData.account.username,
            });
          }
        } else if (message === responses.noPermission) {
          this.props.history.push('/');
        } else {
          alertPopup('FAILD!!!!', errorHandler(message));
        }
      }
    );
  }
  render() {
    const {
      firstName,
      lastName,
      email,
      skype,
      phone,
      position,
      gender,
      startDate,
      birthday,
      endDate,
      avatar,
      profileId,
      maritalStatus,
      userName,
    } = this.state;
    const fullName = firstName + ' ' + lastName;
    const { match } = this.props;
    const path = match.path;
    const userId = getItemLocalStore('userData.profileId');
    const avatarImgSource = avatar
      ? `${endpoint.url}/${endpoint.imageURL}/${avatar}`
      : defaultAvatar;

    // const listPermission = getItemLocalStore('listPermissions');
    // console.log(listPermission);
    return (
      <div className="container-fluid">
        <div className="row form-add">
          <div className="col-md-5">
            <section className="text-center profile-general card-border-orange">
              <div className="img-preview">
                <img alt="" src={avatarImgSource} className="profile-pic" />
              </div>
              <hr />
              <div className="profile-body">
                <p className="profile-title">{fullName}</p>
                {isEmpty(this.state.accountData)
                  ? position &&
                    position.map((ele) => (
                      <p className="profile-subtitle">{ele}</p>
                    ))
                  : ''}
              </div>
            </section>
          </div>
          <div className="col-md-7">
            <section className="pt-0 profile-general card-border-orange">
              <div className="profile-header">
                <p className="profile-title mb-0 pt-4">
                  {!isEmpty(this.state.accountData)
                    ? 'User information'
                    : 'Employee information'}
                </p>
              </div>
              <hr />
              <div className="profile-body">
                {!isEmpty(this.state.accountData) ? (
                  <ul className="container-fluid">
                    <li className="row">
                      <div className="col-sm-4">First Name</div>
                      <span className="col-sm-8">{firstName}</span>
                    </li>
                    <li className="row">
                      <div className="col-sm-4">Last Name</div>
                      <span className="col-sm-8">{lastName}</span>
                    </li>
                    <li className="row">
                      <div className="col-sm-4">Username</div>
                      <span className="col-sm-8">{userName}</span>
                    </li>
                    <li className="row">
                      <div className="col-sm-4">Email</div>
                      <span className="col-sm-8">{email}</span>
                    </li>
                  </ul>
                ) : (
                  <ul className="container-fluid">
                    <li className="row">
                      <div className="col-sm-4">First Name</div>
                      <span className="col-sm-8">{firstName}</span>
                    </li>
                    <li className="row">
                      <div className="col-sm-4">Last Name</div>
                      <span className="col-sm-8">{lastName}</span>
                    </li>
                    <li className="row">
                      <div className="col-sm-4">Email</div>
                      <span className="col-sm-8">{email}</span>
                    </li>
                    <li className="row">
                      <div className="col-sm-4">Birthday</div>
                      <span className="col-sm-8">
                        {birthday ? moment(birthday).format('DD/MM/YYYY') : ''}
                      </span>
                    </li>
                    <li className="row">
                      <div className="col-sm-4">Phone</div>
                      <span className="col-sm-8">{phone}</span>
                    </li>
                    <li className="row">
                      <div className="col-sm-4">Gender</div>
                      <span className="col-sm-8">
                        {gender === 'male' ? 'Male' : 'Female'}
                      </span>
                    </li>
                    <li className="row">
                      <div className="col-sm-4">Skype</div>
                      <span className="col-sm-8">{skype}</span>
                    </li>
                    <li className="row">
                      <div className="col-sm-4">Marital Status</div>
                      <span className="col-sm-8">
                        {upperFirst(maritalStatus)}
                      </span>
                    </li>
                    {isEmpty(this.state.accountData) ? (
                      <li className="row">
                        <div className="col-sm-4">Joining date</div>
                        <span className="col-sm-8">
                          {startDate
                            ? moment(startDate).format('DD/MM/YYYY')
                            : ''}
                        </span>
                      </li>
                    ) : (
                      ''
                    )}
                    {isEmpty(this.state.accountData) ? (
                      <li className="row">
                        <div className="col-sm-4">Left date</div>
                        <span className="col-sm-8">
                          {endDate ? moment(endDate).format('DD/MM/YYYY') : ''}
                        </span>
                      </li>
                    ) : (
                      ''
                    )}
                  </ul>
                )}
              </div>
              <div className="sign-out">
                {userId === profileId ? (
                  ''
                ) : (
                  <Link
                    to={`/${
                      path === '/employees/view/:id'
                        ? endpoint.editEmployee
                        : endpoint.editUser
                    }/${match.params.id}`}
                    className="btn btn-orange">
                    Edit
                  </Link>
                )}
                {!isEmpty(this.state.accountData)
                  ? ''
                  : [
                      <Link
                        className="btn btn-orange ml-3"
                        to={{
                          pathname: `/${endpoint.viewTimesheet}/${match.params.id}`,
                          state: { fullName },
                        }}>
                        Timesheet
                      </Link>,
                      <Link
                        to={`/${endpoint.employees}/${endpoint.editCV}/${match.params.id}`}
                        className="btn btn-orange ml-3">
                        Edit CV
                      </Link>,
                    ]}
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  }
}
export default Profile;
