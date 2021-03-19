import React from 'react'
import styled from 'styled-components'
import { AutoColumn } from '../Column'
import Title from '../Title'
import { BasicLink } from '../Link'
import { useMedia } from 'react-use'
import { withRouter } from 'react-router-dom'
import Link from '../Link'
import { useSessionStart } from '../../contexts/Application'
import { useDarkModeManager } from '../../contexts/LocalStorage'
import Toggle from '../Toggle'
import PinnedData from '../../components/PinnedData'

const Wrapper = styled.div`
  height: ${({ isMobile }) => (isMobile ? 'initial' : '100vh')};
  color: ${({ theme }) => theme.text1};
  position: sticky;
  top: 0px;
  z-index: 9999;
  box-sizing: border-box;
  background: ${({ theme }) => theme.backgroundMenu};
  color: ${({ theme }) => theme.bg2};

  @media screen and (max-width: 800px) {
    grid-template-columns: 1fr;
    position: relative;
  }

  @media screen and (max-width: 600px) {
    padding: 1rem;
  }
`

const Option = styled.div`
  font-weight: 500;
  font-size: 14px;
  padding: 12px 25px;
  background: ${({ activeText, theme }) => (activeText ? theme.hoverMenu : 'none')};
  color: ${({ theme, activeText }) => (activeText ? theme.textHover : theme.textMenu)};
  display: flex;
  svg path {
    fill: ${({ theme }) => theme.iconMenu};
  }
  .pair-icon path {
    stroke: ${({ theme, activeText }) => (activeText ? theme.textHover : theme.iconMenu)};
    fill: none !important;
  }
  :hover {
    background: ${({ theme }) => theme.hoverMenu};
  }
`
const OptionSave = styled.div`
  font-weight: 500;
  font-size: 14px;
  padding: 12px 25px;
  color: ${({ theme, activeText }) => (activeText ? theme.textHover : theme.textMenu)};
`
const DesktopWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
`

const MobileWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const HeaderText = styled.div`
  padding: 2px 0px;
  font-weight: normal;
  font-size: 14px;
  line-height: 143%;
  letter-spacing: -0.03em;
  display: inline-box;
  display: -webkit-inline-box;

  :hover {
    color: ${({ theme }) => theme.textHover};
  }
  a {
    color: ${({ theme, activeText }) => (activeText ? theme.textHover : theme.textMenu)};
  }
`

const Polling = styled.div`
  position: fixed;
  display: flex;
  left: 0;
  bottom: 0;
  padding: 1rem;
  color: white;
  opacity: 0.4;
  transition: opacity 0.25s ease;
  :hover {
    opacity: 1;
  }
`
const PollingDot = styled.div`
  width: 8px;
  height: 8px;
  min-height: 8px;
  min-width: 8px;
  margin-right: 0.5rem;
  margin-top: 3px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.green1};
`

const BasicLinkStyle = styled(BasicLink)`
  .active {
    svg path {
      fill: ${({ theme }) => theme.textHover};
    }
  }
`

const SaveStyle = styled.a`
  display: flex;
  justify-content: space-between;
  padding: 12px 25px;
  cursor: pointer;
`
const StyledIcon = styled.div`
  color: ${({ theme }) => theme.text2};
  path {
    stroke: ${({ theme }) => theme.iconMenu};
  }
`
const LineStyle = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.lineMenu};
  padding-top: 36px;
  margin: 16px 24px;
`

const UpdateTime = styled.div`
  font-weight: 500;
  font-size: 14px;
  color: ${({ theme }) => theme.updateText};
`

const DropIcon = styled.div`
  background-image: url('/images/dropIcon.png');
  width: 12px;
  height: 8px;
  transform: ${({ open }) => (open ? 'rotate(360deg)' : 'rotate(180deg)')};
  margin-top: 4px;
`
const AutoColumnBottom = styled(AutoColumn)`
  margin: 48px 25px;
  padding-bottom: 30px;
  display: grid;
  border-bottom: 1px solid ${({ theme }) => theme.lineMenu};
`

function SideNav({ history, savedOpen, setSavedOpen }) {
  const below1080 = useMedia('(max-width: 1080px)')

  const below1180 = useMedia('(max-width: 1180px)')

  const seconds = useSessionStart()

  const [isDark, toggleDarkMode] = useDarkModeManager()

  return (
    <Wrapper isMobile={below1080}>
      {!below1080 ? (
        <DesktopWrapper>
          <AutoColumn gap="1rem" style={{ marginTop: '1.5rem' }}>
            <Title />
            {!below1080 && (
              <AutoColumn style={{ marginTop: '1rem' }}>
                <BasicLinkStyle to="/home">
                  <Option
                    className={history.location.pathname === '/home' ? 'active' : 'no-active'}
                    activeText={history.location.pathname === '/home' ?? undefined}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ margin: '-5px 8px 0px 0px' }}
                    >
                      <path d="M20.8125 18.5625H4.6875V3.9375C4.6875 3.83437 4.60312 3.75 4.5 3.75H3.1875C3.08437 3.75 3 3.83437 3 3.9375V20.0625C3 20.1656 3.08437 20.25 3.1875 20.25H20.8125C20.9156 20.25 21 20.1656 21 20.0625V18.75C21 18.6469 20.9156 18.5625 20.8125 18.5625ZM7.16719 14.9461C7.23984 15.0188 7.35703 15.0188 7.43203 14.9461L10.6734 11.7211L13.6641 14.7305C13.7367 14.8031 13.8562 14.8031 13.9289 14.7305L20.3836 8.27813C20.4563 8.20547 20.4563 8.08594 20.3836 8.01328L19.4555 7.08516C19.4202 7.05026 19.3726 7.03069 19.323 7.03069C19.2735 7.03069 19.2259 7.05026 19.1906 7.08516L13.8 12.4734L10.8141 9.46875C10.7788 9.43386 10.7312 9.41428 10.6816 9.41428C10.632 9.41428 10.5845 9.43386 10.5492 9.46875L6.24141 13.7508C6.20651 13.786 6.18694 13.8336 6.18694 13.8832C6.18694 13.9328 6.20651 13.9804 6.24141 14.0156L7.16719 14.9461Z" />
                    </svg>
                    Overview
                  </Option>
                </BasicLinkStyle>
                <BasicLinkStyle to="/tokens">
                  <Option
                    className={
                      history.location.pathname.split('/')[1] === 'tokens' ||
                      history.location.pathname.split('/')[1] === 'token'
                        ? 'active'
                        : 'no-active'
                    }
                    activeText={
                      (history.location.pathname.split('/')[1] === 'tokens' ||
                        history.location.pathname.split('/')[1] === 'token') ??
                      undefined
                    }
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ margin: '-5px 8px 0px 0px' }}
                    >
                      <path d="M12 22.5C6.20085 22.5 1.5 17.7991 1.5 12C1.5 6.20085 6.20085 1.5 12 1.5C17.7991 1.5 22.5 6.20085 22.5 12C22.5 17.7991 17.7991 22.5 12 22.5ZM12 8.85H7.8V10.95H17.25L12 5.7V8.85ZM6.75 13.05L12 18.3V15.15H16.2V13.05H6.75Z" />
                    </svg>
                    Tokens
                  </Option>
                </BasicLinkStyle>
                <BasicLinkStyle to="/pairs">
                  <Option
                    className={
                      history.location.pathname.split('/')[1] === 'pairs' ||
                      history.location.pathname.split('/')[1] === 'pair'
                        ? 'active'
                        : 'no-active'
                    }
                    activeText={
                      (history.location.pathname.split('/')[1] === 'pairs' ||
                        history.location.pathname.split('/')[1] === 'pair') ??
                      undefined
                    }
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ margin: '-5px 8px 0px 0px' }}
                      className="pair-icon "
                    >
                      <path
                        d="M21.21 15.89C20.5738 17.3945 19.5788 18.7202 18.3119 19.7513C17.045 20.7824 15.5448 21.4874 13.9424 21.8048C12.3401 22.1221 10.6844 22.0421 9.12014 21.5718C7.55586 21.1014 6.13061 20.2551 4.969 19.1066C3.80739 17.9582 2.94479 16.5427 2.45661 14.9839C1.96843 13.4251 1.86954 11.7705 2.16857 10.1646C2.46761 8.55875 3.15547 7.05059 4.17203 5.77199C5.18858 4.49339 6.50287 3.48328 7.99999 2.82996"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                      <path
                        d="M22 12C22 10.6868 21.7414 9.38641 21.2388 8.17315C20.7363 6.95989 19.9997 5.8575 19.0711 4.92891C18.1425 4.00032 17.0401 3.26372 15.8268 2.76118C14.6136 2.25863 13.3132 1.99997 12 1.99997V12H22Z"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    Pairs
                  </Option>
                </BasicLinkStyle>

                <BasicLinkStyle to="/accounts">
                  <Option
                    className={
                      history.location.pathname.split('/')[1] === 'accounts' ||
                      history.location.pathname.split('/')[1] === 'account'
                        ? 'active'
                        : 'no-active'
                    }
                    activeText={
                      (history.location.pathname.split('/')[1] === 'accounts' ||
                        history.location.pathname.split('/')[1] === 'account') ??
                      undefined
                    }
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ margin: '-5px 8px 0px 0px' }}
                    >
                      <path d="M20 2H8C7.46957 2 6.96086 2.21071 6.58579 2.58579C6.21071 2.96086 6 3.46957 6 4V16C6 16.5304 6.21071 17.0391 6.58579 17.4142C6.96086 17.7893 7.46957 18 8 18H20C20.5304 18 21.0391 17.7893 21.4142 17.4142C21.7893 17.0391 22 16.5304 22 16V4C22 3.46957 21.7893 2.96086 21.4142 2.58579C21.0391 2.21071 20.5304 2 20 2ZM14 4.5C14.663 4.5 15.2989 4.76339 15.7678 5.23223C16.2366 5.70107 16.5 6.33696 16.5 7C16.5 7.66304 16.2366 8.29893 15.7678 8.76777C15.2989 9.23661 14.663 9.5 14 9.5C13.337 9.5 12.7011 9.23661 12.2322 8.76777C11.7634 8.29893 11.5 7.66304 11.5 7C11.5 6.33696 11.7634 5.70107 12.2322 5.23223C12.7011 4.76339 13.337 4.5 14 4.5ZM19 15H9V14.75C9 12.901 11.254 11 14 11C16.746 11 19 12.901 19 14.75V15Z" />
                      <path d="M4 8H2V20C2 21.103 2.897 22 4 22H16V20H4V8Z" />
                    </svg>
                    Accounts
                  </Option>
                </BasicLinkStyle>
                <LineStyle />
                <SaveStyle open={savedOpen} onClick={() => setSavedOpen(!savedOpen)}>
                  <div style={{ display: 'flex' }}>
                    <StyledIcon>
                      <svg width="17" height="22" viewBox="0 0 17 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M1 3.27428V19.8606C1 20.8727 2.00357 21.381 2.59061 20.6646L8.45455 13.5086L14.3185 20.6646C14.9055 21.381 15.9091 20.8738 15.9091 19.8606V3.27428C15.9091 2.67111 15.7127 2.09263 15.3632 1.66612C15.0137 1.23961 14.5397 1 14.0455 1H2.86364C2.36937 1 1.89535 1.23961 1.54585 1.66612C1.19635 2.09263 1 2.67111 1 3.27428V3.27428Z"
                          stroke-opacity="0.87"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    </StyledIcon>
                    <OptionSave style={{ paddingLeft: '12px', paddingTop: '0px' }}>Saved</OptionSave>
                  </div>
                  <DropIcon open={savedOpen} />
                </SaveStyle>
                <PinnedData open={savedOpen} setSavedOpen={setSavedOpen} />
              </AutoColumn>
            )}
          </AutoColumn>
          <AutoColumnBottom gap="0.5rem">
            <HeaderText>
              <Link href="https://pancakeswap.finance/" target="_blank">
                PancakeSwap
              </Link>
            </HeaderText>
            <HeaderText>
              <Link href="https://docs.pancakeswap.finance/" target="_blank">
                Docs
              </Link>
            </HeaderText>
            <HeaderText>
              <Link href="https://twitter.com/PancakeSwap " target="_blank">
                Twitter
              </Link>
            </HeaderText>
            <Toggle isActive={isDark} toggle={toggleDarkMode} />
          </AutoColumnBottom>

          {!below1180 && (
            <Polling style={{ marginLeft: '.5rem' }}>
              <PollingDot />
              <a href="/" style={{ color: 'red' }}>
                <UpdateTime>
                  Updated {!!seconds ? seconds + 's' : '-'} ago <br />
                </UpdateTime>
              </a>
            </Polling>
          )}
        </DesktopWrapper>
      ) : (
          <MobileWrapper>
            <Title />
          </MobileWrapper>
        )}
    </Wrapper>
  )
}

export default withRouter(SideNav)
