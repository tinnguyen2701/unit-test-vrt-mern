import { takeLatest, fork, put, call } from 'redux-saga/effects';
import { createReducer, createAction } from 'dorothy/utils';
import callApi from '../../dorothy/utils/callApi';

export const LOAD_DATA_SHOPVIEW_RESPONSE = 'LOAD_DATA_SHOPVIEW_RESPONSE';
export const LOAD_DATA_SHOPVIEW = 'LOAD_DATA_SHOPVIEW';

export function* shopViewDataRequest(action) {
  try {
    const params = action.payload.split(',');

    const response = yield call(
      callApi,
      'GET',
      `${process.env.REACT_APP_BASE_URL}api/apps/${params[0]}/shops/${params[1]}`,
    );

    yield put(createAction(LOAD_DATA_SHOPVIEW_RESPONSE, response.data.shopinfo));
  } catch (err) {
    yield put(createAction(LOAD_DATA_SHOPVIEW_RESPONSE, err));
  }
}

function* watchShopViewDataRequest() {
  yield takeLatest(LOAD_DATA_SHOPVIEW, shopViewDataRequest);
}

const initData = { shopViewData: null };
const dataActionHandlers = {
  [LOAD_DATA_SHOPVIEW_RESPONSE]: (state, action) => ({
    ...state,
    shopViewData: action.payload,
  }),
  [LOAD_DATA_SHOPVIEW]: (state, action) => ({
    ...state,
    shopViewParams: action.payload,
  }),
};

export const shopView = createReducer(initData, dataActionHandlers);
export const shopViewSagas = [fork(watchShopViewDataRequest)];
