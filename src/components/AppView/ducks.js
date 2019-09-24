import { takeLatest, put, fork, call } from 'redux-saga/effects';
import { createReducer, createAction, callApi } from 'dorothy/utils';

export const SHOPS_DATA_RESPONSE = 'SHOPS_DATA_RESPONSE';
export const SHOPS_DATA_REQUEST = 'SHOPS_DATA_REQUEST';
export const SHOPS_DATA_ERROR = 'SHOPS_DATA_ERROR';

export const SEARCH_VALUE_CHANGE = 'SEARCH_VALUE_CHANGE';

export const CHECKBOX_CHANGE = 'CHECKBOX_CHANGE';
export const CATEGORY_CHANGE = 'CATEGORY_CHANGE';

const initalData = {
  currentShopData: [],
  allShopData: [],
  selectedItems: [],
  searchValue: null,
  selectedCategory: 'All',
};

const ActionHandlers = {
  [SHOPS_DATA_RESPONSE]: (state, action) => ({
    ...state,
    currentShopData: action.payload,
    allShopData: action.payload,
  }),
  [CHECKBOX_CHANGE]: (state, action) => ({ ...state, selectedItems: action.payload }),
  [SEARCH_VALUE_CHANGE]: (state, action) => {
    const shopsByCategory =
      state.selectedCategory === 'All'
        ? state.allShopData
        : state.allShopData.filter(shop => shop.status === state.selectedCategory);
    return {
      ...state,
      searchValue: action.payload,
      currentShopData:
        action.payload === ''
          ? shopsByCategory
          : shopsByCategory.filter(
              shop => shop.name && shop.name.toLowerCase().indexOf(action.payload) !== -1,
            ),
    };
  },
  [CATEGORY_CHANGE]: (state, action) => ({
    ...state,
    selectedCategory: action.payload,
    currentShopData:
      action.payload === 'All'
        ? state.allShopData
        : state.allShopData.filter(item => item.status === action.payload),
  }),
};

export function* shopsDataRequest(action) {
  const param = action.payload;
  try {
    const res = yield call(callApi, 'GET', `${process.env.REACT_APP_BASE_URL}api/apps/${param}`);
    yield put(createAction(SHOPS_DATA_RESPONSE, res.data.shops));
  } catch (err) {
    yield put(createAction(SHOPS_DATA_ERROR, err));
  }
}

export function* watchShopsDataRequest() {
  yield takeLatest(SHOPS_DATA_REQUEST, shopsDataRequest);
}

export const appViewData = createReducer(initalData, ActionHandlers);
export const appViewSagas = [fork(watchShopsDataRequest)];
