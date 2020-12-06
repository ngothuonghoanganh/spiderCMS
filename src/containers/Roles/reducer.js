/** Import From File */
import * as Types from './constants';
import { findIndex } from 'lodash';

const roles = (state = [], action) => {
  switch (action.type) {
    case Types.FETCH_ROLES: {
      return [...action.roles];
    }

    case Types.ADD_ROLE: {
      return [...state.push(action.role)];
    }

    case Types.DELETE_ROLE: {
      const index = findIndex(state, (role) => role.id === action.role.id);
      if (index >= 0) {
        state.splice(index, 1);
        return [...state];
      }
      return state;
    }

    case Types.UPDATE_ROLE: {
      const index = findIndex(state, (role) => role.id === action.role.id);
      if (index >= 0) {
        state[index] = action.role;
        return [...state];
      }
      return state;
    }

    default:
      return state;
  }
};

export default roles;
