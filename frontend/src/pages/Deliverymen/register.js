import React, { useState, useEffect, useRef } from 'react';
import { Form, Input } from '@rocketseat/unform';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { MdKeyboardArrowLeft, MdDone, MdInsertPhoto } from 'react-icons/md';

import * as Yup from 'yup';
import api from '~/services/api';
import {
  Container,
  TopTitleWithButtons,
  Title,
  Button,
  InnerContainer,
  Loader,
} from './styles';

import {
  addDeliverymanRequest,
  editDeliverymanRequest,
} from '~/store/modules/deliveryman/actions';

const schema = Yup.object().shape({
  id: Yup.string(),
  avatar_id: Yup.number(),
  deliveryman_name: Yup.string().required('O nome do entregador é obrigatório'),
  deliveryman_email: Yup.string()
    .email('Insira um e-mail válido')
    .required('É obrigatório inserir o e-mail do entregador'),
});

export default function RegisterDeliverymen() {
  const dispatch = useDispatch();
  const loading = useSelector(state => state.deliveryman.loading);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatarId, setAvatarId] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState('');
  const { id } = useParams();
  const ref = useRef();

  useEffect(() => {
    async function LoadDeliveryman() {
      const response = await api.get(`/deliveryman/${id}`);

      setName(response.data.name);
      setEmail(response.data.email);

      if (response.data.avatar) {
        setAvatarId(response.data.avatar.id);
        setAvatarUrl(response.data.avatar.url);
      }
    }

    if (id) LoadDeliveryman();
  }, [id]);

  async function handleAvatarChange(event) {
    const data = new FormData();

    data.append('file', event.target.files[0]);

    const response = await api.post('files', data);

    const { id: avatar_id, url } = response.data;

    setAvatarId(avatar_id);
    setAvatarUrl(url);
  }

  function handleSubmit(data) {
    if (id) {
      dispatch(editDeliverymanRequest(data));
    } else {
      dispatch(addDeliverymanRequest(data));
    }
  }

  return (
    <Container>
      <Form schema={schema} onSubmit={handleSubmit}>
        <Input type="hidden" name="id" value={id} />
        <Input type="hidden" name="avatar_id" value={avatarId} />

        <TopTitleWithButtons>
          <Loader style={{ display: loading ? 'block' : 'none' }} />
          <Title>{id ? 'Edição' : 'Cadastro'} de entregadores</Title>

          <div>
            <Link
              to={{
                pathname: '/deliverymen',
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
          <label htmlFor="avatar">
            {avatarUrl ? (
              <div className="photoContainer">
                <img src={avatarUrl} alt="" />
              </div>
            ) : (
              <div className="insertPhoto">
                <MdInsertPhoto size={52} color="#DDD" />
                Adicionar Foto
              </div>
            )}
            <input
              name="avatar"
              type="file"
              id="avatar"
              accept="image/*"
              data-file={avatarId}
              onChange={handleAvatarChange}
              ref={ref}
            />
          </label>

          <label htmlFor="deliveryman_name">
            Nome
            <Input
              value={name}
              type="text"
              name="deliveryman_name"
              onChange={e => setName(e.target.value)}
            />
          </label>

          <label htmlFor="deliveryman_email">
            Email
            <Input
              value={email}
              type="email"
              name="deliveryman_email"
              onChange={e => setEmail(e.target.value)}
            />
          </label>
        </InnerContainer>
      </Form>
    </Container>
  );
}
