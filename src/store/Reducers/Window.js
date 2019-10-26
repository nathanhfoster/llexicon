import { ReduxActions } from "../../constants.js";

const defaultState = { innerHeight: null, innerWidth: null, isMobile: null };

export const Window = (state = defaultState, action) => {
  const { type, payload } = action;
  switch (type) {
    case ReduxActions.SET_WINDOW:
      return payload;
    case ReduxActions.RESET_REDUX:
      return defaultState;
    default:
      return state;
  }
};
