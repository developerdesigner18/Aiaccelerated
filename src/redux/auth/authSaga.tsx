import { put, takeLatest } from "redux-saga/effects";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT,
} from "./authTypes";

/* --------------------------- Types ------------------------------ */

interface User {
  name: string;
  email: string;
  password: string;
}

interface RegisterAction {
  type: typeof REGISTER_REQUEST;
  payload: User;
}

interface LoginAction {
  type: typeof LOGIN_REQUEST;
  payload: {
    email: string;
    password: string;
  };
}

type AuthAction = RegisterAction | LoginAction | { type: typeof LOGOUT };

/* --------------------------- REGISTER USER ------------------------------ */
function* registerUser(action: RegisterAction) {
  try {
    const newUser = action.payload;


    const usersData: string | null = yield AsyncStorage.getItem("users");
    let users: User[] = usersData ? JSON.parse(usersData) : [];


    users.push(newUser);
    yield AsyncStorage.setItem("users", JSON.stringify(users));

    yield put({ type: REGISTER_SUCCESS, payload: newUser });
  } catch (error) {
    console.log("REGISTER ERROR:", error);
  }
}

/* ----------------------------- LOGIN USER ------------------------------ */
function* loginUser(action: LoginAction) {
  try {
    const { email, password } = action.payload;


    const usersData: string | null = yield AsyncStorage.getItem("users");
    const users: User[] = usersData ? JSON.parse(usersData) : [];


    const foundUser = users.find(
      (u) => u.email === email && u.password === password
    );

    if (!foundUser) {
      yield put({ type: LOGIN_FAILURE, payload: "Invalid credentials" });
      return;
    }


    yield AsyncStorage.setItem("user", JSON.stringify(foundUser));

    yield put({ type: LOGIN_SUCCESS, payload: foundUser });
  } catch (error) {
    yield put({ type: LOGIN_FAILURE, payload: "Something went wrong" });
  }
}

/* ------------------------------ LOGOUT ---------------------------------- */
function* logoutUser() {
  try {
    yield AsyncStorage.removeItem("user");
  } catch (error) {
    console.log("LOGOUT ERROR:", error);
  }
}

/* --------------------------- SAGAS ------------------------------ */
export default function* authSaga() {
  yield takeLatest(REGISTER_REQUEST, registerUser);
  yield takeLatest(LOGIN_REQUEST, loginUser);
  yield takeLatest(LOGOUT, logoutUser);
}
