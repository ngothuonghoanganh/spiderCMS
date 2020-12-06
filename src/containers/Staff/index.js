import React from 'react';
import $ from 'jquery';
import 'datatables.net-bs4';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as responses from '../../constants/response';
import './index.css';
import { get } from 'lodash';
import APIcaller from '../../utils/APIcaller';
import ListItemUser from './ListItem';
import { endpoint } from '../../constants/config';
import { getItemLocalStore } from '../../utils/handleLocalStore';
import Loading from './../../components/Loading';
import { alertPopup } from '../../utils/alertPopup';
import errorHandler from '../../utils/handlerError';
import { constant } from '../../constants/constant';
const {
  createEmployee,
  deleteEmployee,
  updateEmployee,
  readEmployee,
} = constant.permissions;
class Staff extends React.Component {
  constructor(props) {
    super(props);
    this.dataTable = React.createRef();
    this.state = {
      listEmployees: [],
      loading: true,
    };
  }
  componentDidMount() {
    APIcaller(`${endpoint.profiles}`)
      .then((res) => {
        const message = get(res, 'data.responseKey');
        localStorage.setItem('employee', res.data.data);
        if (message === responses.getListSuccess) {
          this.setState({
            listEmployees: res.data.data,
          });
        } else if (message !== responses.notFound)
          alertPopup('FAILD!!!!', errorHandler(message));
      })
      .then(() => {
        this.setState({
          loading: false,
        });
        const listPermission = getItemLocalStore('listPermissions');
        if (listPermission.includes(readEmployee)) {
          const t = $(this.dataTable.current).DataTable({
            columnDefs: [
              { orderable: false, targets: [1, -1] },
              { searchable: false, targets: [1, -1] },
              { width: '5%', targets: -1 },
              { width: '10%', targets: 1 },
              { width: '10%', targets: 2 },
              { width: '20%', targets: 3 },
              { width: '10%', targets: 4 },
              { width: '10%', targets: 5 },
            ],
            lengthMenu: [
              [10, 25, 50, -1],
              [10, 25, 50, 'All'],
            ],
          });
          t.column(0)
            .nodes()
            .map((cell, i) => (cell.innerHTML = i + 1))
            .draw();
        }
      });
  }
  onDelete = (id) => {
    const { listEmployees } = this.state;
    this.setState({
      loading: true,
    });
    APIcaller(
      `${endpoint.profileid}`,
      'DELETE',
      {},
      {
        profileId: id,
      }
    ).then((res) => {
      if (res.data.message === 'delete successfully') {
        this.setState({
          loading: false,
        });
        const index = this.findIndex(listEmployees, id);
        if (index !== -1) {
          listEmployees.splice(index, 1);
          this.setState({
            listEmployees,
          });
        }
      }
    });
  };
  findIndex(listEmployees, id) {
    let result = -1;
    listEmployees.forEach((employee, index) => {
      if (employee.id === id) {
        result = index;
      }
    });
    return result;
  }
  showlistNV(listnv) {
    let result = null;
    if (listnv.length > 0) {
      result = listnv.map((list, index) => (
        <ListItemUser
          key={index}
          list={list}
          index={index}
          onDelete={this.onDelete}
        />
      ));
    }
    return result;
  }
  render() {
    const { listEmployees, loading } = this.state;
    const listPermission = getItemLocalStore('listPermissions');
    return (
      <div className="container-fluid">
        {listPermission.includes(readEmployee) ? (
          <div className="form-add card-border-orange bg-white">
            <div className="card-header card-header-divider">
              <h3>Employees Management</h3>
            </div>
            <div className="container-fluid mt-3">
              <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3">
                {loading && <Loading />}
                {listPermission.includes(createEmployee) ? (
                  <Link
                    to={`/${endpoint.addEmployee}`}
                    className="btn btn-orange float-right">
                    Add
                  </Link>
                ) : (
                  ''
                )}
              </div>
              <table
                ref={this.dataTable}
                cellSpacing="0"
                className="table-responsive table table-bordered table-hover bg-white"
                style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Avatar</th>
                    <th>Full Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Skype</th>
                    <th>Gender</th>
                    <th>Marital Status</th>
                    <th>Birthday</th>
                    <th>Joining Date</th>
                    <th>Left Date</th>
                    {(listPermission.includes(updateEmployee) ||
                      listPermission.includes(deleteEmployee)) && <th />}
                  </tr>
                </thead>
                <tbody>{this.showlistNV(listEmployees)}</tbody>
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

const mapStateToProps = (state) => ({
  listnv: state,
});
export default connect(mapStateToProps, null)(Staff);
