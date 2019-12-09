import { combineReducers } from 'redux';
import GenreReducer from './GenreReducer';
import SongReducer from './SongReducer';
import SelectedReducer from './SelectedReducer';
import UserReducer from './UserReducer';
import TokenReducer from './TokenReducer';
import ExpirationReducer from './ExpirationReducer';
import DeviceReducer from './DeviceReducer';
import AttributeReducer from './AttributeReducer';
import PopoverReducer from './PopoverReducer';
import RedirectReducer from './RedirectReducer';
import KeywordReducer from './KeywordReducer';

export default combineReducers({
  user: UserReducer,
  devices: DeviceReducer,
  spotifyTokens: TokenReducer,
  expireTime: ExpirationReducer,
  allGenres: GenreReducer,
  selectedGenres: SelectedReducer,
  songs: SongReducer,
  attributes: AttributeReducer,
  popovers: PopoverReducer,
  redirect: RedirectReducer,
  keyword: KeywordReducer,
});
