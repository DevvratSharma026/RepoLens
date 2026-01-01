import React from 'react'
import styled from 'styled-components';

const NewReviewButton = ({ props, onClick }) => {
  return (
     <StyledWrapper>
      <button id="btn" onClick={onClick}>
        {props}
      </button>
    </StyledWrapper>
  )
}

const StyledWrapper = styled.div`
  button {
    padding: 10px 20px;
    text-transform: uppercase;
    border-radius: 8px;
    font-size: 17px;
    font-weight: 500;
    color: #ffff;
    text-shadow: none;
    background: rgb(7, 46, 120);
    box-shadow: transparent;
    border: 1px solid #ffffff80;
    transition: 0.5s ease;
    user-select: none;
    cursor: pointer;
  }

  #btn:hover,:focus {
    color: #ffffff;
    background: #008cff;
    border: 1px solid #008cff;
    text-shadow: 0 0 5px #ffffff,
                0 0 10px #ffffff,
                0 0 20px #ffffff;
    box-shadow: 0 0 5px #008cff,
                0 0 10px #008cff,
                0 0 20px #008cff,
                0 0 30px #008cff;
    font-size: 16px;
    border-color: transparent;
  }`;

export default NewReviewButton