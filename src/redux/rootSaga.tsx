import { all, AllEffect } from "redux-saga/effects";
import authSaga from "./auth/authSaga";
import themeSaga from "../theme/themeSaga";

/* --------------------------- Root Saga ------------------------------ */
export default function* rootSaga(): Generator<AllEffect<unknown>, void, unknown> {
  yield all([
    authSaga(),
    themeSaga(),
  ]);
}
