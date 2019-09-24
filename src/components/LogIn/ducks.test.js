import { call } from 'redux-saga/effects';
import assert from 'assert';
import { callApi, createAction } from 'dorothy/utils';
import { LOGIN_REQUEST, LOGIN_RESPONSE, requestLogin, loginReducer } from './ducks';

describe('saga test', () => {
  it('should return correct shops', () => {
    assert.deepEqual(
      requestLogin({
        type: LOGIN_REQUEST,
        payload: { email: 'nguyendinhtin27011998@gmail.com', password: 'admin' },
      }).next().value,
      call(callApi, 'POST', `${process.env.REACT_APP_BASE_URL}auth/login`, {
        email: 'nguyendinhtin27011998@gmail.com',
        password: 'admin',
      }),
    );
  });
});

describe('reducer test', () => {
  it('should return the initial state', () => {
    expect(loginReducer(undefined, {})).toEqual({
      user: null,
      isLoading: false,
      isCheckCode: true,
    });
  });

  it('should return correct data for LOGIN_RESPONSE', () => {
    expect(
      loginReducer(
        { user: null, isLoading: false, isCheckCode: true },
        createAction(LOGIN_RESPONSE, 'nguyendinhtin27011998@gmail.com'),
      ),
    ).toEqual({
      user: { email: 'nguyendinhtin27011998@gmail.com' },
      isLoading: false,
    });
  });
});
