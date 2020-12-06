import React from 'react';
import 'datatables.net-bs4';
import './index.css';
import profileImg from './profile_ava.svg';
import APIcaller from '../../utils/APIcaller';
import { endpoint } from './../../constants/config';
import { getItemLocalStore } from '../../utils/handleLocalStore';
import { get, isEmpty } from 'lodash';
import * as responses from '../../constants/response';
import Skill from './Skills';
import Experience from './Experience';
import Language from './Language';
import Certification from './Certification';
import Award from './Award';
import Education from './Education';
import Hobbies from './Hobbies';
import Summary from './Summary';
import { alertPopup } from '../../utils/alertPopup';
import { Redirect } from 'react-router-dom';
import { constant } from '../../constants/constant';
const { updateCV } = constant.permissions;
class User extends React.Component {
  constructor(props) {
    super(props);
    this.dataTable = React.createRef();
    this.state = {
      avatar: '',
      loading: false,
      datas: [],
      Skills: [],
      Certification: [],
      Awards: [],
      Languages: [],
      Experience: [],
      Education: [],
      Hobbies: [],
      Summarys: [],
    };
  }
  componentDidMount() {
    const { match } = this.props;
    APIcaller(`${endpoint.profileid}?profileId=${match.params.id}`, 'GET', {
      token: getItemLocalStore('token'),
      accountid: getItemLocalStore('accountid'),
    }).then((res) => {
      const checkKey = get(res, 'data.responseKey');

      if (checkKey === responses.getOneSuccess) {
        const profiledData = get(res, 'data.data', '');
        if (profiledData) {
          this.setState({
            avatar: profiledData.avatar,
            firstName: profiledData.firstName,
            lastName: profiledData.lastName,
          });
        }
      } else {
        window.location.href = '/signin';
      }
    });
  }
  onSave = (e) => {
    e.preventDefault();
    const { match } = this.props;
    const {
      Summarys,
      datas,
      Skills,
      Languages,
      Awards,
      Certification,
      Experience,
      Education,
      Hobbies,
    } = this.state;
    if (!isEmpty(Skills)) {
      Skills.forEach((element, index) => {
        element.priority = Number(index + 1);
        element.profileId = match.params.id;
        datas.push(element);
      });
    }
    if (!isEmpty(Certification)) {
      Certification.forEach((element, index) => {
        element.priority = Number(index + 1);
        element.profileId = match.params.id;
        datas.push(element);
      });
    }
    if (!isEmpty(Awards)) {
      Awards.forEach((element, index) => {
        element.priority = Number(index + 1);
        element.profileId = match.params.id;
        datas.push(element);
      });
    }
    if (!isEmpty(Languages)) {
      Languages.forEach((element, index) => {
        element.priority = Number(index + 1);
        element.profileId = match.params.id;
        datas.push(element);
      });
    }
    if (!isEmpty(Experience)) {
      Experience.forEach((element, index) => {
        element.priority = Number(index + 1);
        element.profileId = match.params.id;
        datas.push(element);
      });
    }
    if (!isEmpty(Education)) {
      Education.forEach((element, index) => {
        element.priority = Number(index + 1);
        element.profileId = match.params.id;
        datas.push(element);
      });
    }
    if (!isEmpty(Hobbies)) {
      Hobbies.forEach((element, index) => {
        element.priority = Number(index + 1);
        element.profileId = match.params.id;
        datas.push(element);
      });
    }
    if (!isEmpty(Summarys)) {
      Summarys.forEach((element, index) => {
        element.priority = Number(index + 1);
        element.profileId = match.params.id;
        datas.push(element);
      });
    }
    this.setState({
      datas: [...datas],
    });
    APIcaller(
      `${endpoint.updateCV}`,
      'PATCH',
      {
        token: getItemLocalStore('token'),
        accountid: getItemLocalStore('accountid'),
      },
      {
        profileId: match.params.id,
        datas,
      }
    ).then((res) => {
      if (res.data.responseKey === responses.updateSuccess) {
        window.location.reload();
        window.open(
          `http://localhost:3000/curriculum/${match.params.id}`,
          '_blank'
        );
      } else {
        alertPopup('FAILD!!!!', res.data.responseKey);
      }
    });
  };
  handleChange = (name, value) => {
    this.setState({ [name]: value });
  };
  render() {
    const { avatar, firstName, lastName } = this.state;
    const { match } = this.props;
    const listPermission = getItemLocalStore('listPermissions');

    return (
      <div className="container-fluid">
        {listPermission.includes(updateCV) ? (
          <div className="form-add card-border-orange bg-white">
            <div className="card-header card-header-divider">
              Spider CV Form
              <span className="card-subtitle">
                Please fill out the form below completely
              </span>
            </div>
            <form className="form-horizontal" onSubmit={this.onSave}>
              <div className="container cv-form">
                <div className="row">
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

                  <h2 className="col-md-12 text-center mt-3 mb-2">
                    {firstName} {lastName}
                  </h2>
                </div>
                <div className="row mt-3 borderline">
                  <div className="col-md-12 mb-3 line-bottom">
                    <div className="btn btn-header">Year of Experience</div>
                  </div>
                  <div className="col-md-12 pb-3">
                    <div className="row">
                      <div className="col-md-8 bg-color pb-3">
                        <input
                          required
                          className="form-control"
                          type="number"
                          min="0"
                          name="yearOfExp"
                        />
                      </div>
                      <div className="col bg-color pb-3"></div>
                    </div>
                  </div>
                </div>
                <div className="row mt-3 borderline">
                  <div className="col-md-12 mb-3 line-bottom">
                    <div className="btn btn-header">Summary</div>
                  </div>
                  <Summary
                    id={match.params.id}
                    saveSummary={(data) => {
                      this.handleChange('Summarys', data);
                    }}
                  />
                </div>
                <div className="row mt-3 borderline">
                  <div className="col-md-12 mb-3 line-bottom">
                    <div className="btn btn-header">Skills</div>
                  </div>
                  <Skill
                    id={match.params.id}
                    saveSkill={(data) => {
                      this.handleChange('Skills', data);
                    }}
                  />
                </div>
                <div className="row mt-3 borderline">
                  <div className="col-md-12 mb-3 line-bottom">
                    <div className="btn btn-header">Hobbies</div>
                  </div>
                  <Hobbies
                    id={match.params.id}
                    saveHobbies={(data) => {
                      this.handleChange('Hobbies', data);
                    }}
                  />
                </div>
                <div className="row mt-3 borderline">
                  <div className="col-md-12 mb-3 line-bottom mt-3">
                    <div className="btn btn-header">Experience</div>
                  </div>
                  <Experience
                    id={match.params.id}
                    saveExperience={(data) => {
                      this.handleChange('Experience', data);
                    }}
                  />
                </div>
                <div className="row mt-3 borderline">
                  <div className="col-md-12 mb-3 line-bottom">
                    <div className="btn btn-header">Education</div>
                  </div>
                  <Education
                    id={match.params.id}
                    saveEducation={(data) => {
                      this.handleChange('Education', data);
                    }}
                  />
                </div>
                <div className="row mt-3 borderline">
                  <div className="col-md-12 mb-3 line-bottom">
                    <div className="btn btn-header">Languages</div>
                  </div>
                  <Language
                    id={match.params.id}
                    saveLanguages={(data) => {
                      this.handleChange('Languages', data);
                    }}
                  />
                </div>
                <div className="row mt-3 borderline">
                  <div className="col-md-12 mb-3 line-bottom">
                    <div className="btn btn-header">Certification</div>
                  </div>
                  <Certification
                    id={match.params.id}
                    saveCertification={(data) => {
                      this.handleChange('Certification', data);
                    }}
                  />
                </div>
                <div className="row mt-3 borderline">
                  <div className="col-md-12 mb-3 line-bottom">
                    <div className="btn btn-header">Awards </div>
                  </div>
                  <Award
                    id={match.params.id}
                    saveAwards={(data) => {
                      this.handleChange('Awards', data);
                    }}
                  />
                </div>
                <div className="row mt-3">
                  <div className="col-md-2 button-center">
                    <button type="submit" className="btn btn-orange">
                      {' '}
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <Redirect to="/" />
        )}
      </div>
    );
  }
}

export default User;
