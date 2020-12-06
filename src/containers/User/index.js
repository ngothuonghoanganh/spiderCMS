import React from 'react';
import $ from 'jquery';
import './user.css';
import * as responses from '../../constants/response';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import { get } from 'lodash';
import 'datatables.net-bs4';
import APIcaller from '../../utils/APIcaller';
import ListItemUser from './ListItemUser';
import { endpoint } from '../../constants/config';
import { getItemLocalStore } from '../../utils/handleLocalStore';
import Loading from './../../components/Loading';
import { alertPopup } from '../../utils/alertPopup';
import errorHandler from '../../utils/handlerError';
import { constant } from '../../constants/constant';
const { createUser, readUser, updateUser, deleteUser } = constant.permissions;
class User extends React.Component {
  constructor(props) {
    super(props);
    this.dataTable = React.createRef();
    this.state = {
      listUser: [],
      loading: true,
    };
  }
  componentDidMount() {
    const listRoles = getItemLocalStore('userData.roles');
    const spAdmin = 1;
    APIcaller(`${endpoint.profilesAccount}`)
      .then((res) => {
        const message = get(res, 'data.responseKey');
        console.log('profilesAccount', res);

        if (message === responses.getListSuccess) {
          const data = get(res, 'data.data');
          if (listRoles.includes(spAdmin)) {
            this.setState({
              listUser: data,
            });
          } else {
            // const profileId = getItemLocalStore('userData.profileId');
            const data = get(res, 'data.data', '');
            let users = data.filter(
              (item) =>
                Object.keys(item.account).length > 0 && item.id !== spAdmin
            );
            this.setState({
              listUser: users,
            });
          }
        } else {
          alertPopup('FAILD!!!!', errorHandler(message));
        }
      })
      .then(() => {
        this.setState({
          loading: false,
        });
        const listPermission = getItemLocalStore('listPermissions');
        if (
          listPermission.includes(createUser) &&
          listPermission.includes(readUser) &&
          listPermission.includes(updateUser) &&
          listPermission.includes(deleteUser)
        ) {
          const option =
            listPermission.includes(updateUser) ||
            listPermission.includes(deleteUser)
              ? {
                  columnDefs: [
                    { orderable: false, targets: [1, -1] },
                    { searchable: false, targets: [1, -1] },
                    { width: '10%', targets: 0 },
                    { width: '20%', targets: 1 },
                    { width: '30%', targets: 2 },
                    { width: '50%', targets: 3 },
                    { width: '20%', targets: 4 },
                  ],
                  lengthMenu: [
                    [10, 25, 50, -1],
                    [10, 25, 50, 'All'],
                  ],
                }
              : {
                  columnDefs: [
                    { orderable: false, targets: [1] },
                    { searchable: false, targets: [1] },
                  ],
                  lengthMenu: [
                    [10, 25, 50, -1],
                    [10, 25, 50, 'All'],
                  ],
                };
          const t = $(this.dataTable.current).DataTable(option);
          t.column(0)
            .nodes()
            .map((cell, i) => (cell.innerHTML = i + 1))
            .draw();
        }
      });
  }
  onDelete = (id, profileid) => {
    const { listUser } = this.state;
    this.setState({
      loading: true,
    });
    APIcaller(
      `${endpoint.deleteaccount}`,
      'DELETE',
      {},
      {
        accountId: id,
      }
    )
      .then(() => {
        APIcaller(
          `${endpoint.profileid}`,
          'DELETE',
          {},
          {
            profileId: profileid,
          }
        );
      })
      .then(() => {
        const index = this.findIndex(listUser, profileid);
        if (index !== -1) {
          listUser.splice(index, 1);
          this.setState({
            listUser,
            loading: false,
          });
        }
      });
  };
  findIndex(listUser, id) {
    let result = -1;
    listUser.forEach((users, index) => {
      if (users.id === id) {
        result = index;
      }
    });
    return result;
  }
  showlistUser(listnv) {
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
    const { listUser, loading } = this.state;
    const listPermission = getItemLocalStore('listPermissions');
    // console.log(listPermission);

    return (
      <div className="container-fluid">
        {listPermission.includes(createUser) &&
        listPermission.includes(readUser) &&
        listPermission.includes(updateUser) &&
        listPermission.includes(deleteUser) ? (
          <div className="form-add card-border-orange bg-white">
            <div className="card-header card-header-divider">
              <h3>Users Management</h3>
            </div>
            <div className="container-fluid mt-3">
              <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3">
                {loading && <Loading />}
                {listPermission.includes(createUser) ? (
                  <Link
                    to={`${endpoint.addUser}`}
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
                    {listPermission.includes(updateUser) &&
                      listPermission.includes(deleteUser) && <th />}
                  </tr>
                </thead>
                <tbody>{this.showlistUser(listUser)}</tbody>
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
export default connect(mapStateToProps, null)(User);
