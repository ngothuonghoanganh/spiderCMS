/** @format */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { endpoint } from '../../constants/config';

class ListItem extends Component {
  render() {
    const { list, index } = this.props;
    const fullName = list.profile.firstName + ' ' + list.profile.lastName;
    return (
      <tr>
        <td> {index + 1}</td>
        <td>
          <Link
            className="link-timesheet-user link-user"
            to={{
              pathname: `/${endpoint.viewTimesheet}/${list.profileId}`,
              state: {
                fullName: fullName,
                month: list.month,
                year: list.year,
              },
            }}>
            {fullName}
          </Link>
        </td>
        <td> {list.totalWorkingHours} </td>
        <td> {list.totalOverTimeHours}</td>
        <td> {list.totalHours}</td>
      </tr>
    );
  }
}

export default ListItem;
