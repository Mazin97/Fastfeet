import { takeLatest, call, put, all } from 'redux-saga/effects';
import { toast } from 'react-toastify';

import history from '~/services/history';
import api from '~/services/api';

import { providerEndRequest } from './actions';

export function* addProvider({ payload }) {
  try {
    const {
      name,
      street,
      number,
      complement,
      city,
      state,
      zipcode,
    } = payload.data;

    yield call(api.post, 'recipients', {
      name,
      street,
      number,
      complement,
      city,
      state,
      zip_code: zipcode,
    });

    toast.success('Sucesso! Destinatário adicionado');
    history.push('/providers', { reload: true });
  } catch (error) {
    console.tron.log(error.response.data.error);
    toast.error(error.response.data.error);
  }

  yield put(providerEndRequest());
}

export function* editProvider({ payload }) {
  try {
    const {
      id,
      name,
      street,
      number,
      complement,
      city,
      state,
      zipcode,
    } = payload.data;

    yield call(api.put, `recipients/${id}`, {
      name,
      street,
      number,
      complement,
      city,
      state,
      zip_code: zipcode,
    });

    toast.success('Sucesso! Destinatário atualizado');
    history.push('/providers', { reload: true });
  } catch (error) {
    console.tron.log('maatuasdaihsd');
    console.tron.log(error.response.data);
    console.tron.log(error.response.data.error);
    toast.error(error.response.data.error);
  }

  yield put(providerEndRequest());
}

export function* deleteProvider({ payload }) {
  try {
    const { id } = payload.data;

    yield call(api.delete, `recipients/${id}`);
    history.push('/providers', { reload: true });
    toast.success('Sucesso! Destinatário excluído.');
  } catch (error) {
    console.tron.log(error);
    toast.error(error.response.data.error);
  }

  yield put(providerEndRequest());
}

export default all([
  takeLatest('@provider/ADD_PROVIDER_REQUEST', addProvider),
  takeLatest('@provider/EDIT_PROVIDER_REQUEST', editProvider),
  takeLatest('@provider/DELETE_PROVIDER_REQUEST', deleteProvider),
]);
