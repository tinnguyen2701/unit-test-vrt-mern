import { call } from 'redux-saga/effects';
import assert from 'assert';
import { createAction, callApi } from 'dorothy/utils';

import {
  shopViewDataRequest,
  shopView,
  LOAD_DATA_SHOPVIEW_RESPONSE,
  LOAD_DATA_SHOPVIEW,
} from './ducks';

describe('test', () => {
  describe('test shopviewDataRequest', () => {
    it('should return correct info shop', () => {
      assert.deepEqual(
        shopViewDataRequest({
          type: 'LOAD_DATA_SHOPVIEW',
          payload: 'ezicompare,danbilr.myshopify.com',
        }).next().value,
        call(
          callApi,
          'GET',
          `${process.env.REACT_APP_BASE_URL}api/apps/ezicompare/shops/danbilr.myshopify.com`,
        ),
      );
    });
  });
});

describe('landing page data reducer tests', () => {
  it('should return the initial state', () => {
    expect(shopView(undefined, {})).toEqual({
      shopViewData: null,
    });
  });

  it('should return correct data for FETCH DATA APP RESPONSE', () => {
    expect(
      shopView({ shopViewData: null }, createAction(LOAD_DATA_SHOPVIEW_RESPONSE, [5, 2])),
    ).toEqual({ shopViewData: [5, 2] });
  });

  it('should return correct data for FETCH DATA APP RESPONSE', () => {
    expect(shopView({ shopViewParams: null }, createAction(LOAD_DATA_SHOPVIEW, [6, 2]))).toEqual({
      shopViewParams: [6, 2],
    });
  });
});
