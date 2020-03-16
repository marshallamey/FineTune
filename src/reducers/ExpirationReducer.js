export default (state = 0, action) => {
  switch (action.type) {
    case 'GET_EXPIRE_TIME':
      return action.payload;
    default:
      return state;
  }
};
