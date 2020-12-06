import React, { Component } from 'react';
import $ from 'jquery';
import 'datatables.net-bs4';
import 'react-dom';
import Loading from '../../components/Loading';
import { APIcaller } from '../../utils';
import { endpoint } from '../../constants/config';
import { alertPopup, confirmPopup } from '../../utils/alertPopup';
import { get } from 'lodash';
import errorHandler from '../../utils/handlerError';
import * as response from '../../constants/response';
import { Tree } from 'antd';
import './index.css';
import moment from 'moment';
import VirtualizedSelect from 'react-virtualized-select';
import { getItemLocalStore } from '../../utils/handleLocalStore';
import { constant } from '../../constants/constant';
import defaultAvatar from '../../assets/img/default-avatar.png';
import { Redirect } from 'react-router-dom';
const gPermissions = constant.permissions;
const { TreeNode, DirectoryTree } = Tree;

const unitType = {
  DEPARTMENT: 'DEPARTMENT',
  POSITION: 'POSITION',
};

const {
  // createOrgChart,
  readOrgChart,
  // updateOrgChart,
  // deleteOrgChart,
} = constant.permissions;

class OrganizationChart extends Component {
  constructor(props) {
    super(props);
    this.contextMenu = React.createRef();
    this.dataTableMembers = React.createRef();
    this.state = {
      loading: false,
      listDepartments: [],
      listPositions: [],
      listMembers: [],
      teamTree: [],
      // for left click on org tree
      listMemebersSelected: [],
      // for right click on org tree
      visibleContext: false,
      disableAddSubMenu: false,
      disableDelete: false,
      triggerRightClickFor: null,
      // for team form
      teamId: null,
      teamName: '',
      teamDescription: '',
      // for position form
      positionId: null,
      positionName: '',
      positionKey: '',
      positionDescription: '',
      positionLevel: '',
      positionDepartmentId: null,
      // for member form
      listEmployeesForMemberForm: [],
      listPositionForMemberForm: [],
      selectedEmployeeId: null,
      selectedPositonId: null,
    };
  }

  /**
   * Load data through Api
   */

  loadEmployees = async () => {
    const res = await APIcaller(`${endpoint.profiles}`);
    const message = get(res, 'data.responseKey');
    // console.log('list employees', res);

    if (message === response.getListSuccess) {
      return res.data.data;
    }
    if (message !== response.notFound)
      alertPopup('FAILED!!!', errorHandler(message));
    return [];
  };

  loadMembersFromPositionChart = async (departments) => {
    let listMembers = [];
    for (const { id } of departments) {
      const res = await APIcaller(
        `${endpoint.positionChart}?departmentId=${id}`
      );
      const message = get(res, 'data.responseKey');
      // console.log('employees by position chart: ', res);
      if (message === response.getListSuccess) {
        listMembers = [...listMembers, ...res.data.freshData];
      }
    }
    return listMembers;
  };

  loadDepartments = async () => {
    const res = await APIcaller(`${endpoint.departments}`);
    const message = get(res, 'data.responseKey');
    // console.log('departments: ', res);

    if (message === response.getListSuccess) {
      return res.data.data;
    }
    if (message !== response.notFound)
      alertPopup('FAILED!!!', errorHandler(message));
    return [];
  };

  loadPositionsByDepartment = async (departments) => {
    let listPositions = [];
    for (const depart of departments) {
      const res = await APIcaller(
        `${endpoint.positions}?departmentId=${depart.id}`
      );
      const message = get(res, 'data.responseKey');
      // console.log('positions: ', res);
      if (message === response.getListSuccess) {
        listPositions = [...listPositions, ...res.data.data];
      }
    }
    return listPositions;
  };

  loadTeamTree = (listDepartments, listPositions, listMembers) => {
    let newTeamTree = [];
    for (const { id, name, description } of listDepartments) {
      // save it to team tree
      const listPositionsOfDepartment = listPositions.filter(
        ({ departmentId }) => departmentId === id
      );
      const membersOfDepartment = listMembers.filter(
        ({ positionId }) =>
          listPositionsOfDepartment.map(({ id }) => id).indexOf(positionId) > -1
      );
      // tree with 2 level departments - positions
      newTeamTree.push({
        title: name,
        key: name,
        unitId: id,
        unitType: unitType.DEPARTMENT,
        unitName: name,
        members: membersOfDepartment,
        description,
        children: listPositionsOfDepartment.map((posi) => ({
          title: posi.name,
          key: `${name}-${posi.key}`,
          unitId: posi.id,
          unitType: unitType.POSITION,
          unitKey: posi.key,
          unitName: posi.name,
          unitLevel: posi.level,
          unitParentId: id,
          unitParentName: name,
          members: listMembers.filter(
            ({ positionId }) => positionId === posi.id
          ),
          description: posi.description,
        })),
      });
    }
    return newTeamTree;
  };

  /**
   * Render for the first time
   */

  componentDidMount() {
    $(document).click(this.handleClickOutsideMenuContext);
    $(document).scroll(this.handleScrollMenuContext);
    this.setState({ loading: true }, async () => {
      const listEmployeesForMemberForm = await this.loadEmployees();
      const listDepartments = await this.loadDepartments();
      const listMembers = await this.loadMembersFromPositionChart(
        listDepartments
      );
      const listPositions = await this.loadPositionsByDepartment(
        listDepartments
      );
      const teamTree = this.loadTeamTree(
        listDepartments,
        listPositions,
        listMembers
      );
      const listPositionForMemberForm = teamTree
        .map(({ children }) =>
          children.map(({ unitId, unitName, unitParentName }) => ({
            id: unitId,
            positionName: unitParentName + ' - ' + unitName,
          }))
        )
        .flat();

      this.setState(
        {
          listDepartments,
          listPositions,
          listMembers,
          teamTree,
          listEmployeesForMemberForm,
          listPositionForMemberForm,
          // listMemebersSelected: teamTree[0].members,
        },
        () => {
          this.setState({ loading: false });
          const t = $(this.dataTableMembers.current).DataTable({
            destroy: true,
            columnDefs: [
              { orderable: false, targets: [-1] },
              { searchable: false, targets: [-1] },
              { width: '10%', targets: 0 },
              { width: '20%', targets: 1 },
              { width: '10%', targets: 2 },
              { width: '20%', targets: 3 },
            ],
            lengthMenu: [
              [10, 25, 35],
              [10, 25, 35],
            ],
          });
          t.column(0)
            .nodes()
            .map((cell, i) => (cell.innerHTML = i + 1))
            .draw();
          // $('#DataTables_Table_0_length').remove();
        }
      );
    });
  }

  /**
   * Handle left click on org tree
   */

  onSelect = (
    keys,
    {
      node: {
        props: { dataRef },
      },
    }
  ) => {
    let listPositionForMemberForm;
    if (dataRef.children) {
      const { children } = dataRef;
      listPositionForMemberForm = children.map(
        ({ unitId, unitName, unitParentName }) => ({
          id: unitId,
          positionName: unitParentName + ' - ' + unitName,
        })
      );
    } else {
      const { unitId, unitName, unitParentName } = dataRef;
      listPositionForMemberForm = [
        { id: unitId, positionName: unitParentName + ' - ' + unitName },
      ];
    }
    $('.team-name').html(dataRef.unitName);
    if ($('td.dataTables_empty').length) {
      $('td.dataTables_empty')
        .parent()
        .remove();
    }
    this.setState({
      listMemebersSelected: dataRef.members,
      listPositionForMemberForm,
    });
  };

  /**
   * Handle right click on org tree
   */

  handleShowContextMenu = ({ event, node }) => {
    // setState for team and position to edit after
    const {
      props: { dataRef },
    } = node;
    const { unitId, unitName, description } = dataRef;
    switch (dataRef.unitType) {
      case unitType.DEPARTMENT:
        this.updateTeamForm(unitId, unitName, description);
        break;
      case unitType.POSITION:
        {
          const { unitKey, unitLevel, unitParentId } = dataRef;
          this.updatePositionForm(
            unitParentId,
            unitId,
            unitName,
            unitKey,
            unitLevel,
            description
          );
        }
        break;
      default: {
      }
    }

    // view contextMenu and disable some contextMenu item
    const contextDiv = $(this.contextMenu.current);
    const { visibleContext } = this.state;

    const newVisibleContext = !visibleContext,
      newDisableAddSubMenu = !node.props.hasOwnProperty('children');
    const newDisableDelete =
      dataRef.members.length === 0 &&
      (!node.props.hasOwnProperty('children') ||
        node.props.children.length === 0);

    this.setState({
      visibleContext: newVisibleContext,
      disableAddSubMenu: newDisableAddSubMenu,
      disableDelete: !newDisableDelete,
      triggerRightClickFor: dataRef.unitType,
    });

    // set position for contextMenu
    console.log(event);

    const clickX = $(event.target).offset().left;
    const clickY = $(event.target).offset().top;
    const screenW = $(window).innerWidth(true);
    const screenH = $(window).innerHeight(true);
    const rootW = contextDiv.outerWidth(true);
    const rootH = contextDiv.outerHeight(true);
    const right = screenW - clickX > rootW;
    const left = !right;
    const top = screenH - clickY > rootH;
    const bottom = !top;

    contextDiv.css({ top: `${clickY + 5}px`, left: `${clickX + 5}px` });

    if (right) {
      contextDiv.css({ left: `${clickX + 5}px` });
    }

    if (left) {
      contextDiv.css({ left: `${clickX - rootW - 5}px` });
    }

    if (top) {
      contextDiv.css({ top: `${clickY + 5}px` });
    }

    if (bottom) {
      contextDiv.css({ top: `${clickY - rootH - 5}px` });
    }
  };

  handleClickOutsideMenuContext = (event) => {
    const { visibleContext } = this.state;
    const wasOutside = !(event.target.contains === this.root);

    if (wasOutside && visibleContext) this.setState({ visibleContext: false });
  };

  handleScrollMenuContext = () => {
    const { visibleContext } = this.state;

    if (visibleContext) this.setState({ visibleContext: false });
  };

  handleAddItemOnTeamTree = (e, type, canExcute) => {
    if (canExcute) {
      switch (type) {
        case unitType.DEPARTMENT:
          {
            const { teamId } = this.state;
            this.updatePositionForm(teamId);
            $('#modalPositionForm').modal('show');
          }
          break;
        // case unitType.POSITION:
        //   {
        //     // $('#modalPositionForm').modal('show');
        //   }
        //   break;
        default: {
        }
      }
    }
  };

  handleEditItemOnTeamTree = (e, type, canExcute) => {
    if (canExcute) {
      switch (type) {
        case unitType.DEPARTMENT:
          {
            $('#modalTeamForm').modal('show');
          }
          break;
        case unitType.POSITION:
          {
            $('#modalPositionForm').modal('show');
          }
          break;
        default:
          {
          }
          break;
      }
    }
  };

  handleDeleteItemOnTeamTree = (e, type, canExcute) => {
    if (canExcute) {
      switch (type) {
        case unitType.DEPARTMENT:
          {
            const { teamId, teamName, teamTree } = this.state;
            let newTeamTree = teamTree;
            confirmPopup(
              'Warning',
              `Do you want delete team ${teamName}`,
              () => {
                this.setState({ loading: true }, async () => {
                  const res = await APIcaller(
                    `${endpoint.department}`,
                    'DELETE',
                    {},
                    { departmentId: teamId }
                  );
                  const message = get(res, 'data.responseKey');

                  if (message !== response.deleteSuccess) {
                    alertPopup('FAILD!!!', message);
                  } else {
                    const indexOfDeletedItem = newTeamTree
                      .map(({ unitId }) => unitId)
                      .indexOf(teamId);
                    if (indexOfDeletedItem === newTeamTree.length - 1) {
                      newTeamTree.pop();
                    } else if (
                      indexOfDeletedItem < newTeamTree.length - 1 &&
                      indexOfDeletedItem > -1
                    ) {
                      newTeamTree.splice(indexOfDeletedItem, 1);
                    }
                    this.updateTeamForm();
                    this.setState({ teamTree: newTeamTree, loading: false });
                  }
                });
              }
            );
          }
          break;
        case unitType.POSITION: {
          const {
            positionId,
            positionName,
            teamTree,
            positionDepartmentId,
          } = this.state;
          let newTeamTree = teamTree;
          confirmPopup(
            'Warning',
            `Do you want delete position name: ${positionName}`,
            () => {
              this.setState({ loading: true }, async () => {
                const res = await APIcaller(
                  `${endpoint.position}`,
                  'DELETE',
                  {},
                  { positionId }
                );
                const message = get(res, 'data.responseKey');
                if (message !== response.deleteSuccess) {
                  alertPopup('FAILD!!!', message);
                } else {
                  // delete item position on teamTree
                  const indexOfTeamHavePositonWillDelete = newTeamTree
                    .map(({ unitId }) => unitId)
                    .indexOf(positionDepartmentId);
                  const indexOfPositionWillDelete = newTeamTree[
                    indexOfTeamHavePositonWillDelete
                  ].children
                    .map(({ unitId }) => unitId)
                    .indexOf(positionId);
                  let teamHavePosition =
                    newTeamTree[indexOfTeamHavePositonWillDelete].children;
                  if (
                    indexOfPositionWillDelete ===
                    teamHavePosition.length - 1
                  ) {
                    teamHavePosition.pop();
                  } else if (
                    indexOfPositionWillDelete < teamHavePosition.length - 1 &&
                    indexOfPositionWillDelete > -1
                  ) {
                    teamHavePosition.splice(indexOfPositionWillDelete, 1);
                  }
                  newTeamTree[
                    indexOfTeamHavePositonWillDelete
                  ].children = teamHavePosition;
                  this.setState({ teamTree: newTeamTree });
                }
                this.setState({ loading: false });
              });
            }
          );
        }
        break;

        default:
          {
          }
      }
    }
  };

  /**
   * Handle change for common form input
   */

  handleChange = ({ target: { name, value, check, type } }) => {
    this.setState({ [name]: type === 'checkbox' ? check : value });
  };

  /**
   * Handle for team Form
   */

  onSaveTeamForm = (e) => {
    e.preventDefault();
    const { teamDescription, teamName, teamId } = this.state;
    try {
      if (teamId) {
        // edit team
        this.setState({ loading: true }, async () => {
          const res = await APIcaller(
            `${endpoint.department}`,
            'PATCH',
            {},
            {
              departmentId: teamId,
              fields: {
                departmentId: teamId,
                name: teamName,
                description: teamDescription,
              },
            }
          );
          const message = get(res, 'data.responseKey');
          if (message !== response.updateSuccess) {
            alertPopup('FAILED!!!', errorHandler(message));
          } else {
            const { teamTree } = this.state;
            let newTeamTree = teamTree;
            const indexOfEditedItem = newTeamTree
              .map(({ unitId }) => unitId)
              .indexOf(teamId);
            if (indexOfEditedItem > -1) {
              let editedItem = newTeamTree[indexOfEditedItem];
              editedItem = {
                ...editedItem,
                description: teamDescription,
                unitName: teamName,
                title: teamName,
                key: teamName,
              };
              newTeamTree.splice(indexOfEditedItem, 1, editedItem);
            }
            this.setState({ teamTree: newTeamTree });
            this.updateTeamForm();
            $('#modalTeamForm').modal('hide');
          }
          this.setState({ loading: false });
        });
      } else {
        // add team
        this.setState({ loading: true }, async () => {
          const res = await APIcaller(
            `${endpoint.department}`,
            'POST',
            {},
            {
              name: teamName,
              description: teamDescription,
            }
          );
          const message = get(res, 'data.responseKey');
          console.log(res);

          if (message !== response.insertSuccess) {
            alertPopup('FAILED!!!', errorHandler(message));
          } else {
            const listDepartments = await this.loadDepartments();
            const { listPositions, listMembers } = this.state;
            const teamTree = this.loadTeamTree(
              listDepartments,
              listPositions,
              listMembers
            );
            this.setState({ listDepartments, teamTree });
            this.updateTeamForm();
            $('#modalTeamForm').modal('hide');
          }
          this.setState({ loading: false });
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  updateTeamForm = (teamId = null, teamName = '', teamDescription = '') => {
    this.setState({ teamId, teamName, teamDescription });
  };

  /**
   * Handle for position Form
   */

  onSavePositionForm = (e) => {
    e.preventDefault();
    const {
      positionId,
      positionKey,
      positionName,
      positionDescription,
      positionLevel,
      positionDepartmentId,
    } = this.state;
    try {
      if (positionId) {
        // Edit Position
        this.setState({ loading: true }, async () => {
          const res = await APIcaller(
            `${endpoint.position}`,
            'PATCH',
            {},
            {
              positionId,
              fields: {
                id: positionId,
                name: positionName,
                key: positionKey,
                level: positionLevel,
                description: positionDescription,
              },
            }
          );
          const message = get(res, 'data.responseKey');
          if (message !== response.updateSuccess) {
            alertPopup('FAILED!!!', errorHandler(message));
          } else {
            const { listDepartments, listMembers } = this.state;
            const listPositions = await this.loadPositionsByDepartment(
              listDepartments
            );
            const teamTree = this.loadTeamTree(
              listDepartments,
              listPositions,
              listMembers
            );
            this.setState({ listPositions, teamTree });
            this.updatePositionForm();
            $('#modalPositionForm').modal('hide');
          }
          this.setState({ loading: false });
        });
      } else {
        // Add Position
        this.setState({ loading: true }, async () => {
          const res = await APIcaller(
            `${endpoint.position}`,
            'POST',
            {},
            {
              departmentId: positionDepartmentId,
              name: positionName,
              key: positionKey,
              level: positionLevel,
              description: positionDescription,
            }
          );
          const message = get(res, 'data.responseKey');
          if (message !== response.insertSuccess) {
            alertPopup('FAILED!!!', errorHandler(message));
          } else {
            const { listDepartments, listMembers } = this.state;
            const listPositions = await this.loadPositionsByDepartment(
              listDepartments
            );
            const teamTree = this.loadTeamTree(
              listDepartments,
              listPositions,
              listMembers
            );
            this.setState({ listPositions, teamTree });
            this.updatePositionForm();
            $('#modalPositionForm').modal('hide');
          }
          this.setState({ loading: false });
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  updatePositionForm = (
    positionDepartmentId = null,
    positionId = null,
    positionName = '',
    positionKey = '',
    positionLevel = '',
    positionDescription = ''
  ) => {
    this.setState({
      positionId,
      positionName,
      positionKey,
      positionLevel,
      positionDescription,
      positionDepartmentId,
    });
  };

  /**
   * Handle for member
   */

  handleDeleteMemberOnTeam = (id, fullName) => {
    confirmPopup('Warnning', `Do you want to delete ${fullName}?`, async () => {
      const res = await APIcaller(
        `${endpoint.profilePosition}`,
        'DELETE',
        {},
        {
          profilePositionId: id,
        }
      );
      const message = res.data.responseKey;
      if (message !== response.deleteSuccess) {
        alertPopup('FAILD!!!', message);
      } else {
        this.setState({ loading: true }, async () => {
          const { listMemebersSelected } = this.state;
          let newListMembersSelected = listMemebersSelected;
          const indexOfDeletedItem = newListMembersSelected
            .map(({ profilePositionId }) => profilePositionId)
            .indexOf(id);
          if (indexOfDeletedItem === newListMembersSelected.length - 1) {
            newListMembersSelected.pop();
          } else if (
            indexOfDeletedItem < newListMembersSelected.length - 1 &&
            indexOfDeletedItem > -1
          ) {
            newListMembersSelected.splice(indexOfDeletedItem, 1);
          }

          // render team tree again
          const listDepartments = await this.loadDepartments();
          const listMembers = await this.loadMembersFromPositionChart(
            listDepartments
          );
          const listPositions = await this.loadPositionsByDepartment(
            listDepartments
          );
          const teamTree = this.loadTeamTree(
            listDepartments,
            listPositions,
            listMembers
          );

          this.setState({
            listDepartments,
            listPositions,
            listMembers,
            teamTree,
            listMemebersSelected: newListMembersSelected,
            loading: false,
          });
        });
      }
    });
  };

  handleChangeForSpecialInput = (name, value) => {
    this.setState({ [name]: value });
  };

  onSaveMemberForm = (e) => {
    e.preventDefault();
    const { selectedEmployeeId, selectedPositonId } = this.state;

    this.setState({ loading: true }, async () => {
      try {
        const res = await APIcaller(
          `${endpoint.profilePosition}`,
          'POST',
          {},
          {
            profileId: selectedEmployeeId.id,
            positionId: selectedPositonId.id,
          }
        );
        const message = res.data.responseKey;
        if (message !== response.insertSuccess) {
          alertPopup('FAILD!!!', message);
        } else {
          // render team tree again
          const { listMemebersSelected } = this.state;
          let newListMembersSelected = listMemebersSelected;
          const listDepartments = await this.loadDepartments();
          const listMembers = await this.loadMembersFromPositionChart(
            listDepartments
          );
          const listPositions = await this.loadPositionsByDepartment(
            listDepartments
          );
          const teamTree = this.loadTeamTree(
            listDepartments,
            listPositions,
            listMembers
          );
          const itemInserted = teamTree
            .map(({ members }) => members)
            .flat()
            .filter(
              ({ id, positionId }) =>
                id === selectedEmployeeId.id &&
                positionId === selectedPositonId.id
            )[0];
          newListMembersSelected.push(itemInserted);
          this.setState({
            listDepartments,
            listPositions,
            listMembers,
            teamTree,
            listMemebersSelected: newListMembersSelected,
            loading: false,
          });
          $('#modalMemberForm').modal('hide');
        }
      } catch (error) {
        console.log(error);
      }
    });
  };

  updateMemberForm = (selectedEmployeeId = null, selectedPositonId = null) => {
    this.setState({
      selectedEmployeeId,
      selectedPositonId,
    });
  };

  /**
   * Render for list Item
   */

  renderTreeNodes = (list) =>
    list.map((item) => {
      if (item.children) {
        return (
          <TreeNode
            title={
              <div className="node-desc">
                {item.title} (
                <span key={item.title + 'span'} className="team-desc">
                  {item.members.length} members
                </span>{' '}
                )
              </div>
            }
            key={item.key}
            dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          key={item.key}
          title={
            <div className="node-desc">
              {item.title} (
              <span key={item.title + 'span'} className="team-desc">
                {item.members.length} members
              </span>{' '}
              )
            </div>
          }
          dataRef={item}
        />
      );
    });

  renderTableMembers = (list) => {
    if (list.length) {
      return list.map(
        (
          {
            id,
            firstName,
            lastName,
            profilePositionId,
            positionName,
            avatar,
            startDate,
          },
          index
        ) => {
          const avatarImgSource = avatar
            ? `${endpoint.url}/${endpoint.imageURL}/${avatar}`
            : defaultAvatar;
          return (
            <tr key={index}>
              <td>{index}</td>
              <td>
                <div className="img-preview">
                  <img src={avatarImgSource} className="imgitem" alt="" />
                </div>
              </td>
              <td>{`${firstName ? firstName : ''} ${
                lastName ? lastName : ''
              }`}</td>
              <td>{positionName}</td>
              <td>
                {startDate.length ? moment(startDate).format('DD/MM/YYYY') : ''}
              </td>
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
                    <div>
                      <button
                        className="dropdown-item"
                        style={{ cursor: 'pointer' }}
                        onClick={() =>
                          this.handleDeleteMemberOnTeam(
                            profilePositionId,
                            `${firstName ? firstName : ''} ${
                              lastName ? lastName : ''
                            }`
                          )
                        }>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </td>
            </tr>
          );
        }
      );
    }
    return null;
  };

  render() {
    const {
      loading,
      teamTree,
      listMemebersSelected,
      visibleContext,
      disableAddSubMenu,
      disableDelete,
      triggerRightClickFor,
      teamId,
      teamName,
      teamDescription,
      positionId,
      positionName,
      positionKey,
      positionLevel,
      positionDescription,
      listEmployeesForMemberForm,
      listPositionForMemberForm,
      selectedEmployeeId,
      selectedPositonId,
    } = this.state;
    // console.log('listPositions', listPositions);
    // console.log('teamTree', teamTree);
    // console.log('listEmployeesForMemberForm', listEmployeesForMemberForm);
    // console.log('listMemebersSelected', listMemebersSelected);
    const selectListPositions = listPositionForMemberForm;
    const selectListEmployees = listEmployeesForMemberForm
      .filter(({ id }) => !listMemebersSelected.map((mb) => mb.id).includes(id))
      .map(({ id, firstName, lastName }) => ({
        id,
        fullName: `${firstName ? firstName : ''} ${lastName ? lastName : ''}`,
      }));

    // console.log('selectListEmployees', selectListEmployees);

    const listPermission = getItemLocalStore('listPermissions');

    return (
      <div className="container-fluid">
        {listPermission.includes(readOrgChart) ? (
          <div className="form-add card-border-orange bg-white">
            <div className="card-header card-header-divider">
              <h3>Organization Chart</h3>
            </div>
            {loading && <Loading />}

            {/**
             * menu context div
             **/}

            <div
              ref={this.contextMenu}
              className={visibleContext ? 'contextMenu' : 'd-none'}>
              <div
                className={
                  disableAddSubMenu
                    ? 'contextMenu--option contextMenu--option__disabled '
                    : 'contextMenu--option'
                }
                onClick={(e) => {
                  this.handleAddItemOnTeamTree(
                    e,
                    triggerRightClickFor,
                    !disableAddSubMenu
                  );
                }}>
                Add position
              </div>
              <div
                className="contextMenu--option"
                onClick={(e) => {
                  this.handleEditItemOnTeamTree(e, triggerRightClickFor, true);
                }}>
                Edit
              </div>
              <div
                className={
                  disableDelete
                    ? 'contextMenu--option contextMenu--option__disabled '
                    : 'contextMenu--option'
                }
                onClick={(e) => {
                  this.handleDeleteItemOnTeamTree(
                    e,
                    triggerRightClickFor,
                    !disableDelete
                  );
                }}>
                Delete
              </div>
            </div>

            <div className="container-fluid mt-3">
              <div className="row px-3 pb-3">
                <div className="org-tree">
                  {listPermission.includes(gPermissions.createOrgChart) && (
                    <button
                      className="btn btn-orange btn-sm float-right"
                      data-toggle="modal"
                      onClick={() => {
                        this.updateTeamForm();
                        $('#modalTeamForm').modal('show');
                      }}>
                      Add
                    </button>
                  )}

                  {/**
                   * Modal for team form
                   */}

                  <div
                    className="modal fade"
                    id="modalTeamForm"
                    tabIndex="-1"
                    role="dialog">
                    <div className="modal-dialog" role="document">
                      <div className="modal-content">
                        <form
                          className="form-horizontal"
                          onSubmit={this.onSaveTeamForm}>
                          <div className="modal-header px-4">
                            <h5 className="modal-title">
                              {teamId ? 'Edit Team' : 'Add Team'}
                            </h5>
                            <button
                              type="button"
                              className="close"
                              data-dismiss="modal"
                              aria-label="Close">
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                          <div className="modal-body px-4">
                            <div className="row form-group w-auto">
                              <label htmlFor="name" className="col-md-4">
                                Name<strong className="text-danger"> *</strong>
                              </label>
                              <div className="col-md-8">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="teamName"
                                  required
                                  value={teamName}
                                  onChange={this.handleChange}
                                />
                              </div>
                            </div>
                            <div className="row form-group w-auto">
                              <label htmlFor="description" className="col-md-4">
                                Decription
                              </label>
                              <div className="col-md-8">
                                <textarea
                                  className="form-control"
                                  name="teamDescription"
                                  rows="3"
                                  value={teamDescription}
                                  onChange={this.handleChange}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="modal-footer px-4">
                            <button
                              type="submit"
                              className="btn btn-orange mr-3">
                              Save
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              data-dismiss="modal">
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>

                  {/**
                   * Modal for position form
                   **/}

                  <div
                    className="modal fade"
                    id="modalPositionForm"
                    tabIndex="-1"
                    role="dialog">
                    <div className="modal-dialog" role="document">
                      <div className="modal-content">
                        <form
                          className="form-horizontal"
                          onSubmit={this.onSavePositionForm}>
                          <div className="modal-header px-4">
                            <h5 className="modal-title">
                              {positionId ? 'Edit Position' : 'Add Position'}
                            </h5>
                            <button
                              type="button"
                              className="close"
                              data-dismiss="modal"
                              aria-label="Close">
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                          <div className="modal-body px-4">
                            <div className="row form-group w-auto">
                              <label className="col-md-4">
                                Name<strong className="text-danger"> *</strong>
                              </label>
                              <div className="col-md-8">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="positionName"
                                  required
                                  value={positionName}
                                  onChange={this.handleChange}
                                  placeholder="Name"
                                />
                              </div>
                            </div>
                            <div className="row form-group w-auto">
                              <label className="col-md-4">
                                Key<strong className="text-danger"> *</strong>
                              </label>
                              <div className="col-md-8">
                                <input
                                  type="text"
                                  className="form-control"
                                  name="positionKey"
                                  required
                                  value={positionKey}
                                  onChange={this.handleChange}
                                  placeholder="Key"
                                />
                              </div>
                            </div>
                            <div className="row form-group w-auto">
                              <label className="col-md-4">
                                Level<strong className="text-danger"> *</strong>
                              </label>
                              <div className="col-md-8">
                                <input
                                  type="number"
                                  className="form-control"
                                  name="positionLevel"
                                  required
                                  value={positionLevel}
                                  onChange={this.handleChange}
                                  placeholder="Level"
                                />
                              </div>
                            </div>
                            <div className="row form-group w-auto">
                              <label htmlFor="description" className="col-md-4">
                                Decription
                              </label>
                              <div className="col-md-8">
                                <textarea
                                  className="form-control"
                                  name="positionDescription"
                                  rows="3"
                                  value={positionDescription}
                                  onChange={this.handleChange}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="modal-footer px-4">
                            <button
                              type="submit"
                              className="btn btn-orange mr-3">
                              Save
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              data-dismiss="modal">
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>

                  <h5>Team Management</h5>
                  <hr />
                  <DirectoryTree
                    onRightClick={this.handleShowContextMenu}
                    style={{ fontSize: '1em' }}
                    onSelect={this.onSelect}>
                    {this.renderTreeNodes(teamTree)}
                  </DirectoryTree>
                </div>
                <div className="team-member">
                  <button
                    className="btn btn-orange btn-sm float-right"
                    data-toggle="modal"
                    onClick={() => {
                      this.updateMemberForm();
                      $('#modalMemberForm').modal('show');
                    }}>
                    Add
                  </button>

                  {/**
                   * Modal Member form
                   */}

                  <div
                    className="modal fade"
                    id="modalMemberForm"
                    tabIndex="-1"
                    role="dialog">
                    <div className="modal-dialog" role="document">
                      <div className="modal-content">
                        <form
                          className="form-horizontal"
                          onSubmit={this.onSaveMemberForm}>
                          <div className="modal-header px-4">
                            <h5 className="modal-title">Add Member</h5>
                            <button
                              type="button"
                              className="close"
                              data-dismiss="modal"
                              aria-label="Close">
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                          <div className="modal-body px-4">
                            <div className="row form-group w-auto">
                              <label className="col-md-5">
                                Select Employee
                                <strong className="text-danger"> *</strong>
                              </label>
                              <div className="col-md-7">
                                <VirtualizedSelect
                                  required
                                  options={selectListEmployees}
                                  multiValue
                                  onChange={(value) => {
                                    this.handleChangeForSpecialInput(
                                      'selectedEmployeeId',
                                      value
                                    );
                                  }}
                                  value={selectedEmployeeId}
                                  autoFocus={true}
                                  labelKey="fullName"
                                  valueKey="id"
                                />
                              </div>
                            </div>
                            <div className="row form-group w-auto">
                              <label className="col-md-5">
                                Select Position
                                <strong className="text-danger"> *</strong>
                              </label>
                              <div className="col-md-7">
                                <VirtualizedSelect
                                  required
                                  options={selectListPositions}
                                  multiValue
                                  onChange={(value) => {
                                    this.handleChangeForSpecialInput(
                                      'selectedPositonId',
                                      value
                                    );
                                  }}
                                  value={selectedPositonId}
                                  autoFocus={true}
                                  labelKey="positionName"
                                  valueKey="id"
                                />
                              </div>
                            </div>
                          </div>
                          <div className="modal-footer px-4">
                            <button
                              type="submit"
                              className="btn btn-orange mr-3">
                              Save
                            </button>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              data-dismiss="modal">
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                  <h5 className="team-name">Team Information</h5>
                  <hr />
                  <table
                    ref={this.dataTableMembers}
                    cellSpacing="0"
                    className="table-responsive table table-bordered table-hover bg-white table-no-search"
                    style={{ width: '100%' }}>
                    <thead>
                      <tr>
                        <th>No.</th>
                        <th>Avatar</th>
                        <th>Employee Name</th>
                        <th>Position</th>
                        <th>Joining Date</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {this.renderTableMembers(listMemebersSelected)}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <Redirect to="/" />
        )}
      </div>
    );
  }
}

export default OrganizationChart;
