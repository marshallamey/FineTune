export default (state = [], action) => {
  switch (action.type) {
    case 'GET_TRACKS':
      return action.payload;
    case 'ADD_SONGS':
      return action.payload;
    case 'DELETE_SONG':
        console.log('RETURNING', action.payload);
        return action.payload;
    default:
      return state;
  }
};
