import { put, takeLatest, CallEffect } from "redux-saga/effects";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SET_THEME, TOGGLE_THEME, LOAD_THEME, THEME_LOADED } from "./themeTypes";

// ---------------------- Load Theme Saga ----------------------
function* loadThemeSaga(): Generator<any, void, any> {
  try {
    const savedTheme: string | null = yield AsyncStorage.getItem("APP_THEME");
    const isDark = savedTheme === "dark";
    yield put({ type: THEME_LOADED, payload: isDark });
  } catch (e) {
    yield put({ type: THEME_LOADED, payload: false });
  }
}

// ---------------------- Toggle Theme Saga ----------------------
function* toggleThemeSaga(): Generator<any, void, any> {
  try {
    const savedTheme: string | null = yield AsyncStorage.getItem("APP_THEME");
    const newTheme = savedTheme === "dark" ? "light" : "dark";

    yield AsyncStorage.setItem("APP_THEME", newTheme);
    yield put({ type: SET_THEME, payload: newTheme === "dark" });
  } catch (e) {
    console.log("Error toggling theme:", e);
  }
}

// ---------------------- Watcher Saga ----------------------
export default function* themeWatcher(): Generator {
  yield takeLatest(LOAD_THEME, loadThemeSaga);
  yield takeLatest(TOGGLE_THEME, toggleThemeSaga);
}
