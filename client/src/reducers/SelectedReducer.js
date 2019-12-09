export default (state = [], action) => {
  switch (action.type) {
    case 'SELECT_GENRE':
      return action.payload;
    default:
      return state;
  }
};
