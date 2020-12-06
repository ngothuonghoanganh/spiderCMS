import React from 'react';
import APIcaller from '../../utils/APIcaller';
import $ from 'jquery';
import { endpoint } from '../../constants/config';
import { alertPopup, confirmPopup } from '../../utils/alertPopup';
import errorHandler from '../../utils/handlerError';
import * as response from '../../constants/response';
import Loading from '../../components/Loading';
import { get } from 'lodash';
import { getItemLocalStore } from '../../utils/handleLocalStore';

class SkillsMatrix extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [
        {
          id: 1,
          groupSkill: 'PHP',
          skills: ['Wordpress', 'Laravel'],
        },
        {
          id: 2,
          groupSkill: 'JS',
          skills: ['ES6+/JQuery', 'React.js', 'Node.js'],
        },
        {
          id: 3,
          groupSkill: 'Python',
          skills: ['Django', 'TurboGears', 'Flask'],
        },
      ],

      listSkills: [],
      listEmployees: [],
    };

    this.dataTableSkillMatrices = React.createRef();
  }

  loadEmployees = async () => {
    let result = [];
    const res = await APIcaller(`${endpoint.profiles}`);
    const message = get(res, 'data.responseKey');
    console.log('res', res);

    if (message === response.getListSuccess) {
      result = res.data.data;
    } else {
      alertPopup('Faild To load data', errorHandler(message));
    }
    return result;
  };

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

  loadSkillMatrices = async () => {
    let result = [];

    const res = await APIcaller(`${endpoint.skillMatrices}`);
    console.log('Mtr', res);
    const message = get(res, 'data.responseKey');
    if (message === response.getListSuccess) {
      result = res.data.data;
    } else {
      alertPopup('Faild To load data', errorHandler(message));
    }
    return result;
  };

  componentDidMount() {
    this.setState({ loading: true }, async () => {
      try {
        const listEmployees = await this.loadEmployees();
        const listSkills = await this.loadSkills();
        const skillMatrices = await this.loadSkillMatrices();
        console.log('skillMatrices', skillMatrices);

        this.setState({ listSkills, listEmployees, skillMatrices });
      } catch (error) {}
      this.setState({ loading: false });
    });
  }

  renderTableHeader = (listSkills) => {
    let thGroupSkill = [];
    let thSkills = [];
    listSkills.forEach(({ id, groupSkillName, skill }, index) => {
      thGroupSkill.push(
        <th key={id} colSpan={skill.length}>
          {groupSkillName.toUpperCase()}
        </th>
      );
      thSkills.push(
        skill.map(({ skillName }, index) => (
          <th key={groupSkillName + index}>{skillName.toUpperCase()}</th>
        ))
      );
    });

    return [
      <tr key="group">
        <th rowSpan="2">.NO</th>
        <th rowSpan="2">Employee Name</th>
        {thGroupSkill}
      </tr>,
      <tr key="skills">{thSkills}</tr>,
    ];
  };

  renderTableData = (list) => {
    let listSubSkills = [];
    const { listSkills } = this.state;
    listSkills.forEach(({ skill }) => {
      listSubSkills = listSubSkills.concat(skill.map(({ id }) => id));
    });
    const listPermission = getItemLocalStore('listPermissions');
    return list && list.length
      ? list.map(({ profileId, firstName, lastName, skillmatrix }, index) => {
          return (
            <tr key={profileId} id={profileId}>
              <td>{index}</td>
              <td>
                {firstName ? firstName : ''} {lastName ? lastName : ''}
              </td>
              {listSubSkills.map((ele) => {
                const mapSkill = skillmatrix.filter(
                  ({ skillId }) => ele === skillId
                );
                return <td>{mapSkill.length ? mapSkill[0].level : ''}</td>;
              })}
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
                      {/* <Link
                  className="dropdown-item edit"
                  to={`/${endpoint.company}/${endpoint.skillset}/${id}`}>
                  Edit skills
                </Link> */}

                      <button
                        className="dropdown-item"
                        type="button"
                        data-toggle="modal"
                        onClick={() => {
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
                            () => {}
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
          );
        })
      : '';
  };

  render() {
    const { loading, skillMatrices, listSkills } = this.state;
    const listPermission = getItemLocalStore('listPermissions');

    return (
      <div className="container-fluid">
        <div className="form-add card-border-orange bg-white">
          <div className="card-header card-header-divider">
            <h3>Skills Matrix</h3>
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
                  // this.updateForm();
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
                    <h5>ADD SKILL MATRIX</h5>
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
                          value="abc"
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

            <div className="table-width">
              <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3">
                {/* <Link
                  to={{
                    pathname: `/${endpoint.addTimesheet}`,
                    //state: { profileId: profileId },
                  }}
                  className="btn btn-orange float-right">
                  Add
                </Link> */}
              </div>
              {/* <button onClick={this.addSkillToGroup()}>Add</button> */}
              <table
                ref={this.dataTableSkillMatrices}
                cellSpacing="0"
                className="table-responsive table table-bordered table-hover bg-white"
                style={{ width: '100%' }}>
                <thead>{this.renderTableHeader(listSkills)}</thead>
                <tbody>{this.renderTableData(skillMatrices)}</tbody>
              </table>
            </div>

            <p className="mt-4">
              <span className="text-danger">*</span>
              {' Junior level: 0 < years of experience < 3'}
            </p>
            <p>
              <span className="text-danger">*</span>
              {' Middle level: 3 < years of experience < 5'}
            </p>
            <p>
              <span className="text-danger">*</span>
              {' Senior level: 5 < years of experience'}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default SkillsMatrix;
