import React from 'react';
import { AppProvider } from '@shopify/polaris';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import LogIn from './components/LogIn';
import AppView from './components/AppView';
import LandingPage from './components/LandingPage';
import Shopview from './components/ShopView';
import Users from './components/Users';

export default () => {
  return (
    <AppProvider>
      <BrowserRouter basename="/sesame">
        <Switch>
          <Route exact path="/" component={LogIn} />
          <Route path="/appview/:app" component={AppView} />
          <Route path="/landingpage" component={LandingPage} />
          <Route path="/shopview/:appName/:shopDomain" component={Shopview} />
          <Route path="/users" component={Users} />
        </Switch>
      </BrowserRouter>
    </AppProvider>
  );
};
