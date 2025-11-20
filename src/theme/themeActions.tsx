import { SET_THEME, TOGGLE_THEME, LOAD_THEME } from "./themeTypes";

// Action Types
interface ToggleThemeAction {
  type: typeof TOGGLE_THEME;
}

interface SetThemeAction {
  type: typeof SET_THEME;
  payload: boolean;
}

interface LoadThemeAction {
  type: typeof LOAD_THEME;
}

// Action Creators
export const toggleTheme = (): ToggleThemeAction => ({
  type: TOGGLE_THEME,
});

export const setTheme = (isDark: boolean): SetThemeAction => ({
  type: SET_THEME,
  payload: isDark,
});

export const loadTheme = (): LoadThemeAction => ({
  type: LOAD_THEME,
});

// Union Type for Theme Actions
export type ThemeActionTypes = ToggleThemeAction | SetThemeAction | LoadThemeAction;
