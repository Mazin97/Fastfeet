import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import logo from '~/assets/fastfeet-logo.png';
import { Container, Content, Profile, StyledLink } from './styles';

import { signOut } from '~/store/modules/auth/actions';

export default function Header() {
  const dispatch = useDispatch();

  const profile = useSelector(state => state.user.profile);

  function handleSignOut() {
    dispatch(signOut());
  }

  return (
    <Container>
      <Content>
        <nav>
          <img src={logo} alt="FastFeet" />
          <StyledLink
            active={(
              window.location.pathname.indexOf('deliveries') === 1
            ).toString()}
            to="/deliveries"
          >
            encomendas
          </StyledLink>
          <StyledLink
            active={(
              window.location.pathname.indexOf('deliverymen') === 1
            ).toString()}
            to="/deliverymen"
          >
            entregadores
          </StyledLink>
          <StyledLink
            active={(
              window.location.pathname.indexOf('providers') === 1
            ).toString()}
            to="/providers"
          >
            destinatários
          </StyledLink>
          <StyledLink
            active={(
              window.location.pathname.indexOf('problems') === 1
            ).toString()}
            to="/problems"
          >
            problemas
          </StyledLink>
        </nav>

        <aside>
          <Profile>
            <div>
              <strong>
                {profile.name}
                <Link onClick={handleSignOut} to="/">
                  sair do sistema
                </Link>
              </strong>
            </div>
          </Profile>
        </aside>
      </Content>
    </Container>
  );
}
