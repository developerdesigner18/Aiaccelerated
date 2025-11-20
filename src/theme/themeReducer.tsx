import { SET_THEME, THEME_LOADED } from "./themeTypes";

// state type
interface ThemeState {
  isDark: boolean;
  loaded: boolean;
}

// action types
interface SetThemeAction {
  type: typeof SET_THEME;
  payload: boolean;
}

interface ThemeLoadedAction {
  type: typeof THEME_LOADED;
  payload: boolean;
}

type ThemeActionTypes = SetThemeAction | ThemeLoadedAction;

// Initial state
const initialState: ThemeState = {
  isDark: false,
  loaded: false,
};

// Reducer
export default function themeReducer(
  state = initialState,
  action: ThemeActionTypes
): ThemeState {
  switch (action.type) {
    case SET_THEME:
      return { ...state, isDark: action.payload };

    case THEME_LOADED:
      return { ...state, isDark: action.payload, loaded: true };

    default:
      return state;
  }
}
