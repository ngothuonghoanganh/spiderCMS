import React, { Component } from 'react';
import $ from 'jquery';
import Loading from '../../components/Loading';
import { APIcaller } from '../../utils';
import { endpoint } from '../../constants/config';
import { alertPopup, confirmPopup } from '../../utils/alertPopup';
import { get } from 'lodash';
import errorHandler from '../../utils/handlerError';
import * as response from '../../constants/response';
import { Redirect } from 'react-router-dom';
import VirtualizedSelect from 'react-virtualized-select';
import { getItemLocalStore } from '../../utils/handleLocalStore';
import { DatePicker } from 'antd';
import moment from 'moment';
import { constant } from '../../constants/constant';
const {
  createProject,
  readProject,
  updateProject,
  deleteProject,
} = constant.permissions;
const DATE_FORMAT = 'DD/MM/YYYY';
class ProjectManagement extends Component {
  constructor(props) {
    super(props);
    this.dataTableProjects = React.createRef();
    this.state = {
      loading: true,
      listProjects: [],
      listClients: [],
      projectId: null,
      projectType: null,
      projectName: '',
      clientId: null,
      startDate: moment(new Date(), DATE_FORMAT),
      endDate: moment(new Date(), DATE_FORMAT),
    };
  }

  loadProjects = async () => {
    let result = [];
    const res = await APIcaller(`${endpoint.projects}`);
    const message = get(res, 'data.responseKey');
    if (message === response.getListSuccess) {
      result = res.data.data;
    }
    return result;
  };

  componentDidMount() {
    // load data projects to table
    APIcaller(`${endpoint.projects}`)
      .then((res) => {
        const message = get(res, 'data.responseKey');
        // console.log(res);

        if (message === response.getListSuccess) {
          this.setState({
            listProjects: res.data.data,
          });
        }
        this.setState({ loading: false });
      })
      .then(() => {
        const listPermission = getItemLocalStore('listPermissions');
        if (listPermission.includes('readProject')) {
          const option =
            listPermission.includes('updateProject') &&
            listPermission.includes('deleteProject')
              ? {
                  columnDefs: [
                    { orderable: false, targets: [-1] },
                    { searchable: false, targets: [-1] },
                    { width: '10%', targets: 0 },
                    { width: '50%', targets: 1 },
                    { width: '30%', targets: 2 },
                    { width: '20%', targets: 3 },
                    { width: '20%', targets: 4 },
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
      });

    // load data clients to form
    APIcaller(`${endpoint.clients}`).then((res) => {
      const message = get(res, 'data.responseKey');
      // console.log(res);

      if (message === response.getListSuccess) {
        this.setState({
          listClients: res.data.data,
        });
      }
    });
  }

  handleChange = ({ target: { value, checked, type, name } }) => {
    this.setState({ [name]: type === 'checkbox' ? checked : value });
  };

  handleChangeForSpecialInput = (name, value) => {
    // console.log(name, value);
    this.setState({ [name]: value });
  };

  onSubmitForm = (e) => {
    e.preventDefault();
    const {
      projectId,
      projectType,
      projectName,
      clientId,
      startDate,
      endDate,
    } = this.state;
    // console.log(clientId);

    if (startDate <= endDate) {
      if (projectId) {
        // sumit to Edit
        this.setState({ loading: true }, async () => {
          const res = await APIcaller(
            `${endpoint.project}/?projectId=${projectId}`,
            'PATCH',
            {},
            {
              clientId,
              projectType,
              projectName,
              startDate: moment(startDate.toString()).format('MM/DD/YYYY'),
              endDate: moment(endDate.toString()).format('MM/DD/YYYY'),
            }
          );
          const message = get(res, 'data.responseKey');
          if (message !== response.updateSuccess) {
            alertPopup('FAILED!!!', errorHandler(message));
          } else {
            const listProjects = await this.loadProjects();
            this.setState({ listProjects });
            this.updateForm();
            $('#modelFormId').modal('hide');
          }
          this.setState({ loading: false });
        });
      } else {
        // submit to Add
        this.setState({ loading: true }, async () => {
          const res = await APIcaller(
            `${endpoint.project}`,
            'POST',
            {},
            {
              projectName,
              projectType,
              clientId,
              startDate: moment(startDate.toString()).format('MM/DD/YYYY'),
              endDate: moment(endDate.toString()).format('MM/DD/YYYY'),
            }
          );
          const message = get(res, 'data.responseKey');
          // console.log(res);

          if (message !== response.insertSuccess) {
            alertPopup('FAILED!!!', errorHandler(message));
          } else {
            const listProjects = await this.loadProjects();
            if (!this.state.listProjects.length) $('.odd').remove();
            this.setState({ listProjects });
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

  handleDeleteItem = (projectId) => {
    APIcaller(`${endpoint.project}?projectId=${projectId}`, 'DELETE').then(
      (res) => {
        // console.log(res);

        const message = get(res, 'data.responseKey');
        if (message !== response.deleteSuccess) {
          alertPopup('FAILED!!!', errorHandler(message));
        } else {
          let { listProjects } = this.state;
          let index = listProjects.map(({ id }) => id).indexOf(projectId);

          if (index > -1 && index !== listProjects.length - 1) {
            listProjects.splice(index, 1);
          } else if (index === listProjects.length - 1) {
            listProjects.pop();
          }
          this.setState({ listProjects });
        }
      }
    );
  };

  updateForm = (
    projectId = null,
    projectType = [],
    projectName = '',
    clientId = null,
    startDate = moment(new Date(), DATE_FORMAT),
    endDate = moment(new Date(), DATE_FORMAT)
  ) => {
    this.setState({
      projectId,
      projectType,
      projectName,
      clientId,
      startDate,
      endDate,
    });
  };

  showListItem = (list) => {
    if (list.length) {
      const listPermission = getItemLocalStore('listPermissions');
      return list.map(
        (
          { id, projectName, projectType, client, startDate, endDate },
          index
        ) => (
          <tr key={id}>
            <td>{index}</td>
            <td>{projectName}</td>
            <td>{projectType}</td>
            <td>{client.clientName}</td>
            <td>{startDate}</td>
            <td>{endDate}</td>
            {listPermission.includes(updateProject) &&
            listPermission.includes(deleteProject) ? (
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
                    <button
                      className="dropdown-item"
                      type="button"
                      data-toggle="modal"
                      onClick={(e) => {
                        this.updateForm(
                          id,
                          projectType,
                          projectName,
                          client.id,
                          moment(startDate),
                          moment(endDate)
                        );
                        $('#modelFormId').modal('show');
                      }}>
                      Edit
                    </button>
                    <button
                      className="dropdown-item"
                      type="button"
                      onClick={() => {
                        confirmPopup(
                          'Delete Project',
                          `Do you want to delete this project '${projectName}'?`,
                          () => {
                            this.handleDeleteItem(id);
                          }
                        );
                      }}>
                      Delete
                    </button>
                  </div>
                </div>
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
      listProjects,
      listClients,
      projectName,
      projectType,
      clientId,
      startDate,
      endDate,
      projectId,
    } = this.state;
    const listPermission = getItemLocalStore('listPermissions');
    // // console.log('listProjects', listProjects);

    return (
      <div className="container-fluid">
        {listPermission.includes(readProject) ? (
          <div className="form-add card-border-orange bg-white">
            <div className="card-header card-header-divider">
              <h3>Projects Management</h3>
            </div>
            {loading && <Loading />}
            <div className="container-fluid mt-3">
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

              <div
                className="modal fade modal-clients-projects"
                id="modelFormId"
                role="dialog">
                <div className="modal-dialog" role="document">
                  <form
                    className="modal-content bg-white"
                    onSubmit={this.onSubmitForm}>
                    <div className="modal-header px-4">
                      <h5>{projectId ? 'Edit Project' : 'Add Project'}</h5>
                    </div>
                    <div className="modal-body px-4">
                      <div className="row form-group w-auto">
                        <label className="col-md-4">
                          Project
                          <strong className="text-danger"> *</strong>
                        </label>
                        <div className="col-md-8">
                          <input
                            required
                            type="text"
                            name="projectName"
                            placeholder="Project Name"
                            className="form-control"
                            value={projectName}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>

                      <div className="row form-group w-auto">
                        <label className="col-md-4 col-form-label">
                          Project Type
                          <strong className="text-danger"> *</strong>
                        </label>
                        <div className="col-md-8 pt-2">
                          <div className="form-check form-check-inline">
                            <label className="form-check-label form-check-label ">
                              <input
                                required
                                type="radio"
                                id="inline-radio1"
                                checked={
                                  projectType === 'Outsourcing' ? 'checked' : ''
                                }
                                onChange={this.handleChange}
                                name="projectType"
                                className="form-check-input form-check-input"
                                value="Outsourcing"
                              />
                              Outsourcing
                            </label>
                          </div>
                          <div className="form-check form-check-inline">
                            <label className="form-check-label form-check-label ">
                              <input
                                required
                                type="radio"
                                id="inline-radio2"
                                checked={
                                  projectType === 'Internal' ? 'checked' : ''
                                }
                                onChange={this.handleChange}
                                name="projectType"
                                className="form-check-input form-check-input"
                                value="Internal"
                              />
                              Internal
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="row form-group w-auto">
                        <label className="col-md-4">
                          Client<strong className="text-danger"> *</strong>
                        </label>
                        <div className="col-md-8">
                          <VirtualizedSelect
                            required
                            options={listClients}
                            simpleValue
                            onChange={(value) => {
                              this.handleChangeForSpecialInput(
                                'clientId',
                                value
                              );
                            }}
                            autoFocus={true}
                            value={clientId}
                            labelKey="clientName"
                            valueKey="id"
                          />
                        </div>
                      </div>
                      <div className="row form-group w-auto">
                        <label className="col-md-4">Start Date </label>
                        <div className="col-md-8">
                          <DatePicker
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
                      <div className="row form-group w-auto">
                        <label className="col-md-4">End Date </label>
                        <div className="col-md-8">
                          <DatePicker
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
                    <th>Name</th>
                    <th>Type</th>
                    <th>Client</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    {listPermission.includes(updateProject) &&
                    listPermission.includes(deleteProject) ? (
                      <th />
                    ) : (
                      ''
                    )}
                  </tr>
                </thead>
                <tbody>{this.showListItem(listProjects)}</tbody>
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

export default ProjectManagement;
