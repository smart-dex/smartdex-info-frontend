import React from 'react'
import { ThemeProvider as StyledComponentsThemeProvider, createGlobalStyle } from 'styled-components'
import { useDarkModeManager } from '../contexts/LocalStorage'
import styled from 'styled-components'
import { Text } from 'rebass'

export default function ThemeProvider({ children }) {
  const [darkMode] = useDarkModeManager()

  return <StyledComponentsThemeProvider theme={theme(darkMode)}>{children}</StyledComponentsThemeProvider>
}

const theme = (darkMode, color) => ({
  titleTable: '#5F5E76',
  textHover: ' #0085FF',
  textColor: darkMode ? color : 'black',
  changeDark: '#17C267',

  panelColor: darkMode ? 'rgba(255, 255, 255, 0)' : 'rgba(255, 255, 255, 0)',
  backgroundColor: darkMode ? '#191326' : '#f5f3f3',

  // uniswapPink: darkMode ? '#4FD8DE' : 'black',
  uniswapPink: darkMode ? 'red' : 'black',

  concreteGray: darkMode ? '#292C2F' : '#fffdfa',
  inputBackground: darkMode ? '#1F1F1F' : '#fffdfa',
  shadowColor: darkMode ? '#000' : '#2F80ED',
  mercuryGray: darkMode ? '#333333' : '#E1E1E1',

  text1: darkMode ? '#fffdfa' : '#1F1F1F',
  text2: darkMode ? '#C3C5CB' : '#565A69',
  text3: darkMode ? '#6C7284' : '#888D9B',
  text4: darkMode ? '#565A69' : '#C3C5CB',
  text5: darkMode ? '#2C2F36' : '#EDEEF2',

  backgroundMenu: !darkMode
    ? 'linear-gradient(180deg, rgba(240, 248, 255, 0.38) 0%, rgba(232, 241, 251, 0.31) 57.44%, rgba(252, 252, 255, 0.57) 100%)'
    : '#050C21',
  textMenu: !darkMode ? '#5F5E76' : 'rgba(255, 255, 255, 0.87)',
  hoverMenu: !darkMode ? '#E9F4FC' : '#303749',
  description: darkMode ? 'rgba(255, 255, 255, 0.87)' : '#5F5E76',
  updateText: darkMode ? 'rgba(255, 255, 255, 0.38)' : 'rgba(95, 94, 118, 0.5)',
  border: darkMode ? 'rgba(91, 94, 119, 0.5)' : '#E2E2E8',
  titleHeader: darkMode ? '#FFFFFF' : '#5F5E76',
  lineMenu: darkMode ? 'rgba(91, 94, 119, 0.5)' : '#E2E2E8',
  iconMenu: darkMode ? ' rgba(255, 255, 255, 0.87)' : '#5F5E76',

  // special case text types
  white: '#FFFFFF',

  // backgrounds / greys
  bg1: darkMode ? '#212429' : '#fffdfa',
  bg2: darkMode ? '#2C2F36' : '#F7F8FA',
  bg3: darkMode ? '#40444F' : '#EDEEF2',
  bg4: darkMode ? '#565A69' : '#CED0D9',
  bg5: darkMode ? '#565A69' : '#888D9B',
  bg6: darkMode ? '#000' : '#FFFFFF',

  //specialty colors
  modalBG: darkMode ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.6)',
  advancedBG: darkMode ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.4)',
  onlyLight: darkMode ? '#22242a' : 'transparent',
  divider: darkMode ? 'rgba(43, 43, 43, 0.435)' : 'rgba(43, 43, 43, 0.035)',

  //primary colors
  primary1: darkMode ? '#2172E5' : '#4FD8DE',
  primary2: darkMode ? '#3680E7' : '#FF8CC3',
  primary3: darkMode ? '#4D8FEA' : '#FF99C9',
  primary4: darkMode ? '#376bad70' : '#F6DDE8',
  primary5: darkMode ? '#153d6f70' : '#FDEAF1',

  // color text
  primaryText1: darkMode ? '#6da8ff' : '#4FD8DE',

  // secondary colors
  secondary1: darkMode ? '#2172E5' : '#4FD8DE',
  secondary2: darkMode ? '#17000b26' : '#F6DDE8',
  secondary3: darkMode ? '#17000b26' : '#FDEAF1',

  shadow1: darkMode ? '#000' : '#2F80ED',

  // color table
  activeTransaction: darkMode ? 'rgba(255, 255, 255, 0.87)' : '#5F5E76',
  noActiveTransaction: darkMode ? 'rgba(255, 255, 255, 0.38)' : 'rgba(95, 94, 118, 0.5)',
  colorHeader: darkMode ? 'rgba(255, 255, 255, 0.87)' : '#5F5E76',
  backgroundHeader: darkMode ? '#0F162C' : '#F0F6FB',
  backgroundItem: darkMode ? '#0F162C' : '#F8FBFE',
  backgroundChart: darkMode ? '#0F162C' : '#FFFFFF',
  borderChart: darkMode ? '#0F162C' : '#E2E2E8',
  optionActive: darkMode ? '#0d2141' : '#E2E2E8',
  optionNoActive: darkMode ? '#151c31' : '#FFFFFF',
  colorTitleSearch: darkMode ? 'rgba(255, 255, 255, 0.6)' : 'rgba(95, 94, 118, 0.5)',
  backgroundPopupSearch: darkMode ? '#00071C' : '#FFFFFF',
  shadowPopupSearch: darkMode ? 'rgba(0, 0, 0, 0.05)' : 'rgba(120, 118, 148, 0.05)',

  // other
  red1: '#FF6871',
  green1: '#27AE60',
  yellow1: '#FFE270',
  yellow2: '#F3841E',
  link: '#12aab5',
  blue: '2f80ed',
  placeholder: 'rgba(95, 94, 118, 0.5)',
  private: '#0085FF',
  colorPercentPlus: '#17C267',
  colorPercentMinus: '#FF6970',

  background: darkMode ? 'black' : `radial-gradient(50% 50% at 50% 50%, #4FD8DE 30 0%, #fff 0%)`,
})

const TextWrapper = styled(Text)`
  color: ${({ color, theme }) => theme[color]};
`

export const TYPE = {
  main(props) {
    return <TextWrapper fontWeight={500} fontSize={14} color={'text1'} {...props} />
  },

  body(props) {
    return <TextWrapper fontWeight={400} fontSize={14} color={'text1'} {...props} />
  },

  small(props) {
    return <TextWrapper fontWeight={500} fontSize={11} color={'text1'} {...props} />
  },

  header(props) {
    return <TextWrapper fontWeight={600} color={'text1'} {...props} />
  },

  largeHeader(props) {
    return <TextWrapper fontWeight={500} color={'text1'} fontSize={24} {...props} />
  },

  light(props) {
    return <TextWrapper fontWeight={400} color={'text3'} fontSize={14} {...props} />
  },

  pink(props) {
    return <TextWrapper fontWeight={props.faded ? 400 : 600} color={props.faded ? 'text1' : 'text1'} {...props} />
  },
}

export const Hover = styled.div`
  :hover {
    cursor: pointer;
  }
`

export const Link = styled.a.attrs({
  target: '_blank',
  rel: 'noopener noreferrer',
})`
  text-decoration: none;
  cursor: pointer;
  color: ${({ theme }) => theme.primary1};
  font-weight: 500;
  :hover {
    text-decoration: underline;
  }
  :focus {
    outline: none;
    text-decoration: underline;
  }
  :active {
    text-decoration: none;
  }
`

export const ThemedBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  pointer-events: none;
  max-width: 100vw !important;
  height: 200vh;
  mix-blend-mode: color;
  background: ${({ backgroundColor }) =>
    `radial-gradient(50% 50% at 50% 50%, ${backgroundColor} 0%, rgba(255, 255, 255, 0) 100%)`};
  position: absolute;
  top: 0px;
  left: 0px;
  z-index: 9999;

  transform: translateY(-110vh);
`

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Kanit:wght@400;600&&family=Montserrat:wght@300;400;500;600;700;800;900&display=swap');
  html { font-family: 'Montserrat', 'Kanit', sans-serif; }
  @supports (font-variation-settings: normal) {
    html { font-family: 'Montserrat', 'Kanit', sans-serif; }
  }

  html,
  body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    font-size: 14px;
    background-color: ${({ theme }) => theme.bg6};
  }

  a {
    text-decoration: none;

    :hover {
      text-decoration: none
    }
  }


.three-line-legend {
	width: 100%;
	height: 70px;
	position: absolute;
	padding: 8px;
	font-size: 12px;
	color: #20262E;
	background-color: rgba(255, 255, 255, 0.23);
	text-align: left;
	z-index: 10;
  pointer-events: none;
}

.three-line-legend-dark {
	width: 100%;
	height: 70px;
	position: absolute;
	padding: 8px;
	font-size: 12px;
	color: white;
	background-color: rgba(255, 255, 255, 0.23);
	text-align: left;
	z-index: 10;
  pointer-events: none;
}

@media screen and (max-width: 800px) {
  .three-line-legend {
    display: none !important;
  }
}

.tv-lightweight-charts{
  width: 100% !important;


  & > * {
    width: 100% !important;
  }
}


  html {
    font-size: 1rem;
    font-variant: none;
    color: 'black';
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    height: 100%;
  }
`
