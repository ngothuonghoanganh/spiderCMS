import React from 'react';
import $ from 'jquery';
import 'datatables.net-bs4';
import { connect } from 'react-redux';
import * as responses from '../../constants/response';
import './index.css';
import APIcaller from '../../utils/APIcaller';
import ListItemUser from './listNoti';
import { endpoint } from '../../constants/config';
import { getItemLocalStore } from '../../utils/handleLocalStore';
class Staff extends React.Component {
  constructor(props) {
    super(props);
    this.dataTable = React.createRef();
    this.state = {
      haveBirthday: [],
      loading: true,
    };
  }

  componentDidMount() {
    const accountid = getItemLocalStore('accountid');
    console.log(accountid);

    APIcaller(`${endpoint.notifications}?profileId=${accountid}`, 'GET', {
      token: getItemLocalStore('token'),
      accountid: getItemLocalStore('accountid'),
    })
      .then((res) => {
        console.log(res);
        if (res.data.responseKey === responses.getListSuccess) {
          this.setState({
            haveBirthday: res.data.data,
          });
        }
      })
      .then(() => {
        this.setState({
          loading: false,
        });
        const t = $(this.dataTable.current).DataTable({
          columnDefs: [
            { orderable: false, targets: [1, -1] },
            { searchable: false, targets: [1, -1] },
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
      });
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
    const { haveBirthday } = this.state;
    // console.log(haveBirthday);
    return (
      <div className="container-fluid">
        <div className="form-add card-border-orange bg-white">
          <div className="card-header card-header-divider">
            <h3>Notification Management</h3>
          </div>
          <div className="container-fluid mt-3">
            <div className="table-width">
              <table
                ref={this.dataTable}
                cellSpacing="0"
                className="table-responsive table table-bordered table-hover bg-white"
                style={{ width: '100%' }}>
                <thead>
                  <tr>
                    <th>No.</th>
                    <th>Avatar</th>
                    <th>Employee No.</th>
                    <th>Full Name</th>
                    <th>Position</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Skype</th>
                    <th>Gender</th>
                    <th>Marital Status</th>
                    <th>Birthday</th>
                  </tr>
                </thead>
                <tbody>{this.showlistNV(haveBirthday)}</tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(null, null)(Staff);
