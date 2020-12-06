import React from 'react';
import { isNumber, isNull } from 'lodash';
import { Link } from 'react-router-dom';
import 'react-confirm-alert/src/react-confirm-alert.css';
import SuperTreeView from 'react-super-treeview';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { loadDepartment } from './../Department/helpers';
import { showTreePosition } from './actions';
import './index.css';
import { alertPopup } from '../../utils/alertPopup';
import profileImg from './profile_ava.svg';
import PositionItem from './ChildPosition/ChildPosition';
import * as responses from '../../constants/response';
import APIcaller from '../../utils/APIcaller';
import { endpoint } from '../../constants/config';
import { getItemLocalStore } from '../../utils/handleLocalStore';
class ViewTree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listDepartment: [],
      positions: [],
      firstName: '',
      lastName: '',
      avatar: '',
      position: '',
      haveAccount: '',
      noParent: [],
      email: '',
      ListNoParent: [],
      addClass: false,
      haveList: false,
      haveCard: false,
    };
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
  toggle = () => {
    this.setState({ addClass: !this.state.addClass });
  };
  showTree = (departmentId) => {
    this.setState({
      ListNoParent: [],
      noParent: [],
      haveList: false,
      haveCard: false,
    });
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
    this.props.showTreePosition(
      departmentId,
      (result, listPosition, freshData) => {
        let tempChild = [];
        // console.log(freshData);

        if (result && freshData.length > 0) {
          for (let i = 0; i < freshData.length; i += 1) {
            if (
              freshData[i].havechild === 'no' &&
              isNull(freshData[i].parentInChart) &&
              freshData[i].level !== 1
            ) {
              tempChild = [...tempChild, freshData[i]];
              freshData.splice(i, 1);
              i -= 1;
            }
          }
          this.setState({
            listparent: freshData,
            noParent: tempChild,
            profileID: '',
          });
        } else {
          this.setState({
            listparent: [],
          });
        }
        if (result && listPosition.length > 0) {
          for (let i = 0; i < listPosition.length; i += 1) {
            if (
              listPosition[i].havechild === 'no' &&
              isNull(listPosition[i].parentInChart) &&
              listPosition[i].level !== 1
            ) {
              tempChild = [...tempChild, listPosition[i]];
              listPosition.splice(i, 1);
              i -= 1;
            }
          }
          this.setState({
            positions: listPosition,
            profileID: '',
          });
        } else {
          this.setState({
            positions: [],
          });
        }
      }
    );
  };
  showDepartment = (listDepartment = []) => {
    let result = [];
    if (listDepartment.length > 0) {
      result = listDepartment.map((element, index) => (
        <li className="nav-item" key={index}>
          <div
            className={
              element.isActive
                ? 'active  nav-link iconposition'
                : 'nav-link iconposition '
            }
            href="#"
            onClick={() => this.showTree(element.id)}>
            {element.name}
          </div>
        </li>
      ));
    }
    return result;
  };
  CreateListNoParent = (noParent) => {
    const { haveList } = this.state;
    if (noParent.length <= 0) {
      alertPopup('FAILD!!!!', 'Have no Position Free');
    } else {
      this.setState({
        haveList: !haveList,
        ListNoParent: [...noParent],
      });
    }
  };
  RemoveChild = (idPosition) => {
    const { ListNoParent, id } = this.state;
    ListNoParent.forEach((element, index) => {
      if (element.profilePositionId === idPosition) {
        ListNoParent.splice(index, 1);
      }
    });
    this.props.showTreePosition(id, (result, listPosition, freshData) => {
      let tempChild = [];
      if (result && freshData.length > 0) {
        for (let i = 0; i < freshData.length; i += 1) {
          if (
            freshData[i].havechild === 'no' &&
            isNull(freshData[i].parentInChart) &&
            freshData[i].level !== 1
          ) {
            tempChild = [...tempChild, freshData[i]];
            freshData.splice(i, 1);
            i -= 1;
          }
        }
        this.setState({
          listparent: freshData,
          noParent: tempChild,
          profileID: '',
          haveList: false,
        });
      } else {
        this.setState({
          listparent: [],
          haveList: false,
        });
      }
      if (result && listPosition.length > 0) {
        for (let i = 0; i < listPosition.length; i += 1) {
          if (
            listPosition[i].havechild === 'no' &&
            isNull(listPosition[i].parentInChart) &&
            listPosition[i].level !== 1
          ) {
            tempChild = [...tempChild, listPosition[i]];
            listPosition.splice(i, 1);
            i -= 1;
          }
        }
        this.setState({
          positions: listPosition,
          profileID: '',
        });
      } else {
        this.setState({
          positions: [],
        });
      }
    });
  };
  RemoveParent = (PositionId, parentInChart, id) => {
    if (!isNull(parentInChart)) {
      APIcaller(
        `${endpoint.deleteParent}`,
        'DELETE',
        {
          token: getItemLocalStore('token'),
          accountid: getItemLocalStore('accountid'),
        },
        {
          profilePosisionId: PositionId,
          profilePositionParentId: parentInChart,
        }
      ).then((res) => {
        if (res.data.responseKey === responses.updateSuccess) {
          this.props.showTreePosition(id, (result, listPosition, freshData) => {
            let tempChild = [];
            if (result && freshData.length > 0) {
              for (let i = 0; i < freshData.length; i += 1) {
                if (
                  freshData[i].havechild === 'no' &&
                  isNull(freshData[i].parentInChart) &&
                  freshData[i].level !== 1
                ) {
                  tempChild = [...tempChild, freshData[i]];
                  freshData.splice(i, 1);
                  i -= 1;
                }
              }
              this.setState({
                listparent: freshData,
                noParent: tempChild,
                profileID: '',
              });
            } else {
              this.setState({
                listparent: [],
              });
            }
            if (result && listPosition.length > 0) {
              for (let i = 0; i < listPosition.length; i += 1) {
                if (
                  listPosition[i].havechild === 'no' &&
                  isNull(listPosition[i].parentInChart) &&
                  listPosition[i].level !== 1
                ) {
                  tempChild = [...tempChild, listPosition[i]];
                  listPosition.splice(i, 1);
                  i -= 1;
                }
              }
              this.setState({
                positions: listPosition,
                profileID: '',
              });
            } else {
              this.setState({
                positions: [],
              });
            }
          });
        }
      });
    }
  };
  render() {
    const listPermissions = getItemLocalStore('listPermissions');
    const {
      listDepartment,
      id,
      positions,
      noParent,
      name,
      avatar,
      profileID,
      position,
      haveAccount,
      email,
      PositionId,
      listparent,
      level,
      childnumber,
      phone,
      skype,
      parentInChart,
      haveList,
      haveCard,
    } = this.state;
    // console.log(this.state);

    return (
      <div className="container-fluid">
        <div className="form-add card-border-orange bg-white">
          <div className="card-header card-header-divider">
            <h3>Organization Tree</h3>
          </div>
          <div className="container mt-3">
            <div className="row">
              <div className=" col-md-12 header-treeview mb-3">
                <ul className="nav nav-color">
                  {this.showDepartment(listDepartment)}
                </ul>
              </div>
              <div className="col-sm-4">
                <div className="row">
                  {isNumber(id) ? (
                    <div className="card">
                      <div className="card-body card-left">
                        <div className="tree-view">
                          <label className="title">
                            Employee have position
                          </label>
                          <SuperTreeView
                            data={positions}
                            onUpdateCb={(updatedData) => {
                              this.setState({ positions: updatedData });
                            }}
                            onCheckToggleCb={(arrayOfNodes) => {
                              arrayOfNodes.map((item) => {
                                this.setState({
                                  name: item.name,
                                  avatar: item.avatar,
                                  profileID: item.id,
                                  PositionId: item.profilePositionId,
                                  position: item.positionName,
                                  level: item.level,
                                  childnumber: item.childnumber,
                                  phone: item.phone,
                                  email: item.email,
                                  skype: item.skype,
                                  parentInChart: item.parentInChart,
                                  haveCard: true,
                                });
                              });
                            }}
                            deleteElement={false}
                          />
                          <label className="title mt-3">
                            Employee have no parent
                          </label>
                          <SuperTreeView
                            data={noParent}
                            onUpdateCb={(updatedData) => {
                              this.setState({ noParent: updatedData });
                            }}
                            onCheckToggleCb={(arrayOfNodes) => {
                              arrayOfNodes.map((item) => {
                                this.setState({
                                  name: item.name,
                                  avatar: item.avatar,
                                  profileID: item.id,
                                  PositionId: item.profilePositionId,
                                  position: item.positionName,
                                  level: item.level,
                                  childnumber: item.childnumber,
                                  phone: item.phone,
                                  email: item.email,
                                  skype: item.skype,
                                  parentInChart: item.parentInChart,
                                  haveCard: true,
                                  haveList: false,
                                });
                              });
                            }}
                            deleteElement={false}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
              <div className="col-sm-8">
                <div className="row">
                  <div className="col-sm-12">
                    {isNumber(profileID) && haveCard ? (
                      <div className="card-info">
                        <div className="row">
                          <div className="col-md-3">
                            <div className="card-avt">
                              {!avatar ? (
                                <img
                                  src={profileImg}
                                  width="50"
                                  height="50"
                                  alt="Avatar"
                                />
                              ) : (
                                <img
                                  src={`${endpoint.url}/${endpoint.imageURL}/${this.state.avatar}`}
                                  className="avt-header"
                                  alt="Avatar"
                                />
                              )}
                            </div>
                          </div>
                          <div className="col-md-9 card-content">
                            <div className="text-top">
                              <h3>{name}</h3>
                              <p>{position}</p>
                            </div>
                            <div className="text-bottom">
                              <div className="position-item">
                                Phone:{' '}
                                <span className="card-text mb-3">
                                  {phone || 'NULL'}
                                </span>
                              </div>
                              <div className="position-item">
                                Email:{' '}
                                <span className="card-text mb-3">
                                  {email || 'NULL'}
                                </span>
                              </div>
                              <div className="position-item">
                                Skype:{' '}
                                <span className="card-text mb-3">
                                  {skype || 'NULL'}
                                </span>
                              </div>
                            </div>
                            <div className="button-profile">
                              <Link
                                className=" button-card btn btn-orange mt-2 text-center"
                                to={
                                  haveAccount === 0
                                    ? `/${endpoint.employees}/${endpoint.profile}/${profileID}`
                                    : `/${endpoint.users}/${endpoint.profile}/${id}`
                                }>
                                Show more
                              </Link>
                              {level === 1 || parentInChart ? (
                                ''
                              ) : (
                                <div
                                  className=" button-card btn btn-orange ml-2 mt-2 text-center"
                                  onClick={() =>
                                    this.CreateListNoParent(noParent)
                                  }>
                                  Add Parent
                                </div>
                              )}
                              {listPermissions.includes('updatePosition') &&
                              parentInChart === null &&
                              childnumber === 0 ? (
                                ''
                              ) : (
                                <div
                                  className=" button-card btn btn-orange ml-2 mt-2 text-center"
                                  onClick={() =>
                                    this.RemoveParent(
                                      PositionId,
                                      parentInChart,
                                      id
                                    )
                                  }>
                                  Remove
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                  <div className="col-sm-12">
                    {haveList ? (
                      <PositionItem
                        ListChild={listparent}
                        ParentId={PositionId}
                        level={level}
                        DepartmentId={id}
                        RemoveChild={this.RemoveChild}
                      />
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
ViewTree.defaultProps = {
  loadPosition: null,
};
const mapDispatchToProps = (dispatch) => ({
  loadDepartment: bindActionCreators(loadDepartment, dispatch),
  showTreePosition: bindActionCreators(showTreePosition, dispatch),
});

export default connect(null, mapDispatchToProps)(ViewTree);
