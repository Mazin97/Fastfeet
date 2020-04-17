/* eslint-disable no-return-assign */
import React, { useState, useEffect } from 'react';
import {
  MdSearch,
  MdAdd,
  MdCreate,
  MdDeleteForever,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from 'react-icons/md';
import { randomColor } from 'randomcolor';
import { Link, Switch, Route, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Title,
  FilterBar,
  Table,
  Initials,
  InnerContainer,
  Loader,
  Pagination,
} from './styles';

import history from '~/services/history';
import Actions from '~/components/actions';
import api from '~/services/api';
import deliverymenDetail from '~/pages/Deliverymen/register';
import { deleteDeliverymanRequest } from '~/store/modules/deliveryman/actions';

export default function Deliverymen() {
  // #region Variables
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const loading = useSelector(state => state.delivery.loading);
  const [deliverymen, setDeliverymen] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  // #endregion

  // #region Functions & Actions
  useEffect(() => {
    async function loadDeliverymen() {
      const response = await api.get('deliveryman', {
        params: { name, page },
      });

      setDeliverymen(response.data.data);
      setTotalPages(response.data.totalPage);
    }

    loadDeliverymen();
  }, [name, page]);

  function getRandomColor() {
    return randomColor({ luminosity: 'light' });
  }

  function handlePageChange(isUperPage) {
    if (isUperPage) {
      if (page + 1 > totalPages) return;
      setPage(page + 1);
    } else {
      if (page - 1 < 1) return;
      setPage(page - 1);
    }
  }

  const actions = {
    left: '-32%',
    actions: [
      {
        text: 'Editar',
        icon: <MdCreate size={20} color="#4D85EE" />,
        func: id => {
          history.push(`/deliverymen/edit/${id}`);
        },
      },
      {
        text: 'Excluir',
        icon: <MdDeleteForever size={20} color="#DE3B3B" />,
        func: id => {
          // eslint-disable-next-line no-alert
          const r = window.confirm(
            'Você tem certeza que deseja excluir o registro?'
          );
          if (r) {
            dispatch(deleteDeliverymanRequest({ id }));
            setName('');
          }
        },
      },
    ],
  };
  // #endregion

  // #region Location
  const location = useLocation();

  if (name.length && location.state && location.state.clean) {
    setName('');
    location.state.clean = false;
  }

  if (location.state && location.state.reload) {
    setName('');
    location.state.reload = false;
  }
  // #endregion

  return (
    <Switch>
      <Route path="/deliverymen/new" component={deliverymenDetail} isPrivate />
      <Route
        path="/deliverymen/edit/:id"
        component={deliverymenDetail}
        isPrivate
      />

      <Container>
        <Loader style={{ display: loading ? 'block' : 'none' }} />
        <Title>Gerenciando entregadores</Title>

        <FilterBar>
          <div>
            <MdSearch size={20} color="#999999" />
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              name="nameFilter"
              placeholder="Buscar por entregadores"
            />
          </div>

          <button type="button">
            <Link to="/deliverymen/new" style={{ color: '#fff' }}>
              <MdAdd size={20} color="#fff" />
              cadastrar
            </Link>
          </button>
        </FilterBar>

        {deliverymen && deliverymen.length ? (
          <>
            <Table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Foto</th>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {deliverymen.map(d => {
                  return (
                    <tr key={d.id}>
                      <td>#{d.id}</td>
                      <td>
                        {d.avatar ? (
                          <img src={d.avatar.url} alt="imagem do entregador" />
                        ) : (
                          <Initials color={getRandomColor()}>
                            {d.name
                              .split(/\s/)
                              .reduce(
                                (response, word) =>
                                  (response += word.slice(0, 1)),
                                ''
                              )}
                          </Initials>
                        )}
                      </td>
                      <td>{d.name}</td>
                      <td>{d.email}</td>
                      <td>
                        <Actions id={d.id} actions={actions} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>

            <Pagination>
              <MdKeyboardArrowLeft
                size={40}
                onClick={() => handlePageChange(false)}
              />
              <span>
                Exibindo página {page} de {totalPages}
              </span>
              <MdKeyboardArrowRight
                size={40}
                onClick={() => handlePageChange(true)}
              />
            </Pagination>
          </>
        ) : (
          <InnerContainer style={{ textAlign: 'center', margin: '10px' }}>
            Nenhum registro encontrado com os filtros atuais.
          </InnerContainer>
        )}
      </Container>
    </Switch>
  );
}
