/** @format */

import React, { Component } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { endpoint } from '../../constants/config';
import { getItemLocalStore } from '../../utils/handleLocalStore';
import { confirmPopup } from '../../utils/alertPopup';
import './index.css';
import defaultAvatar from '../../assets/img/default-avatar.png';
import { constant } from '../../constants/constant';
const {
  deleteEmployee,
  updateEmployee,
  readOneTimeSheet,
  readPaySlip,
} = constant.permissions;
class ListItem extends Component {
  onDelete(id) {
    const { firstName, lastName } = this.props.list;
    console.log(this.props.list);
    confirmPopup(
      'Warnning',
      `Do you want to delete this employee '${firstName + lastName}'?`,
      () => {
        this.props.onDelete(id);
      }
    );
  }
  render() {
    const listPermission = getItemLocalStore('listPermissions');
    const {
      list: {
        id,
        avatar,
        firstName,
        lastName,
        email,
        phone,
        skype,
        gender,
        maritalStatus,
        birthday,
        startDate,
        endDate,
      },
      index,
    } = this.props;
    const fullName = firstName + ' ' + lastName;
    const avatarImgSource = avatar
      ? `${endpoint.url}/${endpoint.imageURL}/${avatar}`
      : defaultAvatar;
    return (
      <tr>
        <td>{index + 1}</td>
        <td>
          <div className="img-preview">
            <img className="imgitem" src={avatarImgSource} alt="" />
          </div>
        </td>
        <td>
          <Link
            className="link-user"
            to={`/${endpoint.employees}/${endpoint.view}/${id}`}>
            {fullName}
          </Link>
        </td>
        <td> {email}</td>
        <td> {phone}</td>
        <td> {skype}</td>
        <td> {gender === 'male' ? 'Male' : 'Female'}</td>
        <td>{maritalStatus}</td>
        <td> {birthday ? moment(birthday).format('DD/MM/YYYY') : ''}</td>
        <td> {startDate ? moment(startDate).format('DD/MM/YYYY') : ''}</td>
        <td>{endDate ? moment(startDate).format('DD/MM/YYYY') : ''}</td>
        {(listPermission.includes(updateEmployee) ||
          listPermission.includes(deleteEmployee)) && (
          <td>
            <div className="btn-group">
              <button
                className="btn btn-orange dropdown-toggle"
                type="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false">
                Action
              </button>
              <div className="dropdown-menu dropdown-menu-right">
                {listPermission.includes(updateEmployee) && (
                  <React.Fragment>
                    <Link
                      className="dropdown-item edit"
                      to={`/${endpoint.editEmployee}/${id}`}>
                      Edit
                    </Link>
                    <Link
                      to={`/${endpoint.employees}/${endpoint.editCV}/${id}`}
                      className="dropdown-item edit">
                      Edit CV
                    </Link>
                    {listPermission.includes(readPaySlip) && (
                      <Link
                        className="dropdown-item edit"
                        to={`/${endpoint.payslipCompany}/${id}`}>
                        Payslip
                      </Link>
                    )}
                    {listPermission.includes(readOneTimeSheet) && (
                      <Link
                        className="dropdown-item edit"
                        to={{
                          pathname: `/${endpoint.viewTimesheet}/${id}`,
                          state: {
                            fullName: fullName,
                          },
                        }}>
                        Timesheet
                      </Link>
                    )}
                  </React.Fragment>
                )}
                {listPermission.includes(deleteEmployee) && (
                  <li
                    className="dropdown-item"
                    style={{ cursor: 'pointer' }}
                    onClick={() => this.onDelete(id)}>
                    Delete
                  </li>
                )}
              </div>
            </div>
          </td>
        )}
      </tr>
    );
  }
}

export default ListItem;
