import { call } from 'redux-saga/effects';
import assert from 'assert';
import { createAction, callApi } from 'dorothy/utils';
import {
  appViewData,
  SHOPS_DATA_RESPONSE,
  CHECKBOX_CHANGE,
  SEARCH_VALUE_CHANGE,
  CATEGORY_CHANGE,
  shopsDataRequest,
  SHOPS_DATA_REQUEST,
} from './ducks';

const testData = [
  { name: 'shop1', status: 'Paid' },
  { name: 'shop2', status: 'Trial' },
  { status: 'Expired' },
];

describe('saga test', () => {
  it('should return correct shops', () => {
    assert.deepEqual(
      shopsDataRequest({ type: SHOPS_DATA_REQUEST, payload: 'negotiation' }).next().value,
      call(callApi, 'GET', `${process.env.REACT_APP_BASE_URL}api/apps/negotiation`),
    );
  });

  it('should return correct shops', () => {
    assert.deepEqual(
      shopsDataRequest({ type: SHOPS_DATA_REQUEST, payload: 'ezicompare' }).next().value,
      call(callApi, 'GET', `${process.env.REACT_APP_BASE_URL}api/apps/ezicompare`),
    );
  });
});

describe('reducer test', () => {
  it('should return the initial state', () => {
    expect(appViewData(undefined, {})).toEqual({
      currentShopData: [],
      allShopData: [],
      selectedItems: [],
      searchValue: null,
      selectedCategory: 'All',
    });
  });

  it('should return correct data for SHOPS_DATA_RESPONSE', () => {
    expect(
      appViewData(
        { currentShopData: [], allShopData: [] },
        createAction(SHOPS_DATA_RESPONSE, [1, 2]),
      ),
    ).toEqual({
      currentShopData: [1, 2],
      allShopData: [1, 2],
    });
  });

  it('should return correct data for CHECKBOX_CHANGE', () => {
    expect(appViewData({ selectedItems: [] }, createAction(CHECKBOX_CHANGE, ['0', '1']))).toEqual({
      selectedItems: ['0', '1'],
    });
  });

  it('should return correct data for SEARCH_VALUE_CHANGE', () => {
    expect(
      appViewData(
        {
          searchValue: '',
          currentShopData: [],
          allShopData: testData,
          selectedCategory: 'Expired',
        },
        createAction(SEARCH_VALUE_CHANGE, 'eye'),
      ),
    ).toEqual({
      searchValue: 'eye',
      currentShopData: testData
        .filter(shop => shop.status === 'Expired')
        .filter(shop => (shop.name ? shop.name.toLowerCase().indexOf('eye') !== -1 : false)),
      allShopData: testData,
      selectedCategory: 'Expired',
    });
  });

  it('should return correct data for CATEGORY_CHANGE', () => {
    expect(
      appViewData(
        { selectedCategory: 'All', currentShopData: [], allShopData: testData },
        createAction(CATEGORY_CHANGE, 'Trial'),
      ),
    ).toEqual({
      selectedCategory: 'Trial',
      currentShopData: testData.filter(shop => shop.status === 'Trial'),
      allShopData: testData,
    });
  });
});
