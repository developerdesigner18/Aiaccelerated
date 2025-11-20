import { createStore, applyMiddleware, Store } from "redux";
import createSagaMiddleware, { SagaMiddleware } from "redux-saga";
import rootReducer, { RootState } from "./rootReducer";
import rootSaga from "./rootSaga";

/* --------------------------- Create Saga Middleware ------------------------------ */
const sagaMiddleware: SagaMiddleware = createSagaMiddleware();

/* --------------------------- Create Store ------------------------------ */
const store: Store<RootState> = createStore(
  rootReducer,
  applyMiddleware(sagaMiddleware)
);

/* --------------------------- Run Root Saga ------------------------------ */
sagaMiddleware.run(rootSaga);

export default store;
