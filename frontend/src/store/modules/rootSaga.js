import { all } from 'redux-saga/effects';

import auth from './auth/sagas';
import user from './user/sagas';
import delivery from './delivery/sagas';
import deliveryman from './deliveryman/sagas';
import providers from './providers/sagas';

export default function* rootSaga() {
  return yield all([auth, user, delivery, deliveryman, providers]);
}
