export default (state = false, action) => {
  switch (action.type) {
    case 'SET_REDIRECT':
      return action.payload;
    default:
      return state;
  }
};
