export default (state = [], action) => {
  switch (action.type) {
    case 'GET_PLAYLISTS':
      return action.payload;
    case 'DELETE_PLAYLISTS':
        console.log('RETURNING', action.payload);
        return action.payload;
    default:
      return state;
  }
};
