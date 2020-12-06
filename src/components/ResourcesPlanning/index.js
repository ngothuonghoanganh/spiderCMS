import React, { Component } from 'react';
import { APIcaller } from '../../utils';
import $ from 'jquery';
import 'datatables.net-bs4';
import { endpoint } from '../../constants/config';
import * as response from '../../constants/response';
import { get } from 'lodash';
import Loading from '../Loading';
import './index.css';
import { alertPopup, confirmPopup } from '../../utils/alertPopup';
import errorHandler from '../../utils/handlerError';
import ResourceItem from './ResourceItem';
import VirtualizedSelect from 'react-virtualized-select';
import moment from 'moment';
import { getItemLocalStore } from '../../utils/handleLocalStore';
import { constant } from '../../constants/constant';
import { Redirect } from 'react-router-dom';
const {
  createResources,
  // readResources,
  updateResources,
  deleteResources,
} = constant.permissions;
class ResourcesPlanning extends Component {
  constructor(props) {
    super(props);
    this.dataTableResourcePlanning = React.createRef();
    const { match } = this.props;
    this.tableResource;
    this.state = {
      year: Number(match.params.year),
      loading: true,
      listEmployees: [],
      listResourcePlannings: [],
      listProjects: [],
      selectedProjects: [],
      selectedPlanningId: null,
      isEditing: false,
    };
  }

  loadResourcesByYear = async (year) => {
    const res = await APIcaller(`${endpoint.resourcesPlanning}?year=${year}`);
    const message = get(res, 'data.responseKey');
    // console.log(res);

    if (message === response.getListSuccess) {
      return res.data.data;
    }
    // if (message !== response.notFound)
    //   alertPopup('FAILED!!!', errorHandler(message));
    return [];
  };

  loadEmployees = async (listResourcePlannings) => {
    const res = await APIcaller(`${endpoint.profiles}`);
    const message = get(res, 'data.responseKey');
    // console.log(res);

    if (message === response.getListSuccess) {
      return res.data.data
        .filter(
          ({ id }) =>
            !listResourcePlannings.map((resource) => resource.id).includes(id)
        )
        .map(({ id, firstName, lastName }) => ({
          id,
          fullName: `${firstName ? firstName : ''} ${lastName ? lastName : ''}`,
        }));
    }
    // if (message !== response.notFound)
    //   alertPopup('FAILED!!!', errorHandler(message));
    return [];
  };

  loadProjects = async () => {
    const res = await APIcaller(`${endpoint.projects}`);
    const message = get(res, 'data.responseKey');
    // console.log(res);

    if (message === response.getListSuccess) {
      return res.data.data;
    }
    // if (message !== response.notFound)
    //   alertPopup('FAILED!!!', errorHandler(message));
    return [];
  };

  componentDidMount() {
    const { year } = this.state;
    this.setState({ loading: true }, async () => {
      const listResourcePlannings = await this.loadResourcesByYear(year);
      const listEmployees = await this.loadEmployees(listResourcePlannings);
      const listProjects = await this.loadProjects();
      this.setState({
        listResourcePlannings,
        listEmployees,
        listProjects,
      });
      const listPermission = getItemLocalStore('listPermissions');

      const option =
        listPermission.includes(updateResources) &&
        listPermission.includes(deleteResources)
          ? {
              columnDefs: [
                { orderable: false, targets: [-1] },
                { searchable: false, targets: [-1] },
                { width: '10%', targets: -1 },
                { width: '20%', targets: 1 },
                { width: '10%', targets: 2 },
                { width: '10%', targets: 3 },
              ],
              lengthMenu: [
                [10, 25, 50, -1],
                [10, 25, 50, 'All'],
              ],
            }
          : {
              columnDefs: [
                { width: '10%', targets: -1 },
                { width: '20%', targets: 1 },
                { width: '10%', targets: 2 },
                { width: '10%', targets: 3 },
              ],
              lengthMenu: [
                [10, 25, 50, -1],
                [10, 25, 50, 'All'],
              ],
            };
      this.tableResource = $(this.dataTableResourcePlanning.current).DataTable(
        option
      );
      this.tableResource
        .column(0)
        .nodes()
        .map((cell, i) => (cell.innerHTML = i + 1))
        .draw();
      this.setState({ loading: false });
    });
  }

  handleChange = (name, value, index = -1) => {
    if (name === 'year') {
      const year = value;
      // load data planning from api
      const { history } = this.props;
      history.push(`/${endpoint.company}/resources/${year}`);
      window.location.reload();

      // this.setState({ loading: true }, async () => {
      //   const listResourcePlannings = await this.loadResourcesByYear(year);
      //   const listEmployees = await this.loadEmployees(listResourcePlannings);
      //   this.setState({ listEmployees, listResourcePlannings, loading: false });
      // });
    }
    // console.log(name, value);
    if (index > -1) {
      let { selectedProjects } = this.state;
      selectedProjects[index] = value;
      this.setState({ selectedProjects });
    } else this.setState({ [name]: value });
  };

  reloadTable = () => {
    const listPermission = getItemLocalStore('listPermissions');
    this.tableResource.destroy();
    $('#DataTables_Table_0_wrapper').empty();
    const option =
      listPermission.includes(updateResources) &&
      listPermission.includes(deleteResources)
        ? {
            columnDefs: [
              { orderable: false, targets: [-1] },
              { searchable: false, targets: [-1] },
              { width: '10%', targets: -1 },
              { width: '20%', targets: 1 },
              { width: '10%', targets: 2 },
              { width: '10%', targets: 3 },
            ],
            lengthMenu: [
              [10, 25, 50, -1],
              [10, 25, 50, 'All'],
            ],
          }
        : {
            columnDefs: [
              { width: '10%', targets: -1 },
              { width: '20%', targets: 1 },
              { width: '10%', targets: 2 },
              { width: '10%', targets: 3 },
            ],
            lengthMenu: [
              [10, 25, 50, -1],
              [10, 25, 50, 'All'],
            ],
          };
    this.tableResource = $(this.dataTableResourcePlanning.current).DataTable(
      option
    );
    this.tableResource
      .column(0)
      .nodes()
      .map((cell, i) => (cell.innerHTML = i + 1))
      .draw();

    if (!this.tableResource.data().any()) $('.odd').remove();
  };

  onSubmitForm = (e) => {
    e.preventDefault();
    const {
      selectedProjects,
      selectedProfileId,
      selectedPlanningId,
      year,
    } = this.state;

    const dataResource = selectedProjects
      .map((projects, index) =>
        projects.map(({ id }) => ({ projectId: id, month: index + 1, year }))
      )
      .flat(2);
    if (selectedProfileId) {
      this.setState({ loading: true }, async () => {
        if (selectedPlanningId) {
          // call Api
          const res = await APIcaller(
            `${endpoint.resourcePlanning}/?profileId=${selectedProfileId.id}`,
            'PATCH',
            {},
            { dataResource }
          );
          // console.log(res);

          const message = get(res, 'data.responseKey');
          if (message !== response.updateSuccess) {
            alertPopup('FAILED!!!', errorHandler(message));
          } else {
            this.updateForm();
            const listResourcePlannings = await this.loadResourcesByYear(year);
            this.setState({ listResourcePlannings });
            $('#modelFormId').modal('hide');
          }
        } else {
          const res = await APIcaller(
            `${endpoint.resourcePlanning}/?profileId=${selectedProfileId}`,
            'POST',
            {},
            { dataResource }
          );
          // console.log(res);

          const message = get(res, 'data.responseKey');
          if (message !== response.insertSuccess) {
            alertPopup('FAILD!!!', errorHandler(message));
          } else {
            this.updateForm();
            if (!this.state.listResourcePlannings.length) $('.odd').remove();
            const listResourcePlannings = await this.loadResourcesByYear(year);
            const listEmployees = await this.loadEmployees(
              listResourcePlannings
            );
            this.reloadTable();
            this.setState({ listResourcePlannings, listEmployees });
            $('#modelFormId').modal('hide');
          }
        }
        this.setState({ loading: false });
      });
    }
  };

  onClone = (oldYear, newYear) => {
    this.setState({ loading: true }, async () => {
      try {
        const res = await APIcaller(
          `${endpoint.resourcesPlanning}`,
          'POST',
          {},
          {
            oldYear,
            newYear,
          }
        );
        const message = res.data.responseKey;
        if (message !== response.insertSuccess) {
          alertPopup('FAILD!!!', message);
        } else {
          this.handleChange('year', newYear);
        }
        this.setState({ loading: false });
      } catch (error) {
        console.log(error);
      }
    });
  };

  updateForm = (
    selectedPlanningId = null,
    selectedProfileId = null,
    selectedProjects = [],
    isEditing = false
  ) => {
    this.setState({
      selectedProjects,
      selectedProfileId,
      selectedPlanningId,
      isEditing,
    });
  };

  onDeleteItem = (profileId) => {
    const { year } = this.state;
    this.setState({ loading: true }, async () => {
      const res = await APIcaller(
        `${endpoint.resourcePlanning}?profileId=${profileId}`,
        'DELETE',
        {},
        { year }
      );
      const message = get(res, 'data.responseKey');
      if (message !== response.deleteSuccess) {
        alertPopup('FAILD!!!', errorHandler(message));
      } else {
        const listResourcePlannings = await this.loadResourcesByYear(year);
        const listEmployees = await this.loadEmployees(listResourcePlannings);
        this.setState({ listResourcePlannings, listEmployees });
      }
      this.setState({ loading: false });
    });
  };

  showListItem = (list) => {
    if (list.length) {
      return list.map((item, index) => (
        <ResourceItem
          key={index}
          index={index}
          item={item}
          onDelete={this.onDeleteItem}
          onUpdateForm={this.updateForm}
        />
      ));
    }
    return '';
  };

  render() {
    const {
      loading,
      listResourcePlannings,
      listEmployees,
      listProjects,
      selectedProjects,
      selectedPlanningId,
      year,
      isEditing,
    } = this.state;
    // console.log(listResourcePlannings);

    const renderSelectYear = [];
    const selectStartYear = 2015;
    const selectEndYear = 2021;
    for (let i = selectStartYear; i <= selectEndYear; i++) {
      renderSelectYear.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }

    const renderSelectProjectByMonth = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ].map((month, index) => (
      <div key={index} className="row form-group w-auto">
        <label className="col-4">{month} </label>
        <div className="col-8">
          <VirtualizedSelect
            options={listProjects}
            multi
            onChange={(value) => {
              this.handleChange(`selectedProjects`, value, index);
            }}
            placeholder="Select Project"
            value={selectedProjects[index]}
            labelKey="projectName"
            valueKey="id"
          />
        </div>
      </div>
    ));

    const listPermission = getItemLocalStore('listPermissions');

    return (
      <div className="container-fluid">
        {listPermission.includes('readResources') ? (
          <div className="form-add card-border-orange bg-white">
            <div className="card-header card-header-divider">
              <h3>Resources Management</h3>
            </div>
            {loading && <Loading />}
            <div className="form-inline ml-3">
              <label>Select Year: </label>
              <select
                className="custom-select ml-2 rounded-0"
                value={year}
                onChange={({ target: { value } }) => {
                  this.handleChange('year', value);
                }}>
                {renderSelectYear}
              </select>
              {listPermission.includes(createResources) &&
              listResourcePlannings.length !== 0 ? (
                <button
                  type="button"
                  className="btn btn-orange ml-3 mr-3"
                  onClick={() => {
                    const currentYear = moment().year();
                    confirmPopup(
                      'Clone Resource Plannings',
                      `Do you want to clone all planning from ${currentYear} to ${currentYear +
                        1}?`,
                      () => {
                        this.onClone(currentYear, currentYear + 1);
                      }
                    );
                  }}>
                  Clone
                </button>
              ) : (
                ''
              )}
            </div>

            <div className="container-fluid mt-3">
              {listPermission.includes(createResources) && (
                <button
                  type="button"
                  className="btn btn-orange mb-3"
                  data-toggle="modal"
                  onClick={() => {
                    this.updateForm();
                    $('#modelFormId').modal('show');
                  }}>
                  Add
                </button>
              )}

              <div
                className="modal fade"
                id="modelFormId"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="modelTitleId"
                aria-hidden="true">
                <div className="modal-dialog" role="document">
                  <div className="modal-content">
                    <form onSubmit={this.onSubmitForm} className="form">
                      <div className="modal-header px-4">
                        <h5>
                          {selectedPlanningId
                            ? 'Edit Resource'
                            : 'Add Resource'}
                        </h5>
                      </div>
                      <div className="modal-body px-4">
                        <div className="row form-group w-auto">
                          <label className="col-4">
                            Employee<span className="text-danger"> *</span>
                          </label>
                          <div className="col-8">
                            <VirtualizedSelect
                              options={listEmployees}
                              required
                              simpleValue
                              style={{ color: 'red' }}
                              onChange={(value) => {
                                this.handleChange('selectedProfileId', value);
                              }}
                              value={this.state.selectedProfileId}
                              labelKey="fullName"
                              valueKey="id"
                              disabled={isEditing}
                            />
                          </div>
                        </div>
                        {renderSelectProjectByMonth}
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
              </div>

              <table
                ref={this.dataTableResourcePlanning}
                cellSpacing="0"
                className="table-responsive table table-bordered table-hover bg-white"
                style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Employee Name</th>
                    <th>January</th>
                    <th>February</th>
                    <th>March</th>
                    <th>April</th>
                    <th>May</th>
                    <th>June</th>
                    <th>July</th>
                    <th>August</th>
                    <th>September</th>
                    <th>October</th>
                    <th>November</th>
                    <th>December</th>
                    {listPermission.includes(updateResources) &&
                      listPermission.includes(deleteResources) && <th />}
                  </tr>
                </thead>
                <tbody>{this.showListItem(listResourcePlannings)}</tbody>
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

export default ResourcesPlanning;
