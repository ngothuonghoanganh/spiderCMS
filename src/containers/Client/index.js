import React, { Component } from 'react';
import $ from 'jquery';
import Loading from '../../components/Loading';
import { APIcaller } from '../../utils';
import { endpoint } from '../../constants/config';
import { Redirect } from 'react-router-dom';
import { alertPopup, confirmPopup } from '../../utils/alertPopup';
import { get } from 'lodash';
import errorHandler from '../../utils/handlerError';
import * as response from '../../constants/response';
import { getItemLocalStore } from '../../utils/handleLocalStore';
import { constant } from '../../constants/constant';
const { readClient, updateClient, deleteClient } = constant.permissions;
class Client extends Component {
  constructor(props) {
    super(props);
    this.dataTableClients = React.createRef();
    this.state = {
      loading: false,
      clientName: '',
      clientId: '',
      taxCode: '',
      address: '',
      email: '',
      telephone: '',
      contactPoint: '',
      listClients: [],
    };
  }

  componentDidMount() {
    APIcaller(`${endpoint.clients}`, 'GET')
      .then((res) => {
        const message = get(res, 'data.responseKey');

        if (message === response.getListSuccess) {
          this.setState({
            listClients: res.data.data,
          });
        }
        this.setState({ loading: false });
      })
      .then(() => {
        const listPermission = getItemLocalStore('listPermissions');
        if (listPermission.includes(readClient)) {
          const option =
            listPermission.includes(updateClient) &&
            listPermission.includes(deleteClient)
              ? {
                  columnDefs: [
                    { orderable: false, targets: [-1] },
                    { searchable: false, targets: [-1] },
                    { width: '10%', targets: 0 },
                    { width: '20%', targets: 1 },
                    { width: '10%', targets: 2 },
                    { width: '20%', targets: 3 },
                    { width: '20%', targets: 4 },
                    { width: '20%', targets: 5 },
                    { width: '30%', targets: 6 },
                  ],
                  lengthMenu: [
                    [10, 25, 50, -1],
                    [10, 25, 50, 'All'],
                  ],
                }
              : {
                  columnDefs: [
                    { width: '10%', targets: 0 },
                    { width: '20%', targets: 1 },
                    { width: '10%', targets: 2 },
                    { width: '20%', targets: 3 },
                    { width: '20%', targets: 4 },
                    { width: '20%', targets: 5 },
                    { width: '30%', targets: 6 },
                  ],
                  lengthMenu: [
                    [10, 25, 50, -1],
                    [10, 25, 50, 'All'],
                  ],
                };
          const t = $(this.dataTableClients.current).DataTable(option);
          t.column(0)
            .nodes()
            .map((cell, i) => (cell.innerHTML = i + 1))
            .draw();
        }
      });
  }

  onSubmitForm = (e) => {
    e.preventDefault();
    const {
      clientId,
      clientName,
      listClients,
      taxCode,
      address,
      email,
      telephone,
      contactPoint,
    } = this.state;
    this.setState({ loading: true });

    if (clientId) {
      // sumit to Edit
      APIcaller(
        `${endpoint.client}/?clientId=${clientId}`,
        'PATCH',
        {},
        {
          clientName,
          taxCode,
          address,
          email,
          telephone,
          contactPoint,
        }
      ).then((res) => {
        const message = get(res, 'data.responseKey');
        if (message !== response.updateSuccess) {
          alertPopup('FAILED!!!', errorHandler(message));
        } else {
          const list = listClients.filter((ele) => ele.id === clientId);
          list[0].clientName = clientName;
          list[0].taxCode = taxCode;
          list[0].address = address;
          list[0].email = email;
          list[0].telephone = telephone;
          list[0].contactPoint = contactPoint;

          this.setState({ listClients });
          this.updateForm();
          $('#modelFormId').modal('hide');
        }
        this.setState({ loading: false });
      });
    } else {
      // submit to Add
      APIcaller(
        `${endpoint.client}`,
        'POST',
        {},
        { clientName, taxCode, address, email, telephone, contactPoint }
      ).then((res) => {
        const message = get(res, 'data.responseKey');
        if (message !== response.insertSuccess) {
          alertPopup('FAILED!!!', errorHandler(message));
        } else {
          APIcaller(`${endpoint.clients}`, 'GET').then((res) => {
            const message = get(res, 'data.responseKey');
            if (message === response.getListSuccess) {
              if (!this.state.listClients.length) $('.odd').remove();
              this.setState({
                listClients: res.data.data,
              });
            }
          });
          this.updateForm();
          $('#modelFormId').modal('hide');
        }
        this.setState({ loading: false });
      });
    }
  };

  updateForm = (
    clientId = '',
    clientName = '',
    taxCode = '',
    address = '',
    email = '',
    telephone = '',
    contactPoint = ''
  ) => {
    this.setState({
      clientId,
      clientName,
      taxCode,
      address,
      email,
      telephone,
      contactPoint,
    });
  };

  handleChange = ({ target: { name, value, type, check } }) => {
    this.setState({ [name]: type === 'checkbox' ? check : value });
  };

  handleDeleteItem = (clientId) => {
    this.setState({ loading: true });
    APIcaller(`${endpoint.client}?clientId=${clientId}`, 'DELETE').then(
      (res) => {
        const message = get(res, 'data.responseKey');
        if (message !== response.deleteSuccess) {
          alertPopup('FAILED!!!', errorHandler(message));
        } else {
          let { listClients } = this.state;
          let index = listClients.map(({ id }) => id).indexOf(clientId);

          if (index > -1 && index !== listClients.length - 1) {
            listClients.splice(index, 1);
          } else if (index === listClients.length - 1) {
            listClients.pop();
          }
          this.setState({ listClients });
        }
        this.setState({ loading: false });
      }
    );
  };

  showListItem = (list) => {
    const listPermission = getItemLocalStore('listPermissions');

    return list.map(
      (
        { id, clientName, taxCode, address, email, telephone, contactPoint },
        index
      ) => (
        <tr key={index}>
          <td>{index}</td>
          <td>{clientName}</td>
          <td>{taxCode}</td>
          <td>{address}</td>
          <td>{email}</td>
          <td>{telephone}</td>
          <td>{contactPoint}</td>

          {listPermission.includes(updateClient) &&
          listPermission.includes(deleteClient) ? (
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
                  {listPermission.includes(updateClient) && (
                    <button
                      className="dropdown-item"
                      type="button"
                      data-toggle="modal"
                      onClick={(e) => {
                        this.updateForm(
                          id,
                          clientName,
                          taxCode,
                          address,
                          email,
                          telephone,
                          contactPoint
                        );
                        $('#modelFormId').modal('show');
                      }}>
                      Edit
                    </button>
                  )}
                  {listPermission.includes(deleteClient) && (
                    <button
                      className="dropdown-item"
                      type="button"
                      onClick={() => {
                        confirmPopup(
                          'Delete Project',
                          `Do you want to delete this client '${clientName}'?`,
                          () => {
                            this.handleDeleteItem(id);
                          }
                        );
                      }}>
                      Delete
                    </button>
                  )}
                </div>
              </div>
            </td>
          ) : (
            ''
          )}
        </tr>
      )
    );
  };
  render() {
    const {
      loading,
      clientName,
      listClients,
      clientId,
      taxCode,
      address,
      email,
      telephone,
      contactPoint,
    } = this.state;

    const listPermission = getItemLocalStore('listPermissions');

    return (
      <div className="container-fluid">
        {listPermission.includes(readClient) ? (
          <div className="form-add card-border-orange bg-white">
            <div className="card-header card-header-divider">
              <h3>Clients Management</h3>
            </div>
            {loading && <Loading />}
            <div className="container-fluid mt-3 client-page">
              {listPermission.includes('createClient') ? (
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
                      <h5>{clientId ? 'Edit Client' : 'Add Client'}</h5>
                    </div>
                    <div className="modal-body px-4">
                      <div className="row form-group w-auto">
                        <label className="col-md-4">
                          Client Name
                          <strong className="text-danger"> *</strong>
                        </label>
                        <div className="col-md-8">
                          <input
                            required
                            type="text"
                            name="clientName"
                            placeholder="Client Name"
                            className="form-control"
                            value={clientName}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                      <div className="row form-group w-auto">
                        <label className="col-md-4">
                          Tax Code
                          <strong className="text-danger"> *</strong>
                        </label>
                        <div className="col-md-8">
                          <input
                            required
                            type="text"
                            name="taxCode"
                            placeholder="Tax Code"
                            className="form-control"
                            value={taxCode}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                      <div className="row form-group w-auto">
                        <label className="col-md-4">
                          Address
                          <strong className="text-danger"> *</strong>
                        </label>
                        <div className="col-md-8">
                          <input
                            required
                            type="text"
                            name="address"
                            placeholder="Address"
                            className="form-control"
                            value={address}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                      <div className="row form-group w-auto">
                        <label className="col-md-4">
                          Email
                          <strong className="text-danger"> *</strong>
                        </label>
                        <div className="col-md-8">
                          <input
                            required
                            type="email"
                            name="email"
                            placeholder="Email"
                            className="form-control"
                            value={email}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                      <div className="row form-group w-auto">
                        <label className="col-md-4">Telephone</label>
                        <div className="col-md-8">
                          <input
                            type="number"
                            name="telephone"
                            placeholder="Telephone"
                            className="form-control"
                            value={telephone}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                      <div className="row form-group w-auto">
                        <label className="col-md-4">Contact Point</label>
                        <div className="col-md-8">
                          <input
                            type="text"
                            name="contactPoint"
                            placeholder="Contact Point"
                            className="form-control"
                            value={contactPoint}
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
                ref={this.dataTableClients}
                cellSpacing="0"
                className="table-responsive table table-bordered table-hover bg-white"
                style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Name</th>
                    <th>Tax Code</th>
                    <th>Address</th>
                    <th>Email</th>
                    <th>Telephone</th>
                    <th>Contact Point</th>
                    {listPermission.includes('updateClient') &&
                    listPermission.includes('deleteClient') ? (
                      <th />
                    ) : (
                      ''
                    )}
                  </tr>
                </thead>
                <tbody>{this.showListItem(listClients)}</tbody>
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

export default Client;
