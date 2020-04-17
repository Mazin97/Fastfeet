import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { MdKeyboardArrowLeft, MdDone } from 'react-icons/md';
import { Form, Input } from '@rocketseat/unform';
import * as Yup from 'yup';
import AsyncSelect from 'react-select/async';
import {
  Container,
  Title,
  Button,
  InnerContainer,
  TopTitleWithButtons,
  Loader,
} from './styles';
import api from '~/services/api';

import {
  addDeliveryRequest,
  editDeliveryRequest,
} from '~/store/modules/delivery/actions';

const schema = Yup.object().shape({
  id: Yup.string(),
  productName: Yup.string().required('O nome do produto é obrigatório'),
  deliveryman: Yup.number()
    .moreThan(0, 'É obrigatório selecionar um entregador')
    .required('É obrigatório selecionar um entregador'),
  recipient: Yup.number()
    .moreThan(0, 'É obrigatório selecionar um destinatário')
    .required('É obrigatório selecionar um destinatário'),
});

export default function RegisterDeliveries({ history: navigation }) {
  const { delivery } = navigation.location.state || '';

  const dispatch = useDispatch();
  const loading = useSelector(state => state.delivery.loading);

  const [deliveryman, setDeliveryman] = useState(
    delivery ? delivery.deliveryman_id : 0
  );
  const [recipient, setRecipient] = useState(
    delivery ? delivery.recipient_id : 0
  );
  const [productName, setProductName] = useState(delivery && delivery.product);

  async function loadOptions(controller, inputValue) {
    const res = await api.get(controller, { params: { name: inputValue } });

    return new Promise(resolve => {
      resolve(
        res.data.map(item => {
          return {
            value: item.id,
            label: item.name,
          };
        })
      );
    });
  }

  function handleSubmit(data) {
    if (delivery) {
      dispatch(editDeliveryRequest(data));
    } else {
      dispatch(addDeliveryRequest(data));
    }
  }

  return (
    <Container>
      <Form initialData={delivery} schema={schema} onSubmit={handleSubmit}>
        <Input value={delivery && delivery.id} type="hidden" name="id" />
        <TopTitleWithButtons>
          <Loader style={{ display: loading ? 'block' : 'none' }} />
          <Title>{delivery ? 'Edição' : 'Cadastro'} de encomendas</Title>

          <div>
            <Link
              to={{
                pathname: '/deliveries',
                state: { clean: true },
              }}
            >
              <MdKeyboardArrowLeft size={20} color="#FFF" />
              voltar
            </Link>
            <Button type="submit">
              <MdDone size={20} color="#FFF" />
              salvar
            </Button>
          </div>
        </TopTitleWithButtons>

        <InnerContainer>
          <div>
            <h3>Destinatário</h3>
            <Input value={recipient} type="hidden" name="recipient" />
            <AsyncSelect
              name="recipient"
              isSearchable
              defaultOptions
              defaultValue={{
                label: delivery
                  ? delivery.Recipient.name
                  : 'Selecione ou digite o nome do destinatário...',
                value: delivery ? delivery.recipient_id : '0',
              }}
              loadOptions={inputValue => loadOptions('recipients', inputValue)}
              onChange={selectedValue => setRecipient(selectedValue.value)}
            />
          </div>

          <div>
            <Input value={deliveryman} type="hidden" name="deliveryman" />
            <h3>Entregador</h3>
            <AsyncSelect
              name="deliveryman"
              placeholder="Selecione ou digite o nome do entregador..."
              isSearchable
              defaultOptions
              defaultValue={{
                label: delivery
                  ? delivery.Deliverymen.name
                  : 'Selecione ou digite o nome do destinatário...',
                value: delivery ? delivery.deliveryman_id : '0',
              }}
              loadOptions={inputValue => loadOptions('deliveryman', inputValue)}
              onChange={selectedValue => setDeliveryman(selectedValue.value)}
            />
          </div>

          <label htmlFor="productName">
            Nome do produto
            <Input
              value={productName}
              type="text"
              name="productName"
              onChange={e => setProductName(e.target.value)}
            />
          </label>
        </InnerContainer>
      </Form>
    </Container>
  );
}

RegisterDeliveries.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
};
