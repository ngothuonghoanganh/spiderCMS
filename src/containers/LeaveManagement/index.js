import React, { Component } from 'react';
import $ from 'jquery';
import Loading from '../../components/Loading';
import { APIcaller, handlerError } from '../../utils';
import { endpoint } from '../../constants/config';
import { alertPopup, confirmPopup } from '../../utils/alertPopup';
import { get } from 'lodash';
import errorHandler from '../../utils/handlerError';
import * as response from '../../constants/response';
import VirtualizedSelect from 'react-virtualized-select';
import { getItemLocalStore } from '../../utils/handleLocalStore';
import { Redirect } from 'react-router-dom';
import { DatePicker } from 'antd';
import moment from 'moment';
import { constant } from '../../constants/constant';
const { MonthPicker } = DatePicker;
const MONTH_FORMAT = 'MM/YYYY';
const {
  createProject,
  readProject,
  updateProject,
  deleteProject,
} = constant.permissions;
const DATE_FORMAT = 'DD/MM/YYYY';
class LeaveManagement extends Component {
  constructor(props) {
    super(props);
    this.dataTableProjects = React.createRef();
    const current = moment(new Date()).add(1, 'd');
    this.state = {
      loading: true,
      listLeaves: [],
      leaveId: null,
      profileId: null,
      reason: '',
      dayOff: null,
      startDate: null,
      endDate: null,
      approve: false,
      month: current.month() + 1,
      year: current.year(),
    };
  }

  loadLeaves = async (month, year) => {
    let result = [];
    const res = await APIcaller(
      `${endpoint.leaves}?month=${month}&year=${year}`
    );
    const message = get(res, 'data.responseKey');
    // console.log('res', res);

    if (message === response.getListSuccess) {
      result = res.data.data.map(
        ({ employee: { id, firstName, lastName }, leaveManagement }) => ({
          profileId: id,
          fullName: firstName + ' ' + lastName,
          ...leaveManagement,
        })
      );
    }
    return result;
  };

  loadEmployees = async (id) => {
    let result = [];
    const res = await APIcaller(`${endpoint.profiles}`);
    const message = get(res, 'data.responseKey');
    // console.log('res', res);

    if (message === response.getListSuccess) {
      result = res.data.data.map(({ id, firstName, lastName }) => ({
        id,
        fullName: firstName + ' ' + lastName,
      }));
    }
    return result;
  };

  componentDidMount() {
    // load data projects to table
    this.setState({ loading: true }, async () => {
      const { month, year } = this.state;
      const listLeaves = await this.loadLeaves(month, year);
      const listEmployees = await this.loadEmployees();
      this.setState({ listLeaves, listEmployees });
      const listPermission = getItemLocalStore('listPermissions');
      if (listPermission.includes(readProject)) {
        const option =
          listPermission.includes(updateProject) ||
          listPermission.includes(deleteProject)
            ? {
                columnDefs: [
                  { orderable: false, targets: [-1] },
                  { searchable: false, targets: [-1] },
                  { width: '10%', targets: 0 },
                  { width: '20%', targets: 1 },
                  { width: '20%', targets: 2 },
                  { width: '20%', targets: 3 },
                  { width: '10%', targets: 4 },
                  { width: '50%', targets: 5 },
                ],
                lengthMenu: [
                  [10, 25, 50, -1],
                  [10, 25, 50, 'All'],
                ],
              }
            : {
                columnDefs: [
                  { width: '10%', targets: 0 },
                  { width: '50%', targets: 1 },
                  { width: '30%', targets: 2 },
                  { width: '20%', targets: 3 },
                  { width: '10%', targets: 4 },
                  { width: '50%', targets: 5 },
                ],
                lengthMenu: [
                  [10, 25, 50, -1],
                  [10, 25, 50, 'All'],
                ],
              };
        const t = $(this.dataTableProjects.current).DataTable(option);
        t.column(0)
          .nodes()
          .map((cell, i) => (cell.innerHTML = i + 1))
          .draw();
      }
      this.setState({ loading: false });
    });
  }

  handleChange = ({ target: { value, checked, type, name } }) => {
    this.setState({ [name]: type === 'checkbox' ? checked : value });
  };

  handleChangeForSpecialInput = (name, value) => {
    // console.log(name, value);
    this.setState({ [name]: value });
  };

  handleChangeMonth = (monthSelected) => {
    this.setState(
      {
        month: monthSelected.month() + 1,
        year: monthSelected.year(),
        loading: true,
      },
      async () => {
        const { month, year } = this.state;
        const listLeaves = await this.loadLeaves(month, year);
        console.table(listLeaves);

        this.setState({ listLeaves, loading: false });
      }
    );
  };

  onSubmitForm = (e) => {
    e.preventDefault();
    const {
      leaveId,
      reason,
      profileId,
      startDate,
      endDate,
      month,
      year,
    } = this.state;
    // console.log(profileId);

    if (startDate <= endDate && startDate.month() === endDate.month()) {
      if (leaveId) {
        // sumit to Edit
        this.setState({ loading: true }, async () => {
          const res = await APIcaller(
            `${endpoint.leave}/?leaveId=${leaveId}`,
            'PATCH',
            {},
            {
              startDate: moment(startDate).format('MM/DD/YYYY'),
              endDate: moment(endDate).format('MM/DD/YYYY'),
              reason,
            }
          );
          const message = get(res, 'data.responseKey');
          console.log('res', res);

          if (message !== response.updateSuccess) {
            alertPopup('FAILED!!!', errorHandler(message));
          } else {
            const listLeaves = await this.loadLeaves(month, year);
            this.setState({ listLeaves });
            this.updateForm();
            $('#modelFormId').modal('hide');
          }
          this.setState({ loading: false });
        });
      } else {
        // submit to Add
        this.setState({ loading: true }, async () => {
          const res = await APIcaller(
            `${endpoint.leave}?profileId=${profileId}`,
            'POST',
            {},
            {
              startDate: moment(startDate).format('MM/DD/YYYY'),
              endDate: moment(endDate).format('MM/DD/YYYY'),
              reason,
            }
          );
          const message = get(res, 'data.responseKey');
          // console.log(res);

          if (message !== response.insertSuccess) {
            alertPopup('FAILED!!!', errorHandler(message));
          } else {
            if (!this.state.listLeaves.length) $('.odd').remove();
            const listLeaves = await this.loadLeaves(month, year);
            this.setState({ listLeaves });
            this.updateForm();
            $('#modelFormId').modal('hide');
          }
          this.setState({ loading: false });
        });
      }
    }
  };

  formatDate = (date = new Date()) =>
    `${
      date.getDate() <= 9 ? '0' + date.getDate() : date.getDate().toString()
    }/${
      date.getMonth() <= 8
        ? '0' + (date.getMonth() + 1)
        : (1 + date.getMonth()).toString()
    }/${date.getFullYear()}`;

  handleDeleteItem = (leaveId) => {
    APIcaller(`${endpoint.leave}?leaveId=${leaveId}`, 'DELETE').then((res) => {
      // console.log(res);

      const message = get(res, 'data.responseKey');
      if (message !== response.deleteSuccess) {
        alertPopup('FAILED!!!', errorHandler(message));
      } else {
        let { listLeaves } = this.state;
        let index = listLeaves.map(({ id }) => id).indexOf(leaveId);

        if (index > -1 && index !== listLeaves.length - 1) {
          listLeaves.splice(index, 1);
        } else if (index === listLeaves.length - 1) {
          listLeaves.pop();
        }
        this.setState({ listLeaves });
      }
    });
  };

  approveRequest = (id) => {
    //call Api first and then change UI
    this.setState({ loading: true }, async () => {
      const res = await APIcaller(
        `${endpoint.leaveApprove}?leaveId=${id}`,
        'PATCH'
      );
      const message = get(res, 'data.responseKey');
      console.log(res);

      if (message !== response.updateSuccess) {
        alertPopup('FAILD!!!', handlerError(message));
      } else {
        const { month, year } = this.state;
        const listLeaves = await this.loadLeaves(month, year);
        this.setState({ listLeaves });
      }
      this.setState({ loading: false });
    });
  };

  updateForm = (
    leaveId = null,
    profileId = null,
    startDate = null,
    endDate = null,
    reason = ''
  ) => {
    this.setState({
      leaveId,
      profileId,
      startDate,
      endDate,
      reason,
    });
  };

  showListItem = (list) => {
    if (list.length) {
      const listPermission = getItemLocalStore('listPermissions');
      return list.map(
        (
          {
            id,
            profileId,
            fullName,
            startDate,
            endDate,
            dayOff,
            reason,
            approveLeaveRequest,
          },
          index
        ) => (
          <tr key={id}>
            <td>{index}</td>
            <td>{fullName}</td>
            <td>{startDate}</td>
            <td>{endDate}</td>
            <td>{dayOff}</td>
            <td>{reason}</td>
            <td>{approveLeaveRequest ? 'Approved' : 'Waiting'}</td>
            {listPermission.includes(updateProject) ||
            listPermission.includes(deleteProject) ? (
              <td>
                {!approveLeaveRequest && (
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
                      <button
                        className="dropdown-item"
                        type="button"
                        data-toggle="modal"
                        onClick={() => {
                          this.approveRequest(id);
                        }}>
                        Approve
                      </button>
                      <button
                        className="dropdown-item"
                        type="button"
                        data-toggle="modal"
                        onClick={(e) => {
                          this.updateForm(
                            id,
                            profileId,
                            moment(startDate),
                            moment(endDate),
                            reason
                          );
                          $('#modelFormId').modal('show');
                        }}>
                        Edit{' '}
                      </button>
                      <button
                        className="dropdown-item"
                        type="button"
                        onClick={() => {
                          confirmPopup(
                            'Delete Leave Request',
                            `Do you want to delete this leave request?`,
                            () => {
                              this.handleDeleteItem(id);
                            }
                          );
                        }}>
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </td>
            ) : (
              ''
            )}
          </tr>
        )
      );
    }
  };

  render() {
    const {
      loading,
      listLeaves,
      listEmployees,
      leaveId,
      profileId,
      startDate,
      endDate,
      reason,
      month,
      year,
    } = this.state;
    const listPermission = getItemLocalStore('listPermissions');
    // // console.log('listProjects', listProjects);
    const listLimitDate =
      profileId && listLeaves
        ? listLeaves
            .filter((ele) => profileId === ele.profileId && ele.id !== leaveId)
            .map(({ startDate, endDate }) => ({ startDate, endDate }))
        : [];

    return (
      <div className="container-fluid">
        {listPermission.includes(readProject) ? (
          <div className="form-add card-border-orange bg-white">
            <div className="card-header card-header-divider">
              <h3>Leaves Management</h3>
            </div>
            {loading && <Loading />}
            <div className="container-fluid mt-3">
              <div className="form-inline mb-3">
                <label className="col-form-label">Month:</label>

                <MonthPicker
                  className="ml-2"
                  onChange={this.handleChangeMonth}
                  format={MONTH_FORMAT}
                  value={moment(`${month}/${year}`, MONTH_FORMAT)}
                  placeholder="Insert month and year"
                />
              </div>
              {listPermission.includes(createProject) ? (
                <button
                  type="button"
                  className="btn btn-orange mb-3"
                  data-toggle="modal"
                  onClick={(e) => {
                    this.updateForm();
                    $('#modelFormId').modal('show');
                  }}>
                  Add
                </button>
              ) : (
                ''
              )}

              <div className="modal fade" id="modelFormId" role="dialog">
                <div className="modal-dialog" role="document">
                  <form
                    className="modal-content bg-white"
                    onSubmit={this.onSubmitForm}>
                    <div className="modal-header px-4">
                      <h5>{leaveId ? 'Edit Leave' : 'Add Leave'}</h5>
                    </div>
                    <div className="modal-body px-4">
                      <div className="row form-group">
                        <label className="col-md-4">
                          Employee
                          <strong className="text-danger"> *</strong>
                        </label>
                        <div className="col-md-8">
                          <VirtualizedSelect
                            required
                            options={listEmployees}
                            disabled={!!leaveId}
                            simpleValue
                            onChange={(value) => {
                              this.handleChangeForSpecialInput(
                                'profileId',
                                value
                              );
                            }}
                            autoFocus={true}
                            value={profileId}
                            labelKey="fullName"
                            valueKey="id"
                          />
                        </div>
                      </div>

                      <div className="row form-group">
                        <label className="col-md-4">
                          Start Date<strong className="text-danger"> *</strong>
                        </label>
                        <div className="col-md-8">
                          <DatePicker
                            required
                            disabledDate={(date) => {
                              return listLimitDate.reduce(
                                (check, { startDate, endDate }) =>
                                  check ||
                                  (date >= moment(startDate) &&
                                    date <= moment(endDate)),
                                date <= moment(new Date()) ||
                                  date.day() === 0 ||
                                  date.day() === 6
                              );
                            }}
                            onChange={(date) => {
                              this.handleChangeForSpecialInput(
                                'startDate',
                                date
                              );
                            }}
                            allowClear={false}
                            value={startDate}
                            format={DATE_FORMAT}
                          />
                        </div>
                      </div>
                      <div className="row form-group">
                        <label className="col-md-4">
                          End Date<strong className="text-danger"> *</strong>
                        </label>
                        <div className="col-md-8">
                          <DatePicker
                            required
                            disabledDate={(date) => {
                              return listLimitDate.reduce(
                                (check, { startDate, endDate }) =>
                                  check ||
                                  (date >= moment(startDate) &&
                                    date <= moment(endDate)),
                                date <= moment(new Date()) ||
                                  date.day() === 0 ||
                                  date.day() === 6
                              );
                            }}
                            onChange={(date) => {
                              this.handleChangeForSpecialInput('endDate', date);
                            }}
                            allowClear={false}
                            value={endDate}
                            format={DATE_FORMAT}
                          />
                          <br />
                          {startDate > endDate && endDate && (
                            <strong className="text-danger small">
                              Start date must greater than end date!
                            </strong>
                          )}
                          {endDate &&
                            startDate &&
                            startDate.month() !== endDate.month() && (
                              <strong className="text-danger small">
                                Start date and end date must be in the same
                                month!
                              </strong>
                            )}
                        </div>
                      </div>
                      <div className="row form-group">
                        <label htmlFor="reason" className="col-md-4">
                          Reason<strong className="text-danger"> *</strong>
                        </label>
                        <div className="col-md-8">
                          <textarea
                            required
                            id="reason"
                            type="text"
                            rows="4"
                            placeholder="Reason"
                            className="form-control"
                            name="reason"
                            value={reason}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="modal-footer px-4">
                      <button type="submit" className="btn btn-orange">
                        Save
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary ml-3"
                        data-dismiss="modal">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <table
                ref={this.dataTableProjects}
                cellSpacing="0"
                className="table-responsive table table-bordered table-hover bg-white"
                style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Employee Name</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Day Off</th>
                    <th>Reason</th>
                    <th>Status</th>
                    {listPermission.includes(updateProject) ||
                    listPermission.includes(deleteProject) ? (
                      <th />
                    ) : (
                      ''
                    )}
                  </tr>
                </thead>
                <tbody>{this.showListItem(listLeaves)}</tbody>
              </table>
            </div>
          </div>
        ) : (
          <Redirect to="/" />
        )}
      </div>
    );
  }
}

export default LeaveManagement;
