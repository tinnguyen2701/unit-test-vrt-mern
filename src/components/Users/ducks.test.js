import { call } from 'redux-saga/effects';
import assert from 'assert';
import { createAction, callApi } from 'dorothy/utils';

import {
  usersData,
  USERS_DATA_RESPONSE,
  USER_ADD_RESPONSE,
  USER_EDIT_RESPONSE,
  USER_REMOVE_RESPONSE,
  CHECK_BOX_CHANGE,
  usersDataRequest,
  addUserRequest,
  removeUserRequest,
  editUserRequest,
} from './ducks';

const testUserData = {
  email: 'Huy123@gmail.com',
  password: '123456',
  name: 'Huy123',
  role: 'Admin',
};

const testAllUserData = [
  { email: 'Huy123@gmail.com', password: 'Huy123', name: 'Huy123', role: 'Admin' },
  { email: 'Huy456@gmail.com', password: 'Huy456', name: 'Huy456', role: 'Admin' },
];

describe('saga test', () => {
  it('should return correct user', () => {
    assert.deepEqual(
      usersDataRequest({ type: 'USERS_DATA_REQUEST' }).next().value,
      call(callApi, 'GET', `${process.env.REACT_APP_BASE_URL}api/users`),
    );
  });

  it('should return correct add users', () => {
    assert.deepEqual(
      addUserRequest({ type: 'USER_ADD_REQUEST', payload: testUserData }).next().value,
      call(callApi, 'POST', `${process.env.REACT_APP_BASE_URL}api/users`, { user: testUserData }),
    );
  });

  it('should return correct edit users', () => {
    assert.deepEqual(
      editUserRequest({ type: 'USER_EDIT_RESPONSE', payload: testUserData }).next().value,
      call(callApi, 'PATCH', `${process.env.REACT_APP_BASE_URL}api/users/${testUserData.email}`, {
        user: testUserData,
      }),
    );
  });

  it('should return correct shops', () => {
    assert.deepEqual(
      removeUserRequest({ type: 'USER_REMOVE_RESPONSE', payload: 'huy@gmail.com' }).next().value,
      call(callApi, 'DELETE', `${process.env.REACT_APP_BASE_URL}api/users/huy@gmail.com`),
    );
  });
});

describe('reducer test', () => {
  it('should return the initial state', () => {
    expect(usersData(undefined, {})).toEqual({
      users: [],
      selectedItems: [],
    });
  });

  it('should return correct data for USERS_DATA_RESPONSE', () => {
    expect(usersData({ users: null }, createAction(USERS_DATA_RESPONSE, [1, 2]))).toEqual({
      users: [
        {
          email: process.env.REACT_APP_ADMIN_EMAIL,
          name: process.env.REACT_APP_ADMIN_NAME,
          role: 'MASTER',
        },
        1,
        2,
      ],
    });
  });

  it('should return correct data for USER_ADD_RESPONSE', () => {
    expect(usersData({ users: [] }, createAction(USER_ADD_RESPONSE, testUserData))).toEqual({
      users: [testUserData],
    });
  });

  it('should return correct data for USER_EDIT_RESPONSE', () => {
    expect(
      usersData({ users: testAllUserData }, createAction(USER_EDIT_RESPONSE, testUserData)),
    ).toEqual({
      users: testAllUserData.map(user => (user.email === testUserData.email ? testUserData : user)),
    });
  });

  it('should return correct data for USER_REMOVE_RESPONSE', () => {
    expect(
      usersData(
        { users: testAllUserData, selectedItems: [] },
        createAction(USER_REMOVE_RESPONSE, testUserData.email),
      ),
    ).toEqual({
      users: testAllUserData.filter(user => user.email !== testUserData.email),
      selectedItems: [],
    });
  });

  it('should return correct data for CHECK_BOX_CHANGE', () => {
    expect(usersData({ selectedItems: [] }, createAction(CHECK_BOX_CHANGE, ['0', '1']))).toEqual({
      selectedItems: ['0', '1'],
    });
  });
});
