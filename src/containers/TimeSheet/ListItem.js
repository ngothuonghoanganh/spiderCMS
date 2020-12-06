/** @format */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { endpoint } from '../../constants/config';
import { confirmPopup } from '../../utils/alertPopup';
import './index.css';
// import moment from 'moment';

class ListItem extends Component {
  onDelete(id) {
    confirmPopup('Warnning', 'Do you want to delete?', () => {
      this.props.onDelete(id);
    });
  }

  render() {
    const { list, index } = this.props;
    const month = list.date.slice(3, 5);
    const year = list.date.slice(6, 10);

    const dateFormated = list.date.slice(0, 10);

    const dateSwapped =
      dateFormated.substr(3, 2) +
      '/' +
      dateFormated.substr(0, 2) +
      '/' +
      dateFormated.substr(6, 4);
    return (
      <tr>
        <td> {index + 1}</td>
        <td> {dateSwapped} </td>
        <td> {list.project}</td>
        <td> {list.task}</td>

        <td> {list.workingHours}</td>
        <td> {list.overTimeHours}</td>
        <td> {list.totalHours}</td>
        <td> {list.note}</td>
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
              <div>
                <React.Fragment>
                  <Link
                    className="dropdown-item edit"
                    to={{
                      pathname: `/${endpoint.editTimesheet}/${list.id}`,
                      state: {
                        profileId: list.profileId,
                        month: month,
                        year: year,
                      },
                    }}>
                    Edit
                  </Link>
                </React.Fragment>

                <li
                  className="dropdown-item"
                  style={{ cursor: 'pointer' }}
                  onClick={() => this.onDelete(list.id)}>
                  Delete
                </li>
              </div>
            </div>
          </div>
        </td>
      </tr>
    );
  }
}

export default ListItem;
