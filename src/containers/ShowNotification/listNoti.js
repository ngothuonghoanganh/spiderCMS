import React, { Component } from 'react';
import moment from 'moment';
import { capitalize } from 'lodash';
import { Link } from 'react-router-dom';
import { endpoint } from '../../constants/config';
import { confirmPopup } from '../../utils/alertPopup';
import './index.css';
class ListItem extends Component {
  onDelete(id) {
    confirmPopup('Warnning', 'Do you want to delete?', () => {
      this.props.onDelete(id);
    });
  }
  render() {
    // const listPermission = getItemLocalStore('listPermissions');
    const { list, index } = this.props;
    return (
      <tr>
        <td>{index + 1}</td>
        <td>
          <div className={!list.avatar ? 'profile-avt-none' : 'img-preview'}>
            <img
              className={list.avatar === null ? '' : 'imgitem'}
              src={`${list.avatar === '' || list.avatar === null ? '#' : endpoint.url}/${
                endpoint.imageURL
              }/${list.avatar}`}
              alt=""
            />
          </div>
        </td>
        <td>
          <Link className="link-user" to={`/${endpoint.employees}/${endpoint.profile}/${list.id}`}>
						S{`00${list.id}`.slice(-3)}
          </Link>
        </td>
        <td>
          {' '}
          {list.firstName} {list.lastName}
        </td>
        <td> {capitalize(list.positionName)}</td>
        <td> {list.email}</td>
        <td> {list.phone}</td>
        <td> {list.skype}</td>
        <td> {list.gender === 'male' ? 'Male' : 'Female'}</td>
        <td>{capitalize(list.maritalStatus)}</td>
        <td> {list.birthday ? moment(list.birthday).format('DD/MM/YYYY') : ''}</td>
      </tr>
    );
  }
}

export default ListItem;
