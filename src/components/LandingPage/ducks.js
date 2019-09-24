import { takeLatest, fork, put, call } from 'redux-saga/effects';
import { createReducer, createAction, callApi } from 'dorothy/utils';

export const FETCH_DATA_APP_REQUEST = 'FETCH_DATA_APP_REQUEST';
export const FETCH_DATA_APP_RESPONSE = 'FETCH_DATA_APP_RESPONSE';

export function* requestData() {
  try {
    const response = yield call(callApi, 'GET', `${process.env.REACT_APP_BASE_URL}api/apps`);

    yield put(createAction(FETCH_DATA_APP_RESPONSE, response.data.statistics));
  } catch (err) {
    yield put(createAction(FETCH_DATA_APP_RESPONSE, err));
  }
}

function* watchDataRequest() {
  yield takeLatest(FETCH_DATA_APP_REQUEST, requestData);
}

const initData = { data: null };
const dataActionHandlers = {
  [FETCH_DATA_APP_RESPONSE]: (state, action) => ({
    ...state,
    data: [
      {
        paid: 'Paid',
        trial: 'Trial',
        expired: 'Expired',
        uninstalled: 'Uninstalled',
      },
      ...action.payload,
    ],
  }),
};

export const landinPageDataReducer = createReducer(initData, dataActionHandlers);
export const landingPageDataSagas = [fork(watchDataRequest)];
