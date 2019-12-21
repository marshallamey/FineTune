export default (state = [], action) => {
  switch (action.type) {
    case 'ADD_SONGS':
      return action.payload;
    default:
      return state;
  }
};
