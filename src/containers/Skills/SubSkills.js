import React, { Component } from 'react';
import $ from 'jquery';
import Loading from '../../components/Loading';
import { APIcaller } from '../../utils';
import { endpoint } from '../../constants/config';
import { alertPopup, confirmPopup } from '../../utils/alertPopup';
import { get } from 'lodash';
import errorHandler from '../../utils/handlerError';
import * as response from '../../constants/response';
import { getItemLocalStore } from '../../utils/handleLocalStore';

class SubSkillsManagement extends Component {
  constructor(props) {
    super(props);
    this.dataTableSkills = React.createRef();
    this.state = {
      loading: false,
      skills: [],
      groupSkillId: null,
      groupSkillName: '',
      selectedSkillName: '',
      selectedSkillId: null,
    };
  }

  loadSkills = async (id) => {
    let result = [];
    const res = await APIcaller(`${endpoint.skillInGroup}?groupSkillId=${id}`);
    const message = get(res, 'data.responseKey');
    // console.log('res', res);

    if (message === response.getOneSuccess) {
      result = res.data.data;
    } else {
      alertPopup('Faild To load data', errorHandler(message));
    }
    return result;
  };

  componentDidMount() {
    this.setState({ loading: true }, async () => {
      const groupSkillId = this.props.match.params.id;
      const data = await this.loadSkills(groupSkillId);
      this.setState({
        skills: data[0].skill,
        groupSkillId,
        groupSkillName: data[0].groupSkillName,
      });
      const t = $(this.dataTableSkills.current).DataTable({
        columnDefs: [
          { orderable: false, targets: [-1] },
          { searchable: false, targets: [-1] },
          { width: '20%', targets: 0 },
          { width: '80%', targets: 1 },
          { width: '50%', targets: 2 },
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
      if (!t.data().any()) $('.odd').remove();
      this.setState({ loading: false });
    });
  }

  handleChange = ({ target: { name, value, type, check } }) => {
    this.setState({ [name]: type === 'checkbox' ? check : value });
  };

  onSubmitForm = (e) => {
    e.preventDefault();
    const { selectedSkillId, selectedSkillName } = this.state;
    if (selectedSkillId) {
      // edit form
      this.setState({ loading: true }, async () => {
        const res = await APIcaller(
          `${endpoint.skill}?skillId=${selectedSkillId}`,
          'PATCH',
          {},
          { skillName: selectedSkillName }
        );
        const message = get(res, 'data.responseKey');

        if (message !== response.updateSuccess) {
          alertPopup('Fail to update this skill', errorHandler(message));
        } else {
          const { skills } = this.state;
          const indexOfEditedItem = skills
            .map(({ id }) => id)
            .indexOf(selectedSkillId);
          let newSkills = skills;
          newSkills[indexOfEditedItem].skillName = selectedSkillName;
          this.setState({ skills: newSkills });
          this.updateForm();
          $('#modelFormId').modal('hide');
        }
        this.setState({ loading: false });
      });
    } else {
      // add form
      this.setState({ loading: true }, async () => {
        const { groupSkillId } = this.state;
        const res = await APIcaller(
          `${endpoint.skill}`,
          'POST',
          {},
          { skillName: selectedSkillName, groupSkillId }
        );
        // console.log(res);

        const message = get(res, 'data.responseKey');
        if (message !== response.insertSuccess) {
          alertPopup('Fail to create skill', errorHandler(message));
        } else {
          const data = await this.loadSkills(groupSkillId);
          this.setState({ skills: data[0].skill });
          this.updateForm();
          $('#modelFormId').modal('hide');
        }
        this.setState({ loading: false });
      });
    }
  };

  updateForm = (selectedSkillId = null, selectedSkillName = '') => {
    this.setState({ selectedSkillId, selectedSkillName });
  };

  onDelete = (id) => {
    this.setState({ loading: true }, async () => {
      const res = await APIcaller(`${endpoint.skill}?skillId=${id}`, 'DELETE');
      // console.log(res);

      const message = get(res, 'data.responseKey');
      if (message !== response.deleteSuccess) {
        alertPopup('Fail to delete this skill', errorHandler(message));
      } else {
        const { skills } = this.state;
        let newSkills = skills;
        const indexOfDeletedItem = newSkills.map((ele) => ele.id).indexOf(id);
        if (
          indexOfDeletedItem > -1 &&
          indexOfDeletedItem !== newSkills.length - 1
        ) {
          newSkills.splice(indexOfDeletedItem, 1);
        } else if (indexOfDeletedItem === newSkills.length - 1) {
          newSkills.pop();
        }
        this.setState({ skills: newSkills });
      }
      this.setState({ loading: false });
    });
  };

  showListItem = (list) => {
    const listPermission = getItemLocalStore('listPermissions');

    return list.map(({ id, skillName }, index) => (
      <tr key={id}>
        <td>{index}</td>
        <td>{skillName}</td>
        <td>
          {listPermission.includes('updateClient') &&
          listPermission.includes('deleteClient') ? (
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
                  onClick={() => {
                    this.updateForm(id, skillName);
                    $('#modelFormId').modal('show');
                  }}>
                  Edit
                </button>
                <button
                  className="dropdown-item"
                  type="button"
                  onClick={() => {
                    confirmPopup(
                      'Warning!!!',
                      'Do you want delete this skill?',
                      () => {
                        this.onDelete(id);
                      }
                    );
                  }}>
                  Delete
                </button>
              </div>
            </div>
          ) : (
            ''
          )}
        </td>
      </tr>
    ));
  };

  render() {
    const { loading, skills, selectedSkillId, selectedSkillName } = this.state;
    const listPermission = getItemLocalStore('listPermissions');
    // console.log(skills, listPermission);

    return (
      <div className="container-fluid">
        <div className="form-add card-border-orange bg-white">
          <div className="card-header card-header-divider">
            <h3>Skillset Edit Skills</h3>
          </div>
          {loading && <Loading />}
          <div className="container-fluid mt-3">
            {listPermission.includes('updateClient') &&
            listPermission.includes('deleteClient') ? (
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

            <div className="modal fade" id="modelFormId" role="dialog">
              <div className="modal-dialog" role="document">
                <form
                  className="modal-content bg-white"
                  onSubmit={this.onSubmitForm}>
                  <div className="modal-header">
                    <h5>{selectedSkillId ? 'Edit Skill' : 'Add Skill'}</h5>
                  </div>
                  <div className="modal-body px-4">
                    <div className="row form-group">
                      <label className="col-md-4">
                        Skill Name
                        <strong className="text-danger"> *</strong>
                      </label>
                      <div className="col-md-8">
                        <input
                          required
                          type="text"
                          name="selectedSkillName"
                          className="form-control"
                          value={selectedSkillName}
                          onChange={this.handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="submit" className="btn btn-orange">
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

            <table
              ref={this.dataTableSkills}
              cellSpacing="0"
              className="table-responsive table table-bordered table-hover bg-white"
              style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>No.</th>
                  <th>Name</th>
                  <th />
                </tr>
              </thead>
              <tbody>{this.showListItem(skills)}</tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default SubSkillsManagement;
