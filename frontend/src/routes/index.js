import * as React from 'react';
import { Switch } from 'react-router-dom';
import Route from './Route';

import SignIn from '~/pages/SignIn';
import Deliveries from '~/pages/Deliveries';
import Deliverymen from '~/pages/Deliverymen';
import Providers from '~/pages/Providers';
import Problems from '~/pages/Problems';

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={SignIn} />
      <Route path="/deliveries" component={Deliveries} isPrivate />
      <Route path="/deliverymen" component={Deliverymen} isPrivate />
      <Route path="/providers" component={Providers} isPrivate />
      <Route path="/problems" component={Problems} isPrivate />
      <Route path="/" component={() => <h1>404</h1>} />
    </Switch>
  );
}
