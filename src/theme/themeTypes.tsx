// Action type constants
export const SET_THEME = "SET_THEME" as const;
export const TOGGLE_THEME = "TOGGLE_THEME" as const;
export const LOAD_THEME = "LOAD_THEME" as const;
export const THEME_LOADED = "THEME_LOADED" as const;

// Action type interfaces
export interface SetThemeAction {
  type: typeof SET_THEME;
  payload: boolean;
}

export interface ToggleThemeAction {
  type: typeof TOGGLE_THEME;
}

export interface LoadThemeAction {
  type: typeof LOAD_THEME;
}

export interface ThemeLoadedAction {
  type: typeof THEME_LOADED;
  payload: boolean; 
}

// Union type for all theme actions
export type ThemeActionTypes =
  | SetThemeAction
  | ToggleThemeAction
  | LoadThemeAction
  | ThemeLoadedAction;
