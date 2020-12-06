import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { get, upperFirst, map, isEmpty } from 'lodash';
import './index.css';
import APIcaller from '../../utils/APIcaller';
import moment from 'moment';
import { getItemLocalStore } from '../../utils/handleLocalStore';
import { endpoint } from '../../constants/config';
import { getListTypeCV } from './../ViewCV/actions';
import * as responseKey from './../../constants/response';
import { alertPopup } from '../../utils/alertPopup';
import errorHandler from '../../utils/handlerError';
class Curriculum extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listSkill: [],
      listExperience: [],
      listLanguage: [],
      listCertification: [],
      listAward: [],
      listEducation: [],
      listHobbies: [],
      listSummary: [],
    };
  }

  componentWillMount() {
    const { match, getListTypeCV } = this.props;
    APIcaller(`${endpoint.profileid}?profileId=${match.params.id}`, 'GET', {
      token: getItemLocalStore('token'),
      accountid: getItemLocalStore('accountid'),
    }).then((res) => {
      const checkKey = get(res, 'data.responseKey');
      if (checkKey === responseKey.getOneSuccess) {
        const profiledData = get(res, 'data.data', '');
        if (profiledData) {
          this.setState({
            position: upperFirst(map(profiledData.positions, 'positionName')),
            firstName: profiledData.firstName,
            lastName: profiledData.lastName,
            avatar: profiledData.avatar,
          });
        }
      } else {
        alertPopup('FAILED!!!', errorHandler(checkKey));
      }
    }).then(() => {
      getListTypeCV((result, listTypeCV) => {
        if (result) {
          this.setState({
            listTypeCV,
          });
          listTypeCV.forEach((item) => {
            if (item.name === 'Skills') {
              this.setState({
                typeObjectIdSkill: item.id,
              });
            }
            if (item.name === 'Experience') {
              this.setState({
                typeObjectIdExperience: item.id,
              });
            }
            if (item.name === 'Languages') {
              this.setState({
                typeObjectIdLanguages: item.id,
              });
            }
            if (item.name === 'Certification') {
              this.setState({
                typeObjectCertification: item.id,
              });
            }
            if (item.name === 'Awards') {
              this.setState({
                typeObjectAward: item.id,
              });
            }
            if (item.name === 'Education') {
              this.setState({
                typeObjectEducation: item.id,
              });
            }
            if (item.name === 'Hobbies') {
              this.setState({
                typeObjectHobbies: item.id,
              });
            }
            if (item.name === 'Summary') {
              this.setState({
                typeObjectSummary: item.id,
              });
            }
          });
          const { typeObjectSummary, listSummary, listHobbies, typeObjectHobbies, listEducation, typeObjectEducation, typeObjectAward, listAward, listCertification, typeObjectCertification, listSkill, typeObjectIdSkill, typeObjectIdExperience, listExperience, listLanguage, typeObjectIdLanguages } = this.state;
          APIcaller(`${endpoint.getOneCV}?profileId=${match.params.id}`, 'GET', {
            token: getItemLocalStore('token'),
            accountid: getItemLocalStore('accountid'),
          }).then((res) => {
            const message = get(res, 'data.responseKey');
            if (res.data.responseKey === responseKey.getListSuccess) {
              const CVData = get(res, 'data.data', '');
              CVData.forEach((item) => {
                if (item.typeObjectId === typeObjectIdSkill) {
                  listSkill.push(item);
                }
                if (item.typeObjectId === typeObjectIdExperience) {
                  listExperience.push(item);
                }
                if (item.typeObjectId === typeObjectIdLanguages) {
                  listLanguage.push(item);
                }
                if (item.typeObjectId === typeObjectCertification) {
                  listCertification.push(item);
                }
                if (item.typeObjectId === typeObjectAward) {
                  listAward.push(item);
                }
                if (item.typeObjectId === typeObjectEducation) {
                  listEducation.push(item);
                }
                if (item.typeObjectId === typeObjectHobbies) {
                  listHobbies.push(item);
                }
                if (item.typeObjectId === typeObjectSummary) {
                  listSummary.push(item);
                }
              });
              this.setState({
                listSkill: [...listSkill],
                listExperience: [...listExperience],
                listLanguage: [...listLanguage],
                listCertification: [...listCertification],
                listAward: [...listAward],
                listEducation: [...listEducation],
                listHobbies: [...listHobbies],
                listSummary: [...listSummary],
              });
            } else {
              alertPopup('FAILED!!!', errorHandler(message));
            }
          });
        }
      });
    });
  }

  showSkills(listSkills = []) {
    let result = '';
    if (listSkills.length > 0) {
      result = listSkills.map((skill, index) => (
        <li key={index}>
          <span>{skill.name}</span>
          <span className="pull-right color-f90">{skill.content}/5</span>
        </li>
      ));
    }
    return result;
  }
  showExperience(listExperience = []) {
    let result = '';
    if (listExperience.length > 0) {
      result = listExperience.map((item, index) => (
        <div className="card" key={index}>
          <div className="card-body">
            <h4 className="card-company color-f70 print-f13">{item.company}</h4>
            <div className="media font-12vw print-f12">
              <div className="media-left col-2 ">
                <span className="color-f90">{moment(item.from).format('YYYY')} - {moment(item.to).format('YYYY')}</span>
              </div>
              <div className="media-body col-10">
                <p className="media-heading">{item.name}</p>
                <p className="">{item.content}</p>
              </div>
            </div>
          </div>
        </div>
      ));
    }
    return result;
  }
  showLanguage(listLanguage = []) {
    let result = '';
    if (listLanguage.length > 0) {
      result = listLanguage.map((item, index) => (
        <div className="card" key={index}>
          <div className="card-body pd-bt0">
            <div className="media font-12vw print-f12">
              <div className="media-left col-2">
                <span className="color-f90">{item.name}</span>
              </div>
              <div className="media-body col-10">
                <p>{item.content}</p>
              </div>
            </div>
          </div>
        </div>
      ));
    }
    return result;
  }
  showCertification(listCertification = []) {
    let result = '';
    if (listCertification.length > 0) {
      result = listCertification.map((item, index) => (
        <div className="card" key={index}>
          <div className="card-body pd-bt0">
            <div className="media font-12vw print-f12">
              <div className="media-left col-2">
                <span className="color-f90">{moment(item.from).format('MM/DD/YYYY')}</span>
              </div>
              <div className="media-body col-10">
                <p>{item.content}</p>
              </div>
            </div>
          </div>
        </div>
      ));
    }
    return result;
  }
  showAward(listAward = []) {
    let result = '';
    if (listAward.length > 0) {
      result = listAward.map((item, index) => (
        <div className="card" key={index}>
          <div className="card-body pd-bt0">
            <div className="media font-12vw print-f12">
              <div className="media-left col-2">
                <span className="color-f90">{moment(item.from).format('MM/DD/YYYY')}</span>
              </div>
              <div className="media-body col-10">
                <p>{item.content}</p>
              </div>
            </div>
          </div>
        </div>
      ));
    }
    return result;
  }
  showEducation(listEducation = []) {
    let result = '';
    if (listEducation.length > 0) {
      result = listEducation.map((item, index) => (
        <div className="card" key={index}>
          <div className="card-body pd-bt0">
            <div className="media font-12vw print-f12">
              <div className="media-left col-2">
                <span className="color-f90">{moment(item.from).format('YYYY')} - {moment(item.to).format('YYYY')}</span>
              </div>
              <div className="media-body col-10">
                <p>{item.content}</p>
              </div>
            </div>
          </div>
        </div>
      ));
    }
    return result;
  }
  ShowHobbies(listHobbies = []) {
    let result = '';
    if (listHobbies.length > 0) {
      result = listHobbies.map((item, index) => (
        <div className="skill pd-125vw pd-bt0" key={index}>
          <ul className="list-unstyled print-f12">
            <li>
              <span>{item.name}</span>
            </li>
          </ul>
        </div>
      ));
    }
    return result;
  }
  ShowSummary(listSummary = []) {
    let result = '';
    if (listSummary.length > 0) {
      result = listSummary.map((item, index) => (
        <p className="card-text card-body font-12vw print-f12" key={index}>{item.content}</p>
      ));
    }
    return result;
  }
  render() {
    const {
      listSummary,
      listHobbies,
      listEducation,
      avatar,
      firstName,
      lastName,
      position,
      listSkill,
      listExperience,
      listLanguage,
      listCertification,
      listAward,
    } = this.state;
    return (
      <div className="container cv-spider">
        <div className="row bg-white card-border-bottom-orange">
          <button type="submit" className="btn btn-orange btn-print" onClick={window.print}>Save as PDF</button>
          <div className="col-3 bg-cv ">
            <div className="print-pd">
              <div className="card text-center">
                <div className="card-body">
                  <div className="dropzone-user">
                    <img
                      alt=""
                      src={`${!avatar ? '#' : endpoint.url}/${endpoint.image}/avatar/${avatar}`}
                      className={!avatar ? 'hidden' : 'imageCV'}
                    />
                  </div>
                  <h4 className="card-title color-f50 print-name print-f14 mt-4">{`${firstName} ${lastName}`}</h4>
                  <p className="card-text cv-position print-f13">{position}</p>
                </div>
              </div>

              {!isEmpty(listSkill) ?
                <div className="card">
                  <div className="card-body">
                    <div className="cv-info">
                      <h4 className="card-title color-f50 pd-r15 print-f14">Skills</h4>
                      <span className="cv-line"></span>
                    </div>
                    <div className="skill pd-125vw pd-bt0">
                      <ul className="list-unstyled print-f12">
                        {this.showSkills(listSkill)}
                      </ul>
                    </div>
                  </div>
                </div> : ''
              }
              {!isEmpty(listHobbies) ?
                <div className="card">
                  <div className="card-body">
                    <div className="cv-info">
                      <h4 className="print-f14 card-title color-f50 pd-r15">Hobbies</h4>
                      <span className="cv-line"></span>
                    </div>
                    {this.ShowHobbies(listHobbies)}
                  </div>
                </div> : ''
              }
            </div>


          </div>

          <div className="col-9 ">
            <div className="print-pd">
              {!isEmpty(listSummary) ?
                <div className="cv-summary pd-125vw">
                  <div className="cv-info">
                    <h4 className="card-title color-f50 pd-r15 print-f14">Summary</h4>
                    <span className="cv-line"></span>
                  </div>
                  {this.ShowSummary(listSummary)}
                </div> : ''
              }
              {!isEmpty(listExperience) ?
                <div className="cv-exp pd-125vw">
                  <div className="cv-info">
                    <h4 className="card-title color-f50 pd-r15 print-f14">Experience</h4>
                    <span className="cv-line"></span>
                  </div>
                  {this.showExperience(listExperience)}
                </div> : ''
              }
              {!isEmpty(listEducation) ?
                <div className="cv-lang pd-125vw">
                  <div className="cv-info">
                    <h4 className="card-title color-f50 pd-r15 print-f14">Education</h4>
                    <span className="cv-line"></span>
                  </div>
                  {this.showEducation(listEducation)}
                </div> : ''
              }
              {!isEmpty(listLanguage) ?
                <div className="cv-lang pd-125vw">
                  <div className="cv-info">
                    <h4 className="card-title color-f50 pd-r15 print-f14">Languages</h4>
                    <span className="cv-line"></span>
                  </div>
                  {this.showLanguage(listLanguage)}
                </div> : ''
              }
              {!isEmpty(listCertification) ?
                <div className="cv-lang pd-125vw">
                  <div className="cv-info">
                    <h4 className="card-title color-f50 pd-r15 print-f14">Certification</h4>
                    <span className="cv-line"></span>
                  </div>
                  {this.showCertification(listCertification)}
                </div> : ''
              }
              {!isEmpty(listAward) ?
                <div className="cv-lang pd-125vw">
                  <div className="cv-info">
                    <h4 className="card-title color-f50 pd-r15 print-f14">Award</h4>
                    <span className="cv-line"></span>
                  </div>
                  {this.showAward(listAward)}
                </div> : ''
              }
            </div>
          </div>
          <span className="print-line"></span>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => (
  {
    getListTypeCV: bindActionCreators(getListTypeCV, dispatch),
  }
);


export default connect(null, mapDispatchToProps)(Curriculum);

