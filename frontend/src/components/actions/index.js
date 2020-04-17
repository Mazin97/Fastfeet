import React, { useState, useEffect, useRef } from 'react';
import { MdMoreHoriz } from 'react-icons/md';
import PropTypes from 'prop-types';
import { Container, Badge, ActionList, Action } from './styles';

export default function Actions({ id, actions }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setVisible(false);
      }
    }

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  function handleToggleVisible() {
    setVisible(!visible);
  }

  return (
    <Container>
      <Badge onClick={handleToggleVisible}>
        <MdMoreHoriz color="#999" size={20} />
      </Badge>

      <ActionList ref={ref} visible={visible} left={actions.left}>
        {actions.actions.map(a => (
          <Action
            key={a.text}
            onClick={() => {
              a.func(id);
              handleToggleVisible();
            }}
          >
            {a.icon}
            {a.text}
          </Action>
        ))}
      </ActionList>
    </Container>
  );
}

Actions.propTypes = {
  id: PropTypes.number.isRequired,
  actions: PropTypes.shape({
    left: PropTypes.string.isRequired,
    actions: PropTypes.array.isRequired,
  }).isRequired,
};
