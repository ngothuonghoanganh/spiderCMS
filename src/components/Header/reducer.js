import * as constant from './constants';

const visibleOnDesktop = window.innerWidth >= 768;

const visible = (state = visibleOnDesktop, action) => {
  switch (action.type) {
    case constant.TOGGLE_SIDEBAR:
      return action.visible;
    default:
      return state;
  }
};
export default visible;
