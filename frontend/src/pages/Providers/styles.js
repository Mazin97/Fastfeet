import styled, { keyframes } from 'styled-components';
import { darken } from 'polished';

export const Container = styled.div`
  width: 1000px;
  margin: 0 auto;
`;

export const Title = styled.div`
  color: #444;
  font-size: 24px;
  font-weight: bold;
  margin-top: 50px;
  margin-bottom: 30px;
`;

export const FilterBar = styled.div`
  display: flex;
  justify-content: space-between;

  > div {
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding: 5px 10px;

    input {
      padding-left: 5px;
      border: 0;
    }
  }

  a {
    display: flex;
    align-items: center;
  }

  button {
    background: #7d40e7;
    color: #fff;
    display: flex;
    align-items: center;
    padding: 7px 10px;
    border-radius: 4px;
    border: 1px solid #7d40e7;
    justify-content: space-around;
    font-size: 15px;
    transition: background 0.2s;
    text-transform: uppercase;
  }

  button:hover {
    background: ${darken(0.04, '#7D40E7')};
  }
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 1.8em;
  color: #666;

  thead {
    color: #444444;
    font-size: 16px;
  }

  tbody {
    tr {
      text-align: center;
      background: #fff;
      border-radius: 50px;
    }

    td {
      padding: 18px;
      border: solid 1px #fff;
      border-style: solid none;
    }
    td:first-child {
      border-left-style: solid;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }
    td:last-child {
      border-right-style: solid;
      border-bottom-right-radius: 4px;
      border-top-right-radius: 4px;
      font-size: 20px;
      font-weight: bold;
      color: #999;
    }
  }
`;

export const TopTitleWithButtons = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;

  div {
    display: flex;
    align-items: center;

    a {
      margin-right: 20px;
      background: #cccccc;
      color: #fff;
      display: flex;
      align-items: center;
      padding: 7px 10px;
      border-radius: 4px;
      border: 1px solid #cccccc;
      justify-content: space-around;
      font-size: 15px;
      transition: background 0.2s;
      text-transform: uppercase;

      &:hover {
        background: ${darken(0.04, '#CCCCCC')};
      }
    }
  }
`;

export const InnerContainer = styled.div`
  background-color: #fff;
  border-radius: 4px;

  span {
    color: #fb6f91;
    align-self: flex-start;
    margin: 2px 0 10px;
    font-weight: bold;
  }

  > div {
    display: flex;
    justify-content: space-between;
  }

  label {
    display: flex;
    padding: 10px;
    margin: 5px;
    font-size: 16px;
    font-weight: bold;
    flex-direction: column;
    flex: 1;
  }

  input {
    border: 1px solid #ddd;
    border-radius: 4px;
    height: 40px;
    line-height: 1;
    padding: 5px;
    margin-top: 10px;
    font-size: 14px;
  }
`;

export const Button = styled.button`
  background: #7d40e7;
  color: #fff;
  display: flex;
  align-items: center;
  padding: 7px 10px;
  border-radius: 4px;
  border: 1px solid #7d40e7;
  justify-content: space-around;
  font-size: 15px;
  transition: background 0.2s;
  text-transform: uppercase;

  &:hover {
    background: ${darken(0.04, '#7D40E7')};
  }
`;

const spin = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`;

export const Loader = styled.div`
  border: 0.2em solid rgba(0, 0, 0, 0.1);
  border-top: 0.2em solid #767676;
  border-radius: 50%;
  width: 2.28571429rem;
  height: 2.28571429rem;
  animation: ${spin} 0.6s linear infinite;
  position: absolute;
  top: 50%;
  left: 50%;
  display: ${props => props.visible};
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  border-radius: 4px;
  padding: 10px 0;
  color: #aaa;

  svg {
    cursor: pointer;
    color: #bbb;
    transition: color 0.2s;
  }

  svg:hover {
    color: ${darken(0.1, '#bbb')};
  }
`;
