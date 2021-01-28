import React from 'react';

import styled from 'styled-components';

export default function Loader() {
  return (
    <Container>
      <div className="loading-spinner-rolling">
        <div className="spinner">
          <div />
        </div>
      </div>
    </Container>
  );
}

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  flex: 1;
  @keyframes spinner {
    0% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
  .spinner div {
    position: absolute;
    width: 30px;
    height: 30px;
    border: 5px solid ${({ theme }) => theme.colors.primary};
    border-top-color: transparent;
    border-radius: 50%;
  }
  .spinner div {
    animation: spinner 1s linear infinite;
    top: 50px;
    left: 50px;
  }
  .loading-spinner-rolling {
    width: 100px;
    height: 100px;
    display: inline-block;
    overflow: hidden;
    background: none;
  }
  .spinner {
    width: 100%;
    height: 100%;
    position: relative;
    transform: translateZ(0) scale(1);
    backface-visibility: hidden;
    transform-origin: 0 0; /* see note above */
  }
  .spinner div {
    box-sizing: content-box;
  }
`;
