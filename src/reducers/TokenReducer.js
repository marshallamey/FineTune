export default (state = { access_token: '', refresh_token: '' }, action) => {
  switch (action.type) {
    case 'GET_TOKENS':
      return action.payload;
    case 'REFRESH_TOKENS':
      return action.payload;
    default:
      return state;
  }
};
