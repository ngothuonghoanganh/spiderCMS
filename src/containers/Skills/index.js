import React, { Component } from 'react';
import $ from 'jquery';
import Loading from '../../components/Loading';
import { APIcaller } from '../../utils';
import { endpoint } from '../../constants/config';
import { alertPopup, confirmPopup } from '../../utils/alertPopup';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import errorHandler from '../../utils/handlerError';
import * as response from '../../constants/response';
import { getItemLocalStore } from '../../utils/handleLocalStore';

class SkillsManagement extends Component {
  constructor(props) {
    super(props);
    this.dataTableSkills = React.createRef();
    this.state = {
      loading: false,
      skills: [],
      selectedSkillName: '',
      selectedSkillId: null,
    };
  }

  loadSkills = async () => {
    let result = [];
    const res = await APIcaller(`${endpoint.skills}`);
    const message = get(res, 'data.responseKey');
    console.log('res', res);

    if (message === response.getListSuccess) {
      result = res.data.data;
    } else {
      alertPopup('Faild To load data', errorHandler(message));
    }
    return result;
  };

  componentDidMount() {
    this.setState({ loading: true }, async () => {
      const skills = await this.loadSkills();
      this.setState({ skills });
      const t = $(this.dataTableSkills.current).DataTable({
        columnDefs: [
          { orderable: false, targets: [-1] },
          { searchable: false, targets: [-1] },
          { width: '20%', targets: 0 },
          { width: '40%', targets: 1 },
          { width: '40%', targets: 2 },
          { width: '20%', targets: 3 },
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
          `${endpoint.groupSkill}?groupSkillId=${selectedSkillId}`,
          'PATCH',
          {},
          { groupSkillName: selectedSkillName }
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
          newSkills[indexOfEditedItem].groupSkillName = selectedSkillName;
          this.setState({ skills: newSkills });
          this.updateForm();
          $('#modelFormId').modal('hide');
        }
        this.setState({ loading: false });
      });
    } else {
      // add form
      this.setState({ loading: true }, async () => {
        const res = await APIcaller(
          `${endpoint.groupSkill}`,
          'POST',
          {},
          { groupSkillName: selectedSkillName }
        );
        const message = get(res, 'data.responseKey');

        if (message !== response.insertSuccess) {
          alertPopup('Fail to create skill', errorHandler(message));
        } else {
          const skills = await this.loadSkills();
          this.setState({ skills });
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
      const res = await APIcaller(
        `${endpoint.groupSkill}?groupSkillId=${id}`,
        'DELETE'
      );
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

    return list.map(({ id, groupSkillName, skill }, index) => (
      <tr key={id}>
        <td>{index}</td>
        <td>{groupSkillName}</td>
        <td>{skill.map(({ skillName }) => skillName).join(', ')}</td>
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
                <Link
                  className="dropdown-item edit"
                  to={`/${endpoint.company}/${endpoint.skillset}/${id}`}>
                  Edit skills
                </Link>

                <button
                  className="dropdown-item"
                  type="button"
                  data-toggle="modal"
                  onClick={() => {
                    this.updateForm(id, groupSkillName);
                    $('#modelFormId').modal('show');
                  }}>
                  Edit group skill
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

    return (
      <div className="container-fluid">
        <div className="form-add card-border-orange bg-white">
          <div className="card-header card-header-divider">
            <h3>Skillset Management</h3>
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
                  <div className="modal-header px-4">
                    <h5>{selectedSkillId ? 'Edit Skill' : 'Add Skill'}</h5>
                  </div>
                  <div className="modal-body px-4">
                    <div className="row form-group w-auto">
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
                  <div className="modal-footer px-4">
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
                  <th>Group Skill</th>
                  <th>Skills</th>
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

export default SkillsManagement;
