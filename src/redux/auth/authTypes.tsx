/* --------------------------- Auth Action Types ------------------------------ */
export const REGISTER_REQUEST = "REGISTER_REQUEST" as const;
export const REGISTER_SUCCESS = "REGISTER_SUCCESS" as const;
export const REGISTER_FAILURE = "REGISTER_FAILURE" as const;

export const LOGIN_REQUEST = "LOGIN_REQUEST" as const;
export const LOGIN_SUCCESS = "LOGIN_SUCCESS" as const;
export const LOGIN_FAILURE = "LOGIN_FAILURE" as const;

export const LOGOUT = "LOGOUT" as const;

/* --------------------------- Type Aliases ------------------------------ */
export type AuthActionType =
  | typeof REGISTER_REQUEST
  | typeof REGISTER_SUCCESS
  | typeof REGISTER_FAILURE
  | typeof LOGIN_REQUEST
  | typeof LOGIN_SUCCESS
  | typeof LOGIN_FAILURE
  | typeof LOGOUT;
