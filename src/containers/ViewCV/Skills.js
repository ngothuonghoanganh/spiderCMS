// Import from node_module
import React from 'react';
import 'datatables.net-bs4';
import StarRatings from 'react-star-ratings';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getListTypeCV } from './actions';
import APIcaller from '../../utils/APIcaller';
import { get, isEmpty } from 'lodash';
import { endpoint } from './../../constants/config';
import { getItemLocalStore } from '../../utils/handleLocalStore';
import * as responses from '../../constants/response';
import './index.css';

// Import From File

class Skills extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listSkill: [],
      skill: [],
    };
    this.dataTable = React.createRef();
  }
  componentWillMount() {
    this.props.getListTypeCV((result, listTypeCV) => {
      if (result) {
        this.setState({
          listTypeCV,
        });
        listTypeCV.forEach((item) => {
          if (item.name === 'Skills') {
            this.setState({
              typeObjectId: item.id,
            });
          }
        });
        const { id } = this.props;
        const { listSkill, typeObjectId } = this.state;
        APIcaller(`${endpoint.getOneCV}?profileId=${id}`, 'GET', {
          token: getItemLocalStore('token'),
          accountid: getItemLocalStore('accountid'),
        }).then((res) => {
          if (res.data.responseKey === responses.getListSuccess) {
            const CVData = get(res, 'data.data', '');
            CVData.forEach((item) => {
              if (item.typeObjectId === typeObjectId) {
                const data = {
                  name: item.name,
                  content: item.content,
                  typeObjectId: item.typeObjectId,
                  id: item.id,
                };
                listSkill.push(data);
              }
            });
            this.setState({
              listSkill: [...listSkill],
            });
            this.props.saveSkill(listSkill);
          }
        });
      }
    });
  }
  onSubmit = () => {
    const data = {
      name: this.state.skill,
      content: this.state.rating,
      typeObjectId: this.state.typeObjectId,
    };
    const { listSkill } = this.state;
    listSkill.push(data);
    this.setState({
      listSkill: [...listSkill],
    });
    this.onClear();
    this.props.saveSkill(listSkill);
  };
  onClear = () => {
    this.setState({
      skill: '',
      rating: 0,
    });
  };
  onChange = (e) => {
    const { target } = e;
    const { name } = target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({
      [name]: value,
    });
  };

  onChangeInputSkill = (index, e) => {
    const { target } = e;
    const { name } = target;
    console.log(name, index);
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.setState({
      [name]: value,
    });
  };

  onEdit = (index) => {
    document.getElementById('skillEdit' + index).disabled = false;
    // document.getElementById('buttonEditSkill' + index).innerText = 'Save';
  };

  onDelete = (id, idSkill) => {
    if (id) {
      APIcaller(
        `${endpoint.deleteOneCV}`,
        'DELETE',
        {
          token: getItemLocalStore('token'),
          accountid: getItemLocalStore('accountid'),
        },
        {
          cvId: id,
        }
      ).then((res) => {
        if (res.data.responseKey === responses.deleteSuccess) {
          const { listSkill } = this.state;
          listSkill.forEach((item, index) => {
            if (item.id === id) {
              listSkill.splice(index, 1);
            }
          });
          this.setState({
            listSkill,
          });
          this.props.saveSkill(listSkill);
        }
      });
    } else {
      const { listSkill } = this.state;
      listSkill.forEach((item, index) => {
        if (index + 1 === idSkill) {
          listSkill.splice(index, 1);
        }
      });
      this.setState({
        listSkill,
      });
      this.props.saveSkill(listSkill);
    }
  };
  changeRating = (newRating) => {
    this.setState({
      rating: newRating,
    });
  };
  showSkills = (listSkill = []) => {
    let result = [];
    console.log(this.state.listSkill[0]);
    if (listSkill.length > 0) {
      result = listSkill.map((element, index) => (
        <div key={index} className="col-md-12 bg-color pb-3">
          <div className="row">
            <div className="col-md-4">
              <input
                disabled
                type="text"
                id={'skillEdit' + index}
                className="form-control skillEdit"
                name={'skill' + index}
                value={this.state.listSkill[index].name}
                onChange={(e) => {
                  this.onChangeInputSkill(index, e);
                }}
              />
            </div>
            <div className="col-md-4 text-center">
              <StarRatings
                rating={element.content}
                starRatedColor="orange"
                changeRating={this.changeRating}
                numberOfStars={5}
                name="rating"
                starDimension="30px"
              />
            </div>
            <div className="col-md-2 pr-0">
              <div className="float-right mr-1">
                <button
                  type="button"
                  onClick={() => {
                    this.onEdit(index);
                  }}
                  id={'buttonEditSkill' + index}
                  className="btn btn-orange">
                  {' '}
                  Edit
                </button>
              </div>
            </div>
            <div className="col-md-2 pr-0">
              <div className="float-right mr-1">
                <button
                  type="button"
                  onClick={() => this.onDelete(element.id, index + 1)}
                  className="btn btn-orange">
                  {' '}
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ));
    }
    return result;
  };
  render() {
    const { skill, listSkill } = this.state;
    console.log(this.state);
    return (
      <div className="col-md-12 pb-3">
        <div className="row">
          <div className="col-md-12 bg-color pb-3">
            <div className="row">
              <div className="col-md-4">
                <input
                  type="text"
                  className="form-control"
                  name="skill"
                  value={skill}
                  onChange={this.onChange}
                />
              </div>
              <div className="col-md-4 text-center">
                <StarRatings
                  rating={this.state.rating}
                  starRatedColor="orange"
                  changeRating={this.changeRating}
                  numberOfStars={5}
                  name="rating"
                  starDimension="30px"
                />
              </div>
              <div className="col-md-2 pr-0">
                <div className="float-right mr-1">
                  <button
                    type="button"
                    onClick={this.onSubmit}
                    className="btn btn-orange">
                    {' '}
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
          {!isEmpty(listSkill) ? this.showSkills(listSkill) : ''}
        </div>
      </div>
    );
  }
}
const mapDispatchToProps = (dispatch) => ({
  getListTypeCV: bindActionCreators(getListTypeCV, dispatch),
});

export default connect(null, mapDispatchToProps)(Skills);
