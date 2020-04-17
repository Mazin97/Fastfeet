import React, { useState, useEffect } from 'react';
import {
  MdSearch,
  MdAdd,
  MdCreate,
  MdDeleteForever,
  MdKeyboardArrowRight,
  MdKeyboardArrowLeft,
} from 'react-icons/md';
import { Link, Switch, Route, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Title,
  FilterBar,
  Table,
  InnerContainer,
  Loader,
  Pagination,
} from './styles';

import detailPage from '~/pages/Providers/register';
import Actions from '~/components/actions';
import api from '~/services/api';
import history from '~/services/history';

import { deleteProviderRequest } from '~/store/modules/providers/actions';

export default function Providers() {
  // #region Variables
  const dispatch = useDispatch();
  const loading = useSelector(state => state.delivery.loading);
  const [name, setName] = useState('');
  const [providers, setProviders] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const actions = {
    left: '-32%',
    actions: [
      {
        text: 'Editar',
        icon: <MdCreate size={20} color="#4D85EE" />,
        func: id => {
          history.push(`/providers/edit/${id}`);
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
            dispatch(deleteProviderRequest({ id }));
            setName('');
          }
        },
      },
    ],
  };
  // #endregion

  // #region Functions
  useEffect(() => {
    async function loadProviders() {
      const response = await api.get('/recipients', {
        params: { name },
      });

      setProviders(response.data.data);
      setTotalPages(response.data.totalPage);
    }

    loadProviders();
  }, [name]);

  function handlePageChange(isUperPage) {
    if (isUperPage) {
      if (page + 1 > totalPages) return;
      setPage(page + 1);
    } else {
      if (page - 1 < 1) return;
      setPage(page - 1);
    }
  }
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
      <Route path="/providers/new" component={detailPage} isPrivate />
      <Route path="/providers/edit/:id" component={detailPage} isPrivate />

      <Container>
        <Loader style={{ display: loading ? 'block' : 'none' }} />
        <Title>Gerenciando destinatários</Title>

        <FilterBar>
          <div>
            <MdSearch size={20} color="#999999" />
            <input
              vlaue={name}
              onChange={e => setName(e.target.value)}
              name="nameFilter"
              placeholder="Buscar por destinatários"
            />
          </div>

          <button type="button">
            <Link to="/providers/new" style={{ color: '#fff' }}>
              <MdAdd size={20} color="#fff" />
              cadastrar
            </Link>
          </button>
        </FilterBar>

        {providers && providers.length ? (
          <>
            <Table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>Endereço</th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {providers.map(p => {
                  return (
                    <tr key={p.id}>
                      <td>#{p.id}</td>
                      <td>{p.name}</td>
                      <td>
                        {p.street}, {p.number}, {p.city}, {p.state}
                      </td>
                      <td>
                        <Actions id={p.id} actions={actions} />
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
          <InnerContainer
            style={{ textAlign: 'center', margin: '10px', padding: '20px' }}
          >
            Nenhum registro encontrado com os filtros atuais.
          </InnerContainer>
        )}
      </Container>
    </Switch>
  );
}
