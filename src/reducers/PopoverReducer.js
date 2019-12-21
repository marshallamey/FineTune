export default (state = {
  acPopoverOpen: false,
  dncPopoverOpen: false,
  enPopoverOpen: false,
  instPopoverOpen: false,
  keyPopoverOpen: false,
  livePopoverOpen: false,
  loudPopoverOpen: false,
  modePopoverOpen: false,
  popPopoverOpen: false,
  spPopoverOpen: false,
  tempPopoverOpen: false,
  tsPopoverOpen: false,
  valPopoverOpen: false,
  durPopoverOpen: false,
  sigPopoverOpen: false,
}, action) => {
  switch (action.type) {
    case 'TOGGLE_POPOVER': {
      const key0 = Object.keys(action.payload)[0];
      const value0 = Object.values(action.payload)[0];
      return { ...state, [key0]: value0 };
    }
    default:
      return state;
  }
};
