
import * as constant from './constants';

const positionData = (state = '', action) => {
  switch (action.type) {
    case constant.LOAD_POSITIONS:
      return {
        positions: action.payload,
      };
    default:
      return state;
  }
};

export default positionData;
