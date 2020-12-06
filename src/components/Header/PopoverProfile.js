import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import { Button, Popover } from 'reactstrap';
import { loadDataProfile } from '../../containers/EditProfile/actions';
import profileImg from './profile_ava.svg';
import { logOut } from './actions';
import { endpoint } from './../../constants/config';
import { getItemLocalStore } from '../../utils/handleLocalStore';
class PopoverProfile extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      popoverOpen: false,
      avatar: '',
      position: '',
      addClass: false,
    };
  }
  componentWillMount() {
    const profileId = getItemLocalStore('userData.profileId');
    this.props.loadDataProfile(profileId);
  }
  componentWillReceiveProps(nextprops) {
    const data = nextprops.loadProfileData;
    this.setState({
      ...data,
    });
  }
  hiddenProfile = () => {
    this.setState({ addClass: !this.state.addClass });
  };
  toggle = () => {
    this.setState({
      popoverOpen: !this.state.popoverOpen,
    });
  };
  handleSignOut = () => {
    const username = getItemLocalStore('userData.username');
    this.props.logOut(username);
  };
  render() {
    const { firstName, lastName, avatar } = this.state;
    const boxClass = ['popProfile'];
    const profileId = getItemLocalStore('userData.profileId');
    if (this.state.addClass) {
      boxClass.push('');
    }
    const username = getItemLocalStore('userData.username');
    const fullName = `${firstName ? firstName : ''} ${
      lastName ? lastName : ''
    }`;
    return (
      <li className="nav-item dropdown" id="popProfile">
        <Button
          className="py-0 fix-color1"
          color="secondary"
          id="profile"
          onClick={this.toggle}>
          {!avatar ? (
            <img src={profileImg} width="34" height="34" alt="Avatar" />
          ) : (
            <img
              src={`${endpoint.url}/${endpoint.imageURL}/${this.state.avatar}`}
              className="avt-header"
              alt="Avatar"
            />
          )}
        </Button>
        <Popover
          className={boxClass.join(' ')}
          placement="bottom"
          isOpen={this.state.popoverOpen}
          target="profile"
          toggle={this.toggle}>
          <div className="media">
            {!avatar ? (
              <NavLink
                to={`/${endpoint.profile}/${endpoint.view}/${profileId}`}>
                <img
                  src={profileImg}
                  width="50"
                  height="50"
                  alt="Avatar"
                  className="mr-3 avt-profile"
                />
              </NavLink>
            ) : (
              <NavLink
                to={`/${endpoint.profile}/${endpoint.view}/${profileId}`}>
                <img
                  src={`${endpoint.url}/${endpoint.imageURL}/${this.state.avatar}`}
                  className="avt-profile mr-3"
                  alt="Avatar"
                />
              </NavLink>
            )}
            <div className="media-body">
              <div className="profile-name">
                <span>{username}</span>
              </div>
              <p className="profile-mail">{fullName}</p>
            </div>
          </div>
          <div className="profile-edit">
            <Link
              onClick={this.hiddenProfile}
              className="btn btn-orange sign-out"
              to={`/${endpoint.profile}`}>
              Edit Profile
            </Link>
            <Link
              to=""
              className="btn btn-orange sign-out"
              onClick={this.handleSignOut}>
              Sign out
            </Link>
          </div>
        </Popover>
      </li>
    );
  }
}
PopoverProfile.propTypes = {
  logOut: PropTypes.func,
  loadDataProfile: PropTypes.func,
};
const mapStateToProps = (state) => ({
  loadProfileData: state.profileUser.data,
});
const mapDispatchToProps = (dispatch) => ({
  logOut: bindActionCreators(logOut, dispatch),
  loadDataProfile: bindActionCreators(loadDataProfile, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PopoverProfile);
