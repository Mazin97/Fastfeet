import { takeLatest, call, put, all } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import history from '~/services/history';
import api from '~/services/api';

import { deliveryEndRequest } from './actions';

export function* addDelivery({ payload }) {
  try {
    const { productName, recipient, deliveryman } = payload.data;

    yield call(api.post, 'delivery', {
      product: productName,
      recipient_id: recipient,
      deliveryman_id: deliveryman,
    });

    toast.success('Sucesso! Entrega adicionada');
    history.push('/deliveries', { reload: true });
  } catch (error) {
    console.tron.log(error);
    toast.error(error.response.data.error);
  }

  yield put(deliveryEndRequest());
}

export function* editDelivery({ payload }) {
  try {
    const { id, productName, recipient, deliveryman } = payload.data;

    yield call(api.put, `delivery/${id}`, {
      product: productName,
      recipient_id: recipient,
      deliveryman_id: deliveryman,
    });

    toast.success('Sucesso! Entrega atualizada');
    history.push('/deliveries', { reload: true });
  } catch (error) {
    console.tron.log(error);
    toast.error(error.response.data.error);
  }

  yield put(deliveryEndRequest());
}

export function* cancelDelivery({ payload }) {
  try {
    const { id } = payload.data;

    yield call(api.put, `delivery/${id}`, {
      canceled_at: new Date(),
    });

    toast.success('Sucesso! Entrega cancelada.');
  } catch (error) {
    console.tron.log(error);
    toast.error(error.response.data.error);
  }

  yield put(deliveryEndRequest());
}

export function* deleteDelivery({ payload }) {
  try {
    const { id } = payload.data;

    yield call(api.delete, `delivery/${id}`);
    toast.success('Sucesso! Entrega excluída.');
  } catch (error) {
    console.tron.log(error);
    toast.error(error.response.data.error);
  }

  yield put(deliveryEndRequest());
}

export default all([
  takeLatest('@delivery/ADD_DELIVERY_REQUEST', addDelivery),
  takeLatest('@delivery/EDIT_DELIVERY_REQUEST', editDelivery),
  takeLatest('@delivery/CANCEL_DELIVERY_REQUEST', cancelDelivery),
  takeLatest('@delivery/DELETE_DELIVERY_REQUEST', deleteDelivery),
]);
