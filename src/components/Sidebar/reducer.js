const minimized = (state = true, action) => {
  switch (action.type) {
    case 'MINIMIZED_SIDEBAR':
      return action.minimized;
    default:
      return state;
  }
};

export default minimized;
