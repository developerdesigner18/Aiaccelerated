import { 
  REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAILURE,
  LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAILURE,
  LOGOUT
} from "./authTypes";

export interface AuthState {
  user: any | null;
  isLoggedIn: boolean;
  error: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoggedIn: false,
  error: null,
  loading: false,
};

export default function authReducer(
  state = initialState,
  action: any
): AuthState {
  switch (action.type) {
    case REGISTER_REQUEST:
    case LOGIN_REQUEST:
      return { ...state, loading: true, error: null };

    case REGISTER_SUCCESS:
      return { ...state, loading: false, error: null };

    case REGISTER_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case LOGIN_SUCCESS:
      return { ...state, user: action.payload, isLoggedIn: true, loading: false, error: null };

    case LOGIN_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case LOGOUT:
      return { ...state, user: null, isLoggedIn: false, loading: false, error: null };

    default:
      return state;
  }
}
