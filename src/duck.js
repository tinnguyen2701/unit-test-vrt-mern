import { takeLatest, fork, put, call } from 'redux-saga/effects';
import { createReducer, createAction, callApi } from './dorothy/utils';

export const FETCH_DATA_REQUEST = 'FETCH_DATA_REQUEST';
export const FETCH_DATA_RESPONSE = 'FETCH_DATA_RESPONSE';
export const FETCH_DATA_ERROR = 'FETCH_DATA_ERROR';

function* requestData() {
  try {
    const response = yield call(callApi, 'GET', `${process.env.REACT_APP_BASE_URL}api/ss/data`);

    yield put(createAction(FETCH_DATA_RESPONSE, response));
  } catch (err) {
    yield put(createAction(FETCH_DATA_ERROR, err));
  }
}

function* watchDataRequest() {
  yield takeLatest(FETCH_DATA_REQUEST, requestData);
}

const initData = [];
const dataActionHandlers = {
  [FETCH_DATA_RESPONSE]: (state, action) => {
    return action.payload.data;
  },
};

export const dataReducer = createReducer(initData, dataActionHandlers);
export const dataSagas = [fork(watchDataRequest)];
