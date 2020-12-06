import React from 'react';
import VirtualizedSelect from 'react-virtualized-select';
import profileImg from './profile_ava.svg';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { get, isEmpty } from 'lodash';
import './index.css';
import { endpoint } from './../../constants/config';
import { loadPosition } from '../Department/helpers';
import { getItemLocalStore } from '../../utils/handleLocalStore';
import { alertPopup, confirmPopup } from '../../utils/alertPopup';
import APIcaller from '../../utils/APIcaller';
import * as responses from '../../constants/response';
import errorHandler from '../../utils/handlerError';
class SetPosition extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileUpload: null,
      avatar: '',
      loading: false,
      listItem: [],
    };
  }
  componentDidMount() {
    const { match } = this.props;
    const id = get(match, 'params.id');
    APIcaller(`${endpoint.profileid}?profileId=${id}`, 'GET', {
      token: getItemLocalStore('token'),
      accountid: getItemLocalStore('accountid'),
    }).then((res) => {
      if (res.data.responseKey === responses.getOneSuccess) {
        const listItem = [];
        const data = get(res, 'data.data', {});
        const positions = get(res, 'data.data.positions', {});
        const message = get(res, 'data.responseKey');
        if (!isEmpty(positions)) {
          positions.forEach((item) => {
            const Items = {
              department: item.departmentName,
              position: item.positionName,
              positionIdTemp: item.positionId,
              departmentIdTemp: item.departmentId,
              profilePositionId: item.profilePositionId,
            };
            listItem.push(Items);
          });
          this.setState({
            listItem: [...listItem],
          });
        }
        if (data) {
          this.setState({
            avatar: data.avatar,
          });
          APIcaller(`${endpoint.departments}`, 'GET', {
            token: getItemLocalStore('token'),
            accountid: getItemLocalStore('accountid'),
          }).then((res) => {
            const departmentData = get(res, 'data.data', '');
            this.setState({
              listDepartment: departmentData,
            });
          });
        } else {
          alertPopup('FAILD!!!!', errorHandler(message));
        }
      } else {
        alertPopup('FAILD!!!!', errorHandler(res.data.responseKey));
      }
    });
  }
  onChange = (e) => {
    const { target } = e;
    const { name } = target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({
      [name]: value,
    });
  };
  onSave = (e) => {
    e.preventDefault();
    const { match } = this.props;
    const {
      positionId,
      listItem,
      selectValueDepartment,
      selectValuePosition,
    } = this.state;
    const profileId = get(match, 'params.id');
    if (listItem.length > 0) {
      listItem.forEach((item) => {
        if (positionId === item.positionIdTemp) {
          alertPopup('FAILD!!!!', 'Position have already exist');
        }
      });
    }
    APIcaller(
      `${endpoint.profilePosition}`,
      'POST',
      {
        token: getItemLocalStore('token'),
        accountid: getItemLocalStore('accountid'),
      },
      {
        positionId,
        profileId,
      }
    ).then((res) => {
      if (res.data.responseKey === responses.insertSuccess) {
        const Items = {
          department: selectValueDepartment,
          position: selectValuePosition,
          positionIdTemp: positionId,
        };
        listItem.push(Items);
        this.setState({
          listItem: [...listItem],
        });
      } else {
        alertPopup('FAILD!!!!', errorHandler(res.data.responseKey));
      }
    });
  };
  onDelete = (profilePositionId) => {
    const { listItem } = this.state;
    confirmPopup('Warnning', 'Do you want to delete?', () => {
      APIcaller(
        `${endpoint.profilePosition}`,
        'DELETE',
        {
          token: getItemLocalStore('token'),
          accountid: getItemLocalStore('accountid'),
        },
        {
          profilePositionId,
        }
      ).then((res) => {
        if (res.data.responseKey === responses.deleteSuccess) {
          listItem.forEach((item, index) => {
            if (profilePositionId === item.profilePositionId) {
              listItem.splice(index, 1);
              this.setState({
                listItem: [...listItem],
              });
            }
          });
        }
      });
    });
  };
  updateValueDepartment = (newValue) => {
    const { listDepartment } = this.state;
    this.setState({
      selectValueDepartment: newValue,
      listPosition: '',
    });
    listDepartment.forEach((item) => {
      if (item.name === newValue) {
        this.props.loadPosition(item.id, (result, positionData) => {
          if (result) {
            this.setState({
              listPosition: positionData,
              departmentId: item.id,
            });
          }
        });
      }
    });
  };
  updateValuePosition = (newValue) => {
    const { listPosition } = this.state;
    this.setState({
      selectValuePosition: newValue,
    });
    listPosition.forEach((item) => {
      if (item.name === newValue) {
        this.setState({
          positionId: item.id,
        });
      }
    });
  };
  ShowChild = (listItem = []) => {
    let result = [];
    if (listItem.length > 0) {
      result = listItem.map((element, index) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{element.department}</td>
          <td>{element.position}</td>
          <td>
            <div className="btn-group">
              <button
                className="btn btn-orange"
                type="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                onClick={() => this.onDelete(element.profilePositionId)}>
                Delete
              </button>
            </div>
          </td>
        </tr>
      ));
    }
    return result;
  };
  render() {
    const { avatar, listDepartment, listPosition, listItem } = this.state;
    console.log(listDepartment);

    const listPermission = getItemLocalStore('listPermissions');
    if (
      listPermission.includes('updateAccount') ||
      listPermission.includes('updateProfile')
    ) {
      return (
        <div className="container-fluid">
          <div className="form-add card-border-orange bg-white">
            <div className="card-header card-header-divider">Add Position</div>
            <div className="container mt-3">
              <div className="row">
                <div className="col-lg-4">
                  {!avatar ? (
                    <img alt="" src={profileImg} className="dropzone-user" />
                  ) : (
                    <img
                      alt=""
                      src={`${!avatar ? '#' : endpoint.url}/${
                        endpoint.imageURL
                      }/${avatar}`}
                      className="dropzone-user"
                    />
                  )}
                </div>
                <div className="col-lg-8 personal-info">
                  <form className="form-horizontal" onSubmit={this.onSave}>
                    <div className="row form-group">
                      <label className="col-md-2 col-form-label ">
                        Department
                      </label>
                      <div className="col-md-3">
                        <div className="button-group">
                          <VirtualizedSelect
                            options={listDepartment}
                            simpleValue
                            name="select-department"
                            onChange={this.updateValueDepartment}
                            value={this.state.selectValueDepartment}
                            labelKey="name"
                            valueKey="name"
                          />
                        </div>
                      </div>
                      <label className="col-md-2 col-form-label ">
                        Position
                      </label>
                      <div className="col-md-3">
                        <div className="button-group">
                          <VirtualizedSelect
                            options={listPosition}
                            simpleValue
                            name="select-position"
                            onChange={this.updateValuePosition}
                            value={this.state.selectValuePosition}
                            labelKey="name"
                            valueKey="name"
                          />
                        </div>
                      </div>
                      <div className="col-md-2">
                        <button type="submit" className="btn btn-orange">
                          {' '}
                          Add
                        </button>
                      </div>
                    </div>
                    <div className="row form-group">
                      <table
                        ref={this.dataTable}
                        cellSpacing="0"
                        className="table table-bordered table-striped table-hover bg-white">
                        <thead>
                          <tr>
                            <th>No.</th>
                            <th>Department Name</th>
                            <th>Position Name</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>{this.ShowChild(listItem)}</tbody>
                      </table>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return <div>You have no permission on this page</div>;
  }
}
const mapStateToProps = (state) => ({
  listPosition: state.positionData.positions,
});
const mapDispatchToProps = (dispatch) => ({
  loadPosition: bindActionCreators(loadPosition, dispatch),
});
export default connect(mapStateToProps, mapDispatchToProps)(SetPosition);
