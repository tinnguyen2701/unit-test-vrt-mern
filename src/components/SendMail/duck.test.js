import { call } from 'redux-saga/effects';
import assert from 'assert';
import { createAction, callApi } from 'dorothy/utils';

import {
  MAIL_DATA_REQUEST,
  MAIL_ADD_REQUEST,
  requestData,
  addNewMail,
  deteleMail,
  updateMail,
  sendMailReducer,
  MAIL_UPDATE_REQUEST,
  MAIL_DELETE_REQUEST,
  MAIL_UPDATE_RESPONE,
  MAIL_DELETE_RESPONE,
  MAIL_ADD_RESPONE,
  MAIL_DATA_RESPONE,
} from './ducks';

const testMails = [
  { subject: 'Hello 2017', body: 'HAPPY NEW YEAR 2018' },
  { subject: 'Welcome to VietNam', body: 'Welcome to Hue' },
];

describe('test', () => {
  describe('send mail saga tests', () => {
    it('should return correct data', () => {
      assert.deepEqual(
        requestData({
          type: MAIL_DATA_REQUEST,
        }).next().value,
        call(callApi, 'GET', `${process.env.REACT_APP_BASE_URL}api/mails`),
      );
    });
    it('should return correct data', () => {
      assert.deepEqual(
        addNewMail({
          type: MAIL_ADD_REQUEST,
          payload: { subject: 'Hello 2017', body: 's' },
        }).next().value,
        call(callApi, 'POST', `${process.env.REACT_APP_BASE_URL}api/mails`, {
          subject: 'Hello 2017',
          body: 's',
        }),
      );
    });
    it('should return correct data', () => {
      assert.deepEqual(
        updateMail({
          type: MAIL_UPDATE_REQUEST,
          payload: [testMails[0], testMails[0].subject],
        }).next().value,
        call(callApi, 'PATCH', `${process.env.REACT_APP_BASE_URL}api/mails/Hello 2017`, {
          subject: 'Hello 2017',
          body: 'HAPPY NEW YEAR 2018',
        }),
      );
    });
    it('should return correct data', () => {
      assert.deepEqual(
        deteleMail({
          type: MAIL_DELETE_REQUEST,
          payload: testMails[0].subject,
        }).next().value,
        call(
          callApi,
          'DELETE',
          `${process.env.REACT_APP_BASE_URL}api/mails/${testMails[0].subject}`,
        ),
      );
    });
  });
});

describe('send mail data reducer tests', () => {
  it('should return the initial state', () => {
    expect(sendMailReducer(undefined, {})).toEqual({
      mails: [{ body: '', subject: '[New Mail]' }],
      currentMail: { subject: '', body: '' },
      selectedSubject: '',
      status: { errorMessage: '', currentStatus: '', isNewMailActive: false },
    });
  });

  it('should return correct data for update mail', () => {
    expect(
      sendMailReducer(
        { mails: testMails, mail: [] },
        createAction(MAIL_UPDATE_RESPONE, [testMails[0], testMails[0].subject]),
      ),
    ).toEqual({
      mail: [],
      mails: [
        {
          body: 'HAPPY NEW YEAR 2018',
          subject: 'Hello 2017',
        },
        {
          body: 'Welcome to Hue',
          subject: 'Welcome to VietNam',
        },
      ],
      selectedSubject: 'Hello 2017',
    });
  });

  it('should return correct data ', () => {
    expect(
      sendMailReducer({ mails: testMails }, createAction(MAIL_DELETE_RESPONE, 'Hello 2017')),
    ).toEqual({
      mails: [
        {
          body: 'HAPPY NEW YEAR 2018',
          subject: 'Hello 2017',
        },
        {
          body: 'Welcome to Hue',
          subject: 'Welcome to VietNam',
        },
      ],
    });
  });

  it('should return correct data ', () => {
    expect(
      sendMailReducer(
        { mails: [], currentMail: '' },
        createAction(MAIL_ADD_RESPONE, [{ subject: 'We are one', body: 'Heloo' }]),
      ),
    ).toEqual({
      currentMail: {
        body: 'Heloo',
        subject: 'We are one',
      },
      mails: [
        {
          body: 'Heloo',
          subject: 'We are one',
        },
      ],
      selectedSubject: 'We are one',
    });
  });

  it('should return correct data ', () => {
    expect(
      sendMailReducer({ mails: [], currentMail: '' }, createAction(MAIL_DATA_RESPONE, testMails)),
    ).toEqual({
      currentMail: {
        body: 'HAPPY NEW YEAR 2018',
        subject: 'Hello 2017',
      },
      selectedSubject: 'Hello 2017',
      status: { isNewMailActive: false },
      mails: [
        {
          body: 'HAPPY NEW YEAR 2018',
          subject: 'Hello 2017',
        },
        {
          body: 'Welcome to Hue',
          subject: 'Welcome to VietNam',
        },
      ],
    });
  });
});
