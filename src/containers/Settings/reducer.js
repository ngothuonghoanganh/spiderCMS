import * as constant from './constants';

export const theme = (state = '', action) => {
  switch (action.type) {
    case constant.CHANGE_THEME:
      return action.theme;
    default:
      return state;
  }
};
