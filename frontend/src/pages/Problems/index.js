import React, { useRef, useState, useEffect } from 'react';
import {
  MdCreate,
  MdDeleteForever,
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
} from 'react-icons/md';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container,
  Title,
  Table,
  DescriptionLine,
  Modal,
  Loader,
  Pagination,
} from './styles';

import Actions from '~/components/actions';
import api from '~/services/api';

import { cancelDeliveryRequest } from '~/store/modules/delivery/actions';

export default function Problems() {
  // #region Variables
  const ref = useRef(null);
  const dispatch = useDispatch();
  const loading = useSelector(state => state.delivery.loading);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [problems, setProblems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState('');

  const actions = {
    left: '-285%',
    actions: [
      {
        text: 'Visualizar',
        icon: <MdCreate size={20} color="#4D85EE" />,
        async func(id) {
          const problem = problems.find(x => x.id === id);

          if (problem) {
            setContent(problem.description);
            setIsOpen(true);
          }
        },
      },
      {
        text: 'Cancelar',
        icon: <MdDeleteForever size={20} color="#DE3B3B" />,
        func: id => {
          // eslint-disable-next-line no-alert
          const r = window.confirm(
            'Você tem certeza que deseja cancelar a encomenda?'
          );
          if (r) {
            dispatch(cancelDeliveryRequest({ id }));
          }
        },
      },
    ],
  };
  // #endregion

  // #region Functions
  useEffect(() => {
    async function loadProblems() {
      const response = await api.get('/delivery/problems', {
        params: { page },
      });

      setProblems(response.data.data);
      setTotalPages(response.data.totalPage);
    }

    loadProblems();
  }, [page]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);

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

  return (
    <>
      <Container>
        <Loader style={{ display: loading ? 'block' : 'none' }} />
        <Title>Problemas na entrega</Title>

        <Table>
          <thead>
            <tr>
              <th>Encomenda</th>
              <th>Problema</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {problems.map(p => {
              return (
                <tr key={p.id}>
                  <td>#{p.id}</td>
                  <DescriptionLine>{p.description}</DescriptionLine>
                  <td>
                    <Actions id={p.Delivery.id} actions={actions} />
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
      </Container>

      <Modal ref={ref} visible={isOpen}>
        <b>VISUALIZAR PROBLEMA</b>
        <span>{content}</span>
      </Modal>
    </>
  );
}
