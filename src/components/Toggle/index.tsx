import React, { useState } from 'react'
import styled from 'styled-components'

const IconWrapper = styled.div<{ isActive?: boolean }>`
  opacity: ${({ isActive }) => (isActive ? 0.8 : 0.4)};
  color: ${({ isActive }) => (isActive ? '#fff' : 'black')};
  :hover {
    opacity: 1;
  }
`

const StyledToggle = styled.div`
  display: flex;
  width: fit-content;
  cursor: pointer;
  text-decoration: none;
  margin-top: 1rem;
  padding: 12px 25px;
  :hover {
    text-decoration: none;
  }
`
const SwitchStyle = styled.label`
  position: relative;
  display: inline-block;
  width: 34.45px;
  height: 20px;
  margin: 0px 8px;
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  input:focus + .slider {
    box-shadow: 0 0 1px #6fcf97;
  }
  .dark + .slider {
    background-color: #e0f3ea;
  }
  .dark + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }
  .light + .slider:before {
    left: 0;
  }
  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 50%;
  }
`

const SliderStyle = styled.span`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #1a3338;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  :before {
    position: absolute;
    content: '';
    height: 20px;
    width: 20px;
    left: -12px;
    bottom: 0px;
    background-color: #17c267;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }
`
export interface ToggleProps {
  isActive: boolean
  toggle: () => void
}

export default function Toggle({ isActive, toggle }: ToggleProps) {
  const [check, setDark] = useState(true)
  const handleClick = () => {
    setDark(!check)
    toggle()
  }
  const classChange = check ? 'dark' : 'light'
  return (
    <StyledToggle>
      <span>
        <IconWrapper isActive={isActive}>Dark</IconWrapper>
      </span>
      <SwitchStyle>
        <input type="checkbox" className={classChange} onClick={handleClick} />
        <SliderStyle className="slider round"></SliderStyle>
      </SwitchStyle>
      <span style={{ padding: '0 .5rem' }}>{'  '}</span>
      <span>
        <IconWrapper isActive={isActive}>Light</IconWrapper>
      </span>
    </StyledToggle>
  )
}
