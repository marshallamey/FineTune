import { toast } from 'react-toastify';

export const genreToast = () => toast.error('You must select at least 1 genre and '
  + 'no more than 5. Please change your selection.');

export const expiredToast = () => toast.error('Your access to Spotify expired. '
  + 'Logging you back in.');

export const searchingToast = () => toast.success('Building your playlist! '
  + 'Please wait.');

export const trackSavedToast = () => toast.success('Song successfully saved to library');
export const listCreatedToast = () => toast.success('Playlist successfully saved to library');
export const playingToast = (song, device) => toast.success(`Playing ${song} on ${device}`);
