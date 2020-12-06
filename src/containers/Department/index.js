import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import { NavLink, Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import LisItemPosition from './ListItemPosition';
import * as responses from '../../constants/response';
import { loadDepartment, loadPosition } from './helpers';
import './index.css';
import { endpoint } from '../../constants/config';
import { alertPopup } from '../../utils/alertPopup';
import APIcaller from '../../utils/APIcaller';
import { getItemLocalStore } from '../../utils/handleLocalStore';

class Position extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillMount() {
    this.props.loadDepartment(
      (result, listDepartment, title = '', message = '') => {
        if (result) {
          this.setState({
            listDepartment,
          });
        } else {
          alertPopup(title, message);
        }
      }
    );
  }
  componentWillReceiveProps(nextprops) {
    this.setState({
      listPosition: nextprops.listPosition,
    });
  }
  onDelete = (positionId) => {
    const { listPosition } = this.state;
    APIcaller(
      `${endpoint.position}`,
      'DELETE',
      {
        token: getItemLocalStore('token'),
        accountid: getItemLocalStore('accountid'),
      },
      {
        positionId,
      }
    ).then((res) => {
      if (res.data.responseKey === responses.deleteSuccess) {
        listPosition.forEach((item, index) => {
          if (item.id === positionId) {
            listPosition.splice(index, 1);
          }
        });
        this.setState({
          listPosition,
        });
      } else {
        alertPopup('FAILED!!!!!!', res.data.responseKey);
      }
    });
  };
  showPosition = (departmentId) => {
    const { listDepartment } = this.state;
    listDepartment.forEach((item) => {
      if (item.id === departmentId) {
        item.isActive = true;
      } else {
        item.isActive = false;
      }
      this.setState({
        listDepartment: [...listDepartment],
        id: departmentId,
      });
    });
    this.props.loadPosition(departmentId, (result, positionData) => {
      if (result) {
        this.setState({
          listPosition: positionData,
        });
      }
    });
  };
  showDepartment = (listDepartment = []) => {
    let result = [];
    if (listDepartment.length > 0) {
      result = listDepartment.map((element, index) => (
        <li className="nav-item" key={index}>
          <div
            className={
              element.isActive
                ? 'active  nav-link icon-position'
                : 'nav-link icon-position'
            }
            href="#"
            onClick={() => this.showPosition(element.id)}>
            {element.name}
            {element.isActive ? (
              <NavLink
                className="icon-position"
                to={`/${endpoint.editDepartment}/${element.id}`}>
                <FontAwesomeIcon icon="edit" />
              </NavLink>
            ) : (
              ''
            )}
          </div>
        </li>
      ));
    }
    return result;
  };
  showItemPosition = (listPosition = [], id) => {
    let result = null;
    if (listPosition.length > 0) {
      result = listPosition.map((list, index) => (
        <LisItemPosition
          key={index}
          list={list}
          index={index}
          onDelete={this.onDelete}
          id={id}
        />
      ));
    }
    return result;
  };
  render() {
    const { listDepartment, listPosition, id } = this.state;
    return (
      <div className="container-fluid">
        <div className="form-add card-border-orange bg-white position">
          <div className="card-header card-header-divider">
            <h3> Departments</h3>
          </div>
          <div className="container mt-3">
            <div className="row">
              <div className=" col-lg-12 header-department">
                <ul className="nav nav-tabs">
                  {this.showDepartment(listDepartment)}
                  <div className="nav-item add-department">
                    <NavLink
                      className="btn btn-orange"
                      exact
                      to={`/${endpoint.addDepartment}`}>
                      <FontAwesomeIcon icon="user-plus" />
                    </NavLink>
                  </div>
                </ul>
              </div>
              <div className="col-lg-12 card mt-3">
                <div className="card-body min-height">
                  {id && (
                    <div className="form-group">
                      <Link
                        to={`${endpoint.addPosition}/${id}`}
                        className="btn btn-orange float-left mb-3">
                        Add
                      </Link>
                    </div>
                  )}
                  {!isEmpty(listPosition) && (
                    <table
                      ref={this.dataTable}
                      cellSpacing="0"
                      className=" table table-bordered table-hover bg-white">
                      <thead>
                        <tr>
                          <th>Position</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>{this.showItemPosition(listPosition, id)}</tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
Position.defaultProps = {
  loadPosition: null,
};
const mapStateToProps = (state) => ({
  listPosition: state.positionData.positions,
});
const mapDispatchToProps = (dispatch) => ({
  loadDepartment: bindActionCreators(loadDepartment, dispatch),
  loadPosition: bindActionCreators(loadPosition, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Position);
