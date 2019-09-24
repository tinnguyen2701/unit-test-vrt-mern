import { call } from 'redux-saga/effects';
import assert from 'assert';
import { createAction, callApi } from 'dorothy/utils/index';

import { requestData, landinPageDataReducer, FETCH_DATA_APP_RESPONSE } from './ducks';

describe('test', () => {
  describe('request data proxy', () => {
    it('should return correct data', () => {
      assert.deepEqual(
        requestData().next().value,
        call(callApi, 'GET', `${process.env.REACT_APP_BASE_URL}api/apps`),
      );
    });
  });
});

describe('landing page data reducer test', () => {
  it('should return the initial state', () => {
    expect(landinPageDataReducer(undefined, {})).toEqual({
      data: null,
    });
  });

  it('should return correct data for FETCH DATA APP RESPONSE', () => {
    expect(
      landinPageDataReducer({ data: null }, createAction(FETCH_DATA_APP_RESPONSE, [5, 2])),
    ).toEqual({
      data: [
        {
          paid: 'Paid',
          trial: 'Trial',
          expired: 'Expired',
          uninstalled: 'Uninstalled',
        },
        5,
        2,
      ],
    });
  });
});
