export default (state = '', action) => {
  switch (action.type) {
    case 'GET_DEVICES':
      return action.payload;
    default:
      return state;
  }
};
