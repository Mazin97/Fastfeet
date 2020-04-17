/* eslint-disable no-return-assign */
import React, { useRef, useState, useEffect } from 'react';
import {
  MdSearch,
  MdAdd,
  MdRemoveRedEye,
  MdCreate,
  MdDeleteForever,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from 'react-icons/md';
import { randomColor } from 'randomcolor';
import { format } from 'date-fns';
import { Link, Switch, Route, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  Container,
  Title,
  FilterBar,
  Table,
  Initials,
  Status,
  Modal,
  InnerContainer,
  Pagination,
  Loader,
} from './styles';

import api from '~/services/api';

import newDelivery from '~/pages/Deliveries/register';
import Actions from '~/components/actions';
import history from '~/services/history';

import { deleteDeliveryRequest } from '~/store/modules/delivery/actions';

export default function Deliviries() {
  // #region Variables
  const dispatch = useDispatch();
  const ref = useRef(null);
  const loading = useSelector(state => state.delivery.loading);

  const [productName, setProductName] = useState('');
  const [deliveries, setDeliveries] = useState([]);
  const [filterProblem, setFilterProblem] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [signatureUrl, setSignatureUrl] = useState('');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const actions = {
    left: '-100%',
    actions: [
      {
        text: 'Visualizar',
        icon: <MdRemoveRedEye size={20} color="#8E5BE8" />,
        async func(id) {
          const response = await api.get(`/delivery/${id}`);

          if (!response || response.error) {
            toast.error(
              `Erro ao ler os dados da entrega. Tente novamente mais tarde.`
            );
            return;
          }

          if (response.data.Recipient) {
            const {
              street: recipient_street,
              number: recipient_number,
              city: recipient_city,
              state: recipient_state,
              zip_code: recipient_zip_code,
            } = response.data.Recipient;

            setStreet(recipient_street);
            setNumber(recipient_number);
            setCity(recipient_city);
            setState(recipient_state);
            setZipcode(recipient_zip_code);
          }

          window.scrollTo(0, 0);
          const { start_date, end_date } = response.data;

          if (start_date) {
            setStartDate(format(new Date(start_date), 'dd/MM/yyyy'));
          } else {
            setStartDate('Ainda não retirado');
          }

          if (end_date) {
            setEndDate(format(new Date(end_date), 'dd/MM/yyyy'));
          } else {
            setEndDate('Ainda não entregue');
          }

          if (response.data.signature) {
            const { url } = response.data.signature;

            if (url) {
              setSignatureUrl(url);
            }
          }

          setIsOpen(true);
        },
      },
      {
        text: 'Editar',
        icon: <MdCreate size={20} color="#4D85EE" />,
        async func(id) {
          const response = await api.get(`/delivery/${id}`);

          if (!response || response.error) {
            toast.error(
              `Erro ao ler os dados da entrega. Tente novamente mais tarde.`
            );
            return;
          }

          const { data } = response;

          history.push(`/deliveries/edit/${id}`, { delivery: data });
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
            dispatch(deleteDeliveryRequest({ id }));
            const delivery = deliveries.find(x => x.id === id);
            setDeliveries(deliveries.filter(x => x !== delivery));
          }
        },
      },
    ],
  };
  // #endregion

  // #region Functions
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);

  useEffect(() => {
    async function loadDeliveries() {
      const response = await api.get('/delivery', {
        params: { productName, page },
      });

      if (filterProblem) {
        const responseProblem = await api.get('/delivery/problems', {
          params: { page: 1 },
        });

        const ids = responseProblem.data.data.map(e => {
          if (!e || !e.Delivery) return null;
          return e.Delivery.id;
        });

        const deliveriesFiltered = response.data.data.filter(x =>
          ids.includes(x.id)
        );

        setDeliveries(deliveriesFiltered);
      } else {
        setDeliveries(response.data.data);
      }

      setTotalPages(response.data.totalPage);
    }

    loadDeliveries();
  }, [page, productName, filterProblem]);

  function getRandomColor() {
    return randomColor({ luminosity: 'light' });
  }

  function getStatusColor(status) {
    switch (status) {
      case 'entregue':
        return '#DFF0DF';
      case 'retirada':
        return '#BAD2FF';
      case 'pendente':
        return '#F0F0DF';
      case 'cancelada':
        return '#FAB0B0';
      default:
        return '#BAD2FF';
    }
  }

  function getDeliveryStatus(dl) {
    if (dl.canceled_at) {
      return 'cancelada';
    }
    if (dl.end_date) {
      return 'entregue';
    }
    if (dl.start_date) {
      return 'retirada';
    }

    return 'pendente';
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
  // #endregion

  // #region Location
  const location = useLocation();

  if (
    productName &&
    productName.length &&
    location.state &&
    location.state.clean
  ) {
    setProductName('');
    location.state.clean = false;
  }

  if (location.state && location.state.reload) {
    setProductName('');
    location.state.reload = false;
  }
  // #endregion

  return (
    <>
      <Switch>
        <Route path="/deliveries/new" component={newDelivery} isPrivate />
        <Route path="/deliveries/edit/:id" component={newDelivery} isPrivate />

        <Container>
          <Loader style={{ display: loading ? 'block' : 'none' }} />
          <Title>Gerenciando encomendas</Title>

          <FilterBar>
            <div>
              <MdSearch size={20} color="#999999" />
              <input
                value={productName}
                onChange={e => setProductName(e.target.value)}
                name="nameFilter"
                placeholder="Buscar por encomendas"
              />
            </div>

            <div>
              <input
                type="checkbox"
                id="problemCheck"
                name="problemCheck"
                onChange={() => setFilterProblem(!filterProblem)}
              />
              <label htmlFor="problemCheck">Apenas com problema</label>
            </div>

            <button type="button">
              <Link to="/deliveries/new" style={{ color: '#fff' }}>
                <MdAdd size={20} color="#fff" />
                cadastrar
              </Link>
            </button>
          </FilterBar>

          {deliveries && deliveries.length ? (
            <>
              <Table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Destinatário</th>
                    <th>Entregador</th>
                    <th>Cidade</th>
                    <th>Estado</th>
                    <th style={{ width: '150px' }}>Status</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {deliveries.map(dl => {
                    const status = getDeliveryStatus(dl);

                    return (
                      <tr key={dl.id}>
                        <td>#{dl.id}</td>
                        <td>{dl.Recipient.name}</td>
                        <td>
                          {dl.Deliverymen.avatar ? (
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <img
                                src={dl.Deliverymen.avatar.url}
                                alt="imagem do entregador"
                              />
                              {dl.Deliverymen.name}
                            </div>
                          ) : (
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              <Initials color={getRandomColor()}>
                                {dl.Deliverymen.name
                                  .split(/\s/)
                                  .reduce(
                                    (response, word) =>
                                      (response += word.slice(0, 1)),
                                    ''
                                  )}
                              </Initials>
                              {dl.Deliverymen.name}
                            </div>
                          )}
                        </td>
                        <td>{dl.Recipient.city}</td>
                        <td>{dl.Recipient.state}</td>
                        <td>
                          <Status color={getStatusColor(status)}>
                            <div />
                            {status}
                          </Status>
                        </td>
                        <td>
                          <Actions id={dl.id} actions={actions} />
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

      <Modal ref={ref} visible={isOpen}>
        <b>Informações da encomenda</b>
        <span>
          {street}, {number}
        </span>
        <span>
          {city} - {state}
        </span>
        <span>{zipcode}</span>
        <div />
        <b>Datas</b>
        <p>
          <b>Retirada:</b> <span>{startDate}</span>
        </p>
        <p>
          <b>Entrega:</b> <span>{endDate}</span>
        </p>
        <div />
        <b>Assinatura do destinatário</b>

        {signatureUrl.length > 0 ? (
          <img src={signatureUrl} alt="Assinatura do destinatário" />
        ) : (
          <div>Sem assinatura até o momento</div>
        )}
      </Modal>
    </>
  );
}
