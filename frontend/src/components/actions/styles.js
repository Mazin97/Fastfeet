import styled, { css } from 'styled-components';
import { lighten } from 'polished';

export const Container = styled.div`
  position: relative;
`;

export const Badge = styled.button`
  background: none;
  border: 0;
  position: relative;

  ${props =>
    props.hasUnread &&
    css`
      &::after {
        position: absolute;
        right: 0;
        top: 0;
        width: 8px;
        height: 8px;
        background: #ff892e;
        content: '';
        border-radius: 50%;
      }
    `}
`;

export const ActionList = styled.div`
  position: absolute;
  background: #fff;
  z-index: 999;
  border-radius: 4px;
  border: 1px solid #e5e5e5;
  display: ${props => (props.visible ? 'block' : 'none')};
  left: ${props => props.left};

  &::before {
    content: '';
    position: absolute;
    top: -10px;
    left: 45%;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid #e5e5e5;
  }
`;

export const Action = styled.div`
  color: #999;
  font-weight: 100;
  transition: color 0.2s;
  font-size: 16px;
  padding: 2px 0;
  padding-right: 15px;
  margin: 5px 0;
  cursor: pointer;
  display: flex;

  svg {
    margin: 0 15px;
  }

  &:hover {
    color: ${lighten(0.1, '#999')};
  }

  :not(:first-child) {
    padding-top: 10px;
    border-top: 1px solid #e5e5e5;
  }
`;
