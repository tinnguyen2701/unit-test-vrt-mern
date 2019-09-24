import { takeLatest, put, fork, call } from 'redux-saga/effects';
import { createReducer, createAction, callApi } from 'dorothy/utils';

export const USERS_DATA_REQUEST = 'USERS_DATA_REQUEST';
export const USERS_DATA_RESPONSE = 'USERS_DATA_RESPONSE';

export const USER_ADD_REQUEST = 'USER_ADD_REQUEST';
export const USER_ADD_RESPONSE = 'USER_ADD_RESPONSE';

export const USER_REMOVE_REQUEST = 'USER_REMOVE_REQUEST';
export const USER_REMOVE_RESPONSE = 'USER_REMOVE_RESPONSE';

export const USER_EDIT_REQUEST = 'USER_EDIT_REQUEST';
export const USER_EDIT_RESPONSE = 'USER_EDIT_RESPONSE';

export const USER_ERROR = 'USER_ERROR';
export const CHECK_BOX_CHANGE = 'CHECK_BOX_CHANGE';

export const ADMIN = 'ADMIN';
export const MARKETER = 'MARKETER';
export const MASTER = 'MASTER';

const initalData = {
  users: [],
  selectedItems: [],
};

const ActionHandlers = {
  [USERS_DATA_RESPONSE]: (state, action) => ({
    ...state,
    users: [
      {
        email: process.env.REACT_APP_ADMIN_EMAIL,
        name: process.env.REACT_APP_ADMIN_NAME,
        role: MASTER,
      },
      ...action.payload,
    ],
  }),
  [USER_ADD_RESPONSE]: (state, action) => ({
    ...state,
    users: [...state.users, action.payload],
  }),
  [USER_EDIT_RESPONSE]: (state, action) => ({
    ...state,
    users: state.users.map(user => (user.email === action.payload.email ? action.payload : user)),
  }),
  [USER_REMOVE_RESPONSE]: (state, action) => ({
    ...state,
    users: state.users.filter(user => !action.payload.split(',').includes(user.email)),
    selectedItems: [],
  }),
  [CHECK_BOX_CHANGE]: (state, action) => ({ ...state, selectedItems: action.payload }),
};

export function* usersDataRequest() {
  try {
    const response = yield call(callApi, 'GET', `${process.env.REACT_APP_BASE_URL}api/users`);

    yield put(createAction(USERS_DATA_RESPONSE, response.data.users));
  } catch (err) {
    yield put(createAction(USER_ERROR, err));
  }
}

export function* watchUsersDataRequest() {
  yield takeLatest(USERS_DATA_REQUEST, usersDataRequest);
}

export function* addUserRequest(action) {
  try {
    const user = action.payload;
    const response = yield call(callApi, 'POST', `${process.env.REACT_APP_BASE_URL}api/users`, {
      user,
    });
    yield put(createAction(USER_ADD_RESPONSE, response.data.user));
  } catch (err) {
    yield put(createAction(USER_ERROR, err));
  }
}

export function* watchAddUserRequest() {
  yield takeLatest(USER_ADD_REQUEST, addUserRequest);
}

export function* removeUserRequest(action) {
  try {
    const emails = action.payload;
    const response = yield call(
      callApi,
      'DELETE',
      `${process.env.REACT_APP_BASE_URL}api/users/${emails}`,
    );

    if (response.status === 204) yield put(createAction(USER_REMOVE_RESPONSE, emails));
  } catch (err) {
    yield put(createAction(USER_ERROR, err));
  }
}
export function* watchRemoveUserRequest() {
  yield takeLatest(USER_REMOVE_REQUEST, removeUserRequest);
}

export function* editUserRequest(action) {
  try {
    const user = action.payload;
    const response = yield call(
      callApi,
      'PATCH',
      `${process.env.REACT_APP_BASE_URL}api/users/${user.email}`,
      { user },
    );
    if (response.status === 204) yield put(createAction(USER_EDIT_RESPONSE, user));
  } catch (err) {
    yield put(createAction(USER_ERROR, err));
  }
}

export function* watchEditUserRequest() {
  yield takeLatest(USER_EDIT_REQUEST, editUserRequest);
}
export const usersData = createReducer(initalData, ActionHandlers);
export const usersSagas = [
  fork(watchUsersDataRequest),
  fork(watchAddUserRequest),
  fork(watchRemoveUserRequest),
  fork(watchEditUserRequest),
];
