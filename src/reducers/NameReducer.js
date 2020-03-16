export default (state = '', action) => {
  switch (action.type) {
    case 'SET_PLAYLIST_NAME':

      return action.payload;
    default:
      return state;
  }
};
