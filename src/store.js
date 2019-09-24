import { combineReducers, createStore, applyMiddleware } from 'redux';
import { all } from 'redux-saga/effects';
import createSagaMiddleware from 'redux-saga';

import { appViewData, appViewSagas } from './components/AppView/ducks';
import {
  landinPageDataReducer as landingData,
  landingPageDataSagas,
} from './components/LandingPage/ducks';
import { shopView, shopViewSagas } from './components/ShopView/ducks';
import { loginReducer as login, loginSagas, verifiedSagas } from './components/LogIn/ducks';
import { usersData, usersSagas } from './components/Users/ducks';
import { sendMailReducer, sendMailSagas } from './components/SendMail/ducks';

export const rootReducer = combineReducers({
  appViewData,
  landingData,
  shopView,
  login,
  usersData,
  sendMailReducer,
});

const rootSaga = function* rootSaga() {
  yield all([
    ...appViewSagas,
    ...landingPageDataSagas,
    ...shopViewSagas,
    ...usersSagas,
    ...loginSagas,
    ...verifiedSagas,
    ...sendMailSagas,
  ]);
};

const sagaMiddleware = createSagaMiddleware();
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSaga);

export default store;
