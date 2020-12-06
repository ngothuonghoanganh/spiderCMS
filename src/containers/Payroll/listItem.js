/** @format */

import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { confirmPopup } from '../../utils/alertPopup';
import { endpoint } from '../../constants/config';

class ListItem extends Component {
  onDelete(id) {
    confirmPopup('Warnning', 'Do you want to delete?', () => {
      this.props.onDelete(id);
    });
  }

  render() {
    const { list, index } = this.props;

    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'VND',
    });
    return (
      <tr>
        <React.Fragment>
          <td> {index + 1}</td>
          <td> {list.firstName + ' ' + list.lastName} </td>
          <td> {formatter.format(list.salary.basicSalary)}</td>
          <td> {list.totalWorkingHours}</td>
          <td> {formatter.format(list.salary.workingPayment)}</td>
          <td> {list.totalOverTimeHours}</td>
          <td> {formatter.format(list.salary.overTimePayment)}</td>
          <td> {formatter.format(list.benefit.bonus)}</td>
          <td> {formatter.format(list.benefit.conveyanceAllowance)}</td>
          <td> {formatter.format(list.benefit.mealAllowance)}</td>
          <td> {formatter.format(list.grossSalary)}</td>
          <td> {formatter.format(list.advancePayment)}</td>
          <td> {formatter.format(list.netSalary)}</td>
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
                        pathname: `/${endpoint.editPayroll}/${list.benefit.payrollId}`,
                        state: { month: list.month, year: list.year },
                      }}>
                      Edit
                    </Link>
                  </React.Fragment>

                  <li
                    className="dropdown-item"
                    style={{ cursor: 'pointer' }}
                    onClick={() => this.onDelete(list.benefit.payrollId)}>
                    Delete
                  </li>
                </div>
              </div>
            </div>
          </td>
        </React.Fragment>
      </tr>
    );
  }
}

export default ListItem;
