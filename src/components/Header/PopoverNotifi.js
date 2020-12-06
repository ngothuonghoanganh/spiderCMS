import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button, PopoverHeader, Popover, PopoverBody } from 'reactstrap';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';
import * as responses from '../../constants/response';
import APIcaller from '../../utils/APIcaller';
import { endpoint } from './../../constants/config';
import { getItemLocalStore } from '../../utils/handleLocalStore';
class PopoverNotifi extends React.Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.onFocus = this.onFocus.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.state = {
      popoverOpen: false,
      id: '',
      addClass: false,
      notiNumber: '',
    };
  }
  componentDidMount() {
    APIcaller(`${endpoint.notifications}`, 'GET', {
      token: getItemLocalStore('token'),
      accountid: getItemLocalStore('accountid'),
    }).then((res) => {
      if (res.data.responseKey === responses.getListSuccess) {
        this.setState({
          notiNumber: res.data.freshData || '',
        });
      }
    });
  }
  onFocus() {
    this.setState({
      id: 'icNotiIn',
    });
  }
  onBlur() {
    this.setState({
      id: 'icNotiOut',
    });
  }
  toggle() {
    this.setState({
      popoverOpen: !this.state.popoverOpen,
    });
  }
  render() {
    const { notiNumber } = this.state;
    // console.log(this.state);
    const boxClass = ['nav-item dropdown'];
    if (this.state.addClass) {
      boxClass.push('iconPopo');
    }
    return (
      <li
        className="nav-item dropdown"
        id={this.state.id}
        onFocus={this.onFocus}
        onBlur={this.onBlur}>
        <Button
          className="fix-color1"
          color="secondary"
          id="notifi"
          onClick={this.toggle}>
          <FontAwesomeIcon icon="bell" />
        </Button>
        <Popover
          placement="bottom"
          isOpen={this.state.popoverOpen}
          target="notifi"
          toggle={this.toggle}>
          <PopoverHeader>Notifications (1)</PopoverHeader>
          <PopoverBody className=" notification-unread" href="#">
            <NavLink to={`/${endpoint.notifications}`}>
              <div className="media">
                <FontAwesomeIcon icon="birthday-cake" className="reSizeFa" />
                <div className="media-body media-ml">
                  <span>
                    Have a <strong>{notiNumber}</strong> birthday in this Month.
                    Show them you care.
                  </span>
                </div>
              </div>
            </NavLink>
          </PopoverBody>
          {/* <PopoverBody className="" href="#">
            <div className="media">
              <FontAwesomeIcon icon="envelope" className="reSizeFa" />
              <div className="media-body media-ml">
                <span>New notification</span>
              </div>
            </div>
          </PopoverBody>
          <PopoverBody className=" notification-unread" href="#">
            <div className="media">
              <FontAwesomeIcon icon="envelope" className="reSizeFa" />
              <div className="media-body media-ml">
                <span>New notification</span>
              </div>
            </div>
          </PopoverBody> */}
          <PopoverBody className="dropdown-item text-center" href="#">
            View All
          </PopoverBody>
        </Popover>
      </li>
    );
  }
}
class PopoverExampleMulti1 extends React.Component {
  render() {
    return (
      <div>
        <PopoverNotifi />
      </div>
    );
  }
}
export default PopoverExampleMulti1;
