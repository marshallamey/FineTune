export default (state = {
  min_acousticness: 0.0,
  max_acousticness: 1.0,
  min_danceability: 0.0,
  max_danceability: 1.0,
  min_duration: 60000,
  max_duration: 1800000,
  min_energy: 0.0,
  max_energy: 1.0,
  min_instrumentalness: 0.0,
  max_instrumentalness: 1.0,
  min_liveness: 0.0,
  max_liveness: 1.0,
  min_loudness: -60,
  max_loudness: 0,
  min_popularity: 0,
  max_popularity: 100,
  min_speechiness: 0.0,
  max_speechiness: 1.0,
  min_tempo: 40,
  max_tempo: 300,
  min_valence: 0.0,
  max_valence: 1.0,
  target_key: 0,
  target_mode: 1,
  target_signature: 4,
  keyDisabled: true,
  modeDisabled: true,
  signatureDisabled: true,
}, action) => {
  switch (action.type) {
    case 'CHANGE_ATTRIBUTES': {
      const key0 = Object.keys(action.payload)[0];
      const value0 = Object.values(action.payload)[0];
      if (Object.keys(action.payload)[1]) {
        const key1 = Object.keys(action.payload)[1];
        const value1 = Object.values(action.payload)[1];
        return { ...state, [key0]: value0, [key1]: value1 };
      } return { ...state, [key0]: value0 };
    }
    case 'RESET_ATTRIBUTES':
      return {
        min_acousticness: 0.0,
        max_acousticness: 1.0,
        min_danceability: 0.0,
        max_danceability: 1.0,
        min_duration: 60000,
        max_duration: 1800000,
        min_energy: 0.0,
        max_energy: 1.0,
        min_instrumentalness: 0.0,
        max_instrumentalness: 1.0,
        min_liveness: 0.0,
        max_liveness: 1.0,
        min_loudness: -60,
        max_loudness: 0,
        min_popularity: 0,
        max_popularity: 100,
        min_speechiness: 0.0,
        max_speechiness: 1.0,
        min_tempo: 40,
        max_tempo: 300,
        min_valence: 0.0,
        max_valence: 1.0,
        target_key: 0,
        target_mode: 1,
        target_signature: 4,
        keyDisabled: true,
        modeDisabled: true,
        signatureDisabled: true,
      };
    default:
      return state;
  }
};
