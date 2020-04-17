import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { darken } from 'polished';

export const Container = styled.div`
  background: #fff;
  padding: 0 30px;
`;

export const Content = styled.div`
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  nav {
    display: flex;
    align-items: center;

    img {
      margin-right: 20px;
      padding-right: 20px;
      max-width: 170px;
      border-right: 1px solid #eee;
    }
  }

  aside {
    display: flex;
    align-items: center;
  }
`;

export const StyledLink = styled(Link)`
  font-weight: bold;
  padding: 0 10px;
  color: ${props => (props.active === 'true' ? '#444444' : '#999999')};
  text-transform: uppercase;

  &:hover {
    color: #444444;
  }
`;

export const Profile = styled.div`
  display: flex;

  div {
    text-align: right;
    margin-right: 10px;

    strong {
      display: block;
      color: #666666;
    }

    a {
      display: block;
      margin-top: 2px;
      font-size: 14px;
      color: #de3b3b;
      transition: all 0.2s;
    }

    a:hover {
      color: ${darken(0.1, '#de3b3b')};
    }
  }
`;
