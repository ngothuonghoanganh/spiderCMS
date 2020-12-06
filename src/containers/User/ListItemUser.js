import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { endpoint } from '../../constants/config';
import { getItemLocalStore } from '../../utils/handleLocalStore';
import { confirmPopup } from '../../utils/alertPopup';
import defaultAvatar from '../../assets/img/default-avatar.png';
import { constant } from '../../constants/constant';
const { updateUser, deleteUser } = constant.permissions;
class ListItemUser extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  onDelete(accountid, profileid) {
    const { firstName, lastName } = this.props.list;
    confirmPopup(
      'Warning',
      `Do you want to delete this user '${firstName + ' ' + lastName}'?`,
      () => {
        this.props.onDelete(accountid, profileid);
      }
    );
  }
  render() {
    const {
      index,
      list: { id, firstName, lastName, avatar, email, account },
    } = this.props;
    const listPermission = getItemLocalStore('listPermissions');
    const fullName = `${firstName ? firstName : ''} ${
      lastName ? lastName : ''
    }`;
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
            to={`/${endpoint.users}/${endpoint.view}/${id}`}>
            {fullName}
          </Link>
        </td>
        <td>{email}</td>
        {(listPermission.includes(updateUser) ||
          listPermission.includes(deleteUser)) && (
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
                {listPermission.includes(updateUser) && (
                  <Link
                    className="dropdown-item edit"
                    to={`/${endpoint.editUser}/${id}`}>
                    Edit
                  </Link>
                )}
                {listPermission.includes(deleteUser) && (
                  <button
                    className="dropdown-item"
                    style={{ cursor: 'pointer' }}
                    onClick={() => this.onDelete(account.id, id)}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          </td>
        )}
      </tr>
    );
  }
}

export default ListItemUser;
