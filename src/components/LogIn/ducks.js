import { takeLatest, fork, put, call } from 'redux-saga/effects';
import { createAction, callApi, createReducer } from 'dorothy/utils';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_RESPONSE = 'LOGIN_RESPONSE';
export const LOGIN_ERROR = 'LOGIN_ERROR';

export const VERIFY_CODE_REQUEST = 'VERIFY_CODE_REQUEST';
export const VERIFY_CODE_RESPONSE = 'VERIFY_CODE_RESPONSE';
export const VERIFY_CODE_ERROR = 'VERIFY_CODE_ERROR';

/* handler state 1-step */
export function* requestLogin(action) {
  try {
    const response = yield call(
      callApi,
      'POST',
      `${process.env.REACT_APP_BASE_URL}auth/login`,
      action.payload,
    );
    if (response.data) {
      yield put(createAction(LOGIN_RESPONSE, response.data));
    }
  } catch (err) {
    yield put(createAction(LOGIN_ERROR, err));
  }
}

function* watchLoginRequest() {
  yield takeLatest(LOGIN_REQUEST, requestLogin);
}
const initState = { user: null, isLoading: false, isCheckCode: true };

const loginActionHandlers = {
  [LOGIN_REQUEST]: state => ({
    ...state,
    user: null,
    isLoading: true,
  }),
  [LOGIN_RESPONSE]: (state, action) => ({
    user: { ...state.user, email: action.payload },
    isLoading: false,
  }),
  [LOGIN_ERROR]: state => ({
    ...state,
    user: false,
    isLoading: false,
  }),
  [VERIFY_CODE_REQUEST]: state => ({
    ...state,
    isLoading: true,
    isCheckCode: true,
  }),
  [VERIFY_CODE_ERROR]: state => ({
    ...state,
    isLoading: false,
    isCheckCode: false,
  }),
};

export const loginReducer = createReducer(initState, loginActionHandlers);
export const loginSagas = [fork(watchLoginRequest)];

/* handler state for vefification */
function* requestVerified(action) {
  try {
    const response = yield call(
      callApi,
      'POST',
      `${process.env.REACT_APP_BASE_URL}auth/verifiedCode`,
      action.payload,
    );
    if (response.data) {
      window.localStorage.setItem('jwtToken', response.data);
      window.location.href = `${process.env.REACT_APP_BASE_URL}landingpage`;
    }
  } catch (error) {
    yield put(createAction(VERIFY_CODE_ERROR, error));
  }
}
function* watchVerifiedRequest() {
  yield takeLatest(VERIFY_CODE_REQUEST, requestVerified);
}
export const verifiedSagas = [fork(watchVerifiedRequest)];
