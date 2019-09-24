import { takeLatest, fork, put, call } from 'redux-saga/effects';
import { createReducer, createAction, callApi } from 'dorothy/utils';

export const MAIL_DATA_RESPONE = 'MAIL_DATA_RESPONE';
export const MAIL_DATA_REQUEST = 'MAIL_DATA_REQUEST';
export const MAIL_UPDATE_REQUEST = 'MAIL_UPDATE_REQUEST';
export const MAIL_UPDATE_RESPONE = 'MAIL_UPDATE_RESPONE';
export const UPDATE_MAIL_ELEMENT = 'UPDATE_MAIL_ELEMENT';
export const MAIL_DELETE_REQUEST = 'MAIL_DELETE_REQUEST';
export const MAIL_DELETE_RESPONE = 'MAIL_DELETE_RESPONE';
export const MAILS_ERROR = 'MAILS_ERROR';
export const MAIL_ADD_REQUEST = 'MAIL_ADD_REQUEST';
export const MAIL_ADD_RESPONE = 'MAIL_ADD_RESPONE';
export const STATUS_CHANGE = 'STATUS_CHANGE';
export const SELECTED_SUBJECT_CHANGE = 'SELECTED_SUBJECT_CHANGE';
export const MAIL_CHANGE = 'MAIL_CHANGE';
export const MAIL_STATUS_UPDATE = 'MAIL_STATUS_UPDATE';
export const NEW_MAIL = '[New Mail]';
export const INPROGRESS = 'In progress ...';

export function* requestData() {
  try {
    const response = yield call(callApi, 'GET', `${process.env.REACT_APP_BASE_URL}api/mails`);

    yield put(createAction(MAIL_DATA_RESPONE, response.data.mails));
  } catch (err) {
    yield put(createAction(MAILS_ERROR, err));
  }
}

export function* addNewMail(action) {
  try {
    const mail = action.payload;

    const response = yield call(
      callApi,
      'POST',
      `${process.env.REACT_APP_BASE_URL}api/mails`,
      mail,
    );

    yield put(createAction(MAIL_ADD_RESPONE, response.data.mails));
    yield put(createAction(STATUS_CHANGE, 'Added'));
  } catch (err) {
    yield put(createAction(STATUS_CHANGE, 'Try Again'));
    yield put(createAction(MAILS_ERROR, err));
  }
}

export function* deteleMail(action) {
  try {
    const response = yield call(
      callApi,
      'DELETE',
      `${process.env.REACT_APP_BASE_URL}api/mails/${action.payload}`,
    );

    if (response.status === 204) {
      yield put(createAction(MAIL_DELETE_RESPONE));
      yield put(createAction(UPDATE_MAIL_ELEMENT));
    }
  } catch (err) {
    yield put(createAction(STATUS_CHANGE, 'Try Again'));
    yield put(createAction(MAILS_ERROR, err));
  }
}

export function* updateMail(action) {
  try {
    const response = yield call(
      callApi,
      'PATCH',
      `${process.env.REACT_APP_BASE_URL}api/mails/${action.payload[1]}`,
      action.payload[0],
    );

    if (response.status === 204) {
      yield put(createAction(MAIL_UPDATE_RESPONE, action.payload));
      yield put(createAction(STATUS_CHANGE, 'Updated'));
    }
  } catch (err) {
    yield put(createAction(STATUS_CHANGE, 'Try Again'));
    yield put(createAction(MAILS_ERROR, err));
  }
}

function* watchDataRequest() {
  yield takeLatest(MAIL_DATA_REQUEST, requestData);
}

function* watchAddMailRequest() {
  yield takeLatest(MAIL_ADD_REQUEST, addNewMail);
}

function* watchDeleteMailRequest() {
  yield takeLatest(MAIL_DELETE_REQUEST, deteleMail);
}

function* watchUpdateMailRequest() {
  yield takeLatest(MAIL_UPDATE_REQUEST, updateMail);
}

const initData = {
  selectedSubject: '',
  mails: [{ subject: NEW_MAIL, body: '' }],
  currentMail: { subject: '', body: '' },
  status: { errorMessage: '', currentStatus: '', isNewMailActive: false },
};
const dataActionHandlers = {
  [MAIL_DATA_RESPONE]: (state, action) => ({
    ...state,
    mails: state.mails.concat(action.payload),
    currentMail:
      JSON.stringify(action.payload) === '[]'
        ? { subject: '', body: state.mails[0].body }
        : {
            subject: action.payload[0].subject,
            body: action.payload[0].body,
          },
    selectedSubject: JSON.stringify(action.payload) !== '[]' ? action.payload[0].subject : NEW_MAIL,
    status: { isNewMailActive: JSON.stringify(action.payload) === '[]' },
  }),
  [UPDATE_MAIL_ELEMENT]: state => ({
    ...state,
    status: { currentStatus: 'Deleted', isNewMailActive: state.mails.length === 1 },
    currentMail:
      state.mails.length === 1
        ? {
            subject: '',
            body: '',
          }
        : {
            subject: state.mails[1].subject,
            body: state.mails[1].body,
          },
    selectedSubject: state.mails.length === 1 ? NEW_MAIL : state.mails[1].subject,
  }),
  [MAIL_CHANGE]: (state, action) => ({ ...state, currentMail: action.payload }),
  [MAIL_ADD_RESPONE]: (state, action) => ({
    ...state,
    mails: state.mails.concat(action.payload),
    currentMail: {
      body: action.payload[0].body,
      subject: action.payload[0].subject,
    },
    selectedSubject: action.payload[0].subject,
  }),
  [MAIL_DELETE_RESPONE]: state => ({
    ...state,
    mails: state.mails.filter(item => {
      return item.subject !== state.selectedSubject;
    }),
  }),
  [MAIL_UPDATE_RESPONE]: (state, action) => {
    const { mails } = state;

    mails.forEach((item, index) => {
      if (item.subject === action.payload[1]) {
        mails[index].subject = action.payload[0].subject;
        mails[index].body = action.payload[0].body;
      }
    });
    return { ...state, selectedSubject: action.payload[0].subject };
  },
  [STATUS_CHANGE]: (state, action) => ({
    ...state,
    status: { currentStatus: action.payload, isNewMailActive: false },
  }),
  [MAIL_STATUS_UPDATE]: (state, action) => ({ ...state, status: action.payload }),
  [SELECTED_SUBJECT_CHANGE]: (state, action) => ({ ...state, selectedSubject: action.payload }),
};

export const sendMailReducer = createReducer(initData, dataActionHandlers);
export const sendMailSagas = [
  fork(watchDataRequest),
  fork(watchAddMailRequest),
  fork(watchDeleteMailRequest),
  fork(watchUpdateMailRequest),
];
