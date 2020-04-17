import { takeLatest, call, put, all } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import history from '~/services/history';
import api from '~/services/api';

import { deliverymanEndRequest } from './actions';

export function* addDeliveryman({ payload }) {
  try {
    const { deliveryman_name, deliveryman_email, avatar_id } = payload.data;

    yield call(api.post, 'deliveryman', {
      name: deliveryman_name,
      email: deliveryman_email,
      avatar_id: avatar_id || null,
    });

    toast.success('Sucesso! Entregador adicionado');
    history.push('/deliverymen', { reload: true });
  } catch (error) {
    console.tron.log(error);
    toast.error(error.response.data.error);
  }

  yield put(deliverymanEndRequest());
}

export function* editDeliveryman({ payload }) {
  try {
    const { id, deliveryman_name, deliveryman_email, avatar_id } = payload.data;

    yield call(api.put, `deliveryman/${id}`, {
      name: deliveryman_name,
      email: deliveryman_email,
      avatar_id,
    });

    toast.success('Sucesso! Entregador atualizado');
    history.push('/deliverymen', { reload: true });
  } catch (error) {
    console.tron.log(error);
    toast.error(error.response.data.error);
  }

  yield put(deliverymanEndRequest());
}

export function* deleteDeliveryman({ payload }) {
  try {
    const { id } = payload.data;

    yield call(api.delete, `deliveryman/${id}`);
    history.push('/deliverymen', { reload: true });
    toast.success('Sucesso! Entregador excluído.');
  } catch (error) {
    console.tron.log(error);
    toast.error(error.response.data.error);
  }

  yield put(deliverymanEndRequest());
}

export default all([
  takeLatest('@deliveryman/ADD_DELIVERYMAN_REQUEST', addDeliveryman),
  takeLatest('@deliveryman/EDIT_DELIVERYMAN_REQUEST', editDeliveryman),
  takeLatest('@deliveryman/DELETE_DELIVERYMAN_REQUEST', deleteDeliveryman),
]);
