import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Form, Input } from '@rocketseat/unform';
import { Link, useParams } from 'react-router-dom';
import { MdKeyboardArrowLeft, MdDone } from 'react-icons/md';
import * as Yup from 'yup';
import InputMask from 'react-input-mask';

import api from '~/services/api';
import {
  Container,
  Title,
  Button,
  InnerContainer,
  TopTitleWithButtons,
  Loader,
} from './styles';

import {
  addProviderRequest,
  editProviderRequest,
} from '~/store/modules/providers/actions';

const schema = Yup.object().shape({
  id: Yup.string(),
  name: Yup.string(),
  street: Yup.string(),
  number: Yup.number(),
  complement: Yup.string(),
  city: Yup.string(),
  state: Yup.string().max(2, 'O estado deve ser escrito no formato de sigla'),
  zipcode: Yup.string(),
});

export default function ProviderDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const loading = useSelector(state => state.providers.loading);

  const [provider_name, setName] = useState('');
  const [provider_street, setStreet] = useState('');
  const [provider_number, setNumber] = useState('');
  const [provider_complement, setComplement] = useState('');
  const [provider_city, setCity] = useState('');
  const [provider_state, setState] = useState('');
  const [provider_zipcode, setZipcode] = useState('');

  useEffect(() => {
    async function LoadProvider() {
      const response = await api.get(`/recipients/${id}`);

      const {
        name,
        street,
        number,
        complement,
        city,
        state,
        zip_code,
      } = response.data;

      setName(name);
      setStreet(street);
      setNumber(number);
      setComplement(complement);
      setCity(city);
      setState(state);
      setZipcode(zip_code);
    }

    if (id) LoadProvider();
  }, [id]);

  function handleSubmit(data) {
    data.zipcode = provider_zipcode;

    if (id) {
      dispatch(editProviderRequest(data));
    } else {
      dispatch(addProviderRequest(data));
    }
  }

  return (
    <Container>
      <Form schema={schema} onSubmit={handleSubmit}>
        <Input type="hidden" name="id" value={id} />

        <TopTitleWithButtons>
          <Loader style={{ display: loading ? 'block' : 'none' }} />
          <Title>{id ? 'Edição' : 'Cadastro'} de destinatário</Title>

          <div>
            <Link to={{ pathname: '/providers', state: { clean: true } }}>
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
          <label htmlFor="name">
            Nome
            <Input
              value={provider_name}
              type="text"
              name="name"
              onChange={e => setName(e.target.value)}
            />
          </label>

          <div>
            <label htmlFor="street">
              Rua
              <Input
                value={provider_street}
                type="text"
                name="street"
                onChange={e => setStreet(e.target.value)}
              />
            </label>

            <label htmlFor="number" style={{ maxWidth: '200px' }}>
              Número
              <Input
                value={provider_number}
                type="text"
                name="number"
                onChange={e => setNumber(e.target.value)}
              />
            </label>

            <label htmlFor="complement" style={{ maxWidth: '200px' }}>
              Complemento
              <Input
                value={provider_complement}
                type="text"
                name="complement"
                onChange={e => setComplement(e.target.value)}
              />
            </label>
          </div>

          <div>
            <label htmlFor="city">
              Cidade
              <Input
                value={provider_city}
                type="text"
                name="city"
                onChange={e => setCity(e.target.value)}
              />
            </label>

            <label htmlFor="state">
              Estado
              <Input
                value={provider_state}
                type="text"
                name="state"
                onChange={e => setState(e.target.value)}
              />
            </label>

            <label htmlFor="zipcode">
              CEP
              <InputMask
                mask="99.999-999"
                value={provider_zipcode}
                type="text"
                id="zipcode"
                name="zipcode"
                placeholder="00.000-000"
                onChange={e => setZipcode(e.target.value)}
              />
            </label>
          </div>
        </InnerContainer>
      </Form>
    </Container>
  );
}
