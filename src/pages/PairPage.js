import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import 'feather-icons'
import styled from 'styled-components'
import Panel from '../components/Panel'
import { PageWrapper, ContentWrapperLarge, StyledIcon } from '../components/index'
import { AutoRow, RowBetween, RowFixed } from '../components/Row'
import Column, { AutoColumn } from '../components/Column'
import PairChart from '../components/PairChart'
import Link from '../components/Link'
import TxnList from '../components/TxnList'
import Loader from '../components/LocalLoader'
import { BasicLink } from '../components/Link'
import Search from '../components/Search'
import { formattedNum, formattedPercent, getPoolLink, getSwapLink } from '../utils'
import { useColor } from '../hooks'
import { usePairData, usePairTransactions } from '../contexts/PairData'
import { TYPE } from '../Theme'
import CopyHelper from '../components/Copy'
import { useMedia } from 'react-use'
import DoubleTokenLogo from '../components/DoubleLogo'
import TokenLogo from '../components/TokenLogo'
import { Hover } from '../components'
import { useEthPrice } from '../contexts/GlobalData'
import Warning from '../components/Warning'
import { usePathDismissed, useSavedPairs } from '../contexts/LocalStorage'

import { Bookmark } from 'react-feather'
import FormattedName from '../components/FormattedName'
import { useListedTokens } from '../contexts/Application'

const DashboardWrapper = styled.div`
  width: 100%;
`

const PanelWrapper = styled.div`
  border: 1px solid ${({ theme }) => theme.borderItemInfo};
  box-shadow: 5px 5px 20px ${({ theme }) => theme.shadowItemInfo};
  background: ${({ theme }) => theme.backgroundItemInfo};
  border-radius: 20px;
  padding: 30px;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: max-content;
  gap: 6px;
  display: inline-grid;
  width: calc(100% - 60px);
  align-items: start;
  @media screen and (max-width: 1024px) {
    grid-template-columns: 1fr;
    align-items: stretch;
    padding: 20px;
    width: calc(100% - 40px);
    > * {
      grid-column: 1 / 4;
    }

    > * {
      &:first-child {
        width: 100%;
      }
    }
  }
`

const TokenDetailsLayout = styled.div`
  display: inline-grid;
  width: 100%;
  grid-template-columns: auto auto auto auto 1fr;
  column-gap: 60px;
  align-items: start;
  border: 1px solid ${({ theme }) => theme.borderPopupSearch};
  padding: 20px;
  box-shadow: 5px 5px 20px rgba(120, 118, 148, 0.08);
  border-radius: 20px;

  &:last-child {
    align-items: center;
    justify-items: end;
  }
  @media screen and (max-width: 1024px) {
    grid-template-columns: 1fr;
    align-items: stretch;
    > * {
      grid-column: 1 / 4;
      margin-bottom: 1rem;
    }

    &:last-child {
      align-items: start;
      justify-items: start;
    }
  }
`

const HoverSpan = styled.span`
  :hover {
    cursor: pointer;
    opacity: 0.7;
  }
`

const NamePair = styled.div`
  font-weight: 500;
  font-size: 24px;
  color: ${({ theme }) => theme.colorHeader};
`

const WarningGrouping = styled.div`
  opacity: ${({ disabled }) => disabled && '0.4'};
  pointer-events: ${({ disabled }) => disabled && 'none'};
`

const IconArrow = styled.div`
  margin: 0px 10px;
  svg {
    width: 8px;
    height: 12px;
    path {
      stroke: ${({ theme }) => theme.colorHeader};
    }
  }
`

const StyleLinkBasiv = styled.div`
  font-weight: 500;
  font-size: 14px;
  color: ${({ theme }) => theme.colorHeader};
`

const ButtonAdd = styled.button`
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.private};
  
  height: 56px;
  background: ${({ theme }) => theme.backgroundAdd};
  border: 1px solid ${({ theme }) => theme.private};
  border-radius: 10px;
  cursor: pointer;
  padding: 0 15px;
  svg {
    width: 20px;
    height: 20px;
    path {
      stroke: ${({ theme }) => theme.private};
    }
  }
  &:hover {
    background: ${({ theme }) => theme.private};
    color: ${({ theme }) => theme.white};
    svg {
      path {
        stroke: ${({ theme }) => theme.white};
      }
    }
  }
`

const ButtonTrade = styled.button`
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.white};

  margin-left: 14px;
  width: 100px;
  height: 56px;
  background: ${({ theme }) => theme.private};
  box-shadow: 0px 4px 10px rgba(83, 185, 234, 0.24);
  border: 1px solid ${({ theme }) => theme.private};
  border-radius: 10px;
  &:hover {
    opacity: 0.7;
  }
`

const StyledIconPlus = styled.div`
  margin-right: 14px;
  svg {
    width: 25.5px;
    height: 25.5px;
    path {
      fill: ${({ theme }) => theme.colorHeader};
    }
  }
`

const StyleExchange = styled.div`
  margin-left: 9px;
  font-weight: 500;
  font-size: 12px;
  color: ${({ theme }) => theme.private};
  line-height: 18px;
`

const StyleFormExchange = styled.div`
  display: flex;
  background: ${({ theme }) => theme.backFormExchange};
  padding: 8px;
  border-radius: 5px;
  cursor: pointer;
`

const TitlePair = styled.div`
  font-weight: 500;
  font-size: 18px;
  color: ${({ theme }) => theme.colorHeader};
`

const StyleInfo = styled.div`
  margin-top: 1.5rem;
  width: 100%;
  display: flex;

  .range {
    margin-left: 13px;
  }
  @media screen and (max-width: 1024px) {
    display: block;
    .range {
      margin-left: 0;
      margin-top: 13px;
    }
  }
`

const Item = styled.div`
  width: calc(25% - 10px);
  height: 157px;
  border: 1px solid ${({ theme }) => theme.borderItemInfo};
  box-shadow: 5px 5px 20px ${({ theme }) => theme.shadowItemInfo};
  border-radius: 20px;
  padding: 25px 0 0 21px;
  background: ${({ theme }) => theme.backgroundItemInfo};
  .title {
    font-weight: 500;
    font-size: 14px;
    line-height: 25px;
    color: ${({ theme }) => theme.colorHeader};
  }
  .value {
    font-weight: bold;
    font-size: 18px;
    line-height: 22px;
    margin-top: 17px;
    line-height: 22px;
    color: ${({ theme }) => theme.colorHeader};
    .value-token {
      color: ${({ theme }) => theme.colorHeader};
      font-weight: bold;
      font-size: 18px;
      div {
        color: ${({ theme }) => theme.colorHeader};
        font-weight: bold;
        font-size: 18px;
      }
    }
  }
  .percent {
    font-weight: 500;
    font-size: 14px;
    line-height: 25px;
    margin-top: 18px;
  }
  @media screen and (max-width: 1024px) {
    width: auto;
    height: auto;
    padding: 15px;
  }
`

const StyleTextBottom = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 25px;
  color: ${({ theme }) => theme.colorHeader};
  .style-text {
    font-weight: 500;
    font-size: 14px;
    line-height: 25px;
    color: ${({ theme }) => theme.colorHeader};
  }
`

function PairPage({ pairAddress, history }) {
  const {
    token0,
    token1,
    reserve0,
    reserve1,
    reserveUSD,
    trackedReserveUSD,
    oneDayVolumeUSD,
    volumeChangeUSD,
    oneDayVolumeUntracked,
    volumeChangeUntracked,
    liquidityChangeUSD,
  } = usePairData(pairAddress)

  useEffect(() => {
    document.querySelector('body').scrollTo(0, 0)
  }, [])

  const transactions = usePairTransactions(pairAddress)
  const backgroundColor = useColor(pairAddress)

  // liquidity
  const liquidity = trackedReserveUSD
    ? formattedNum(trackedReserveUSD, true)
    : reserveUSD
      ? formattedNum(reserveUSD, true)
      : '-'
  const liquidityChange = formattedPercent(liquidityChangeUSD)

  // mark if using untracked liquidity
  const [usingTracked, setUsingTracked] = useState(true)
  useEffect(() => {
    setUsingTracked(!trackedReserveUSD ? false : true)
  }, [trackedReserveUSD])

  // volume	  // volume
  const volume =
    oneDayVolumeUSD || oneDayVolumeUSD === 0
      ? formattedNum(oneDayVolumeUSD === 0 ? oneDayVolumeUntracked : oneDayVolumeUSD, true)
      : oneDayVolumeUSD === 0
        ? '$0'
        : '-'

  // mark if using untracked volume
  const [usingUtVolume, setUsingUtVolume] = useState(false)
  useEffect(() => {
    setUsingUtVolume(oneDayVolumeUSD === 0 ? true : false)
  }, [oneDayVolumeUSD])

  const volumeChange = formattedPercent(!usingUtVolume ? volumeChangeUSD : volumeChangeUntracked)

  // get fees	  // get fees
  const fees =
    oneDayVolumeUSD || oneDayVolumeUSD === 0
      ? usingUtVolume
        ? formattedNum(oneDayVolumeUntracked * 0.002, true)
        : formattedNum(oneDayVolumeUSD * 0.002, true)
      : '-'

  // token data for usd
  const [ethPrice] = useEthPrice()
  const token0USD =
    token0?.derivedETH && ethPrice ? formattedNum(parseFloat(token0.derivedETH) * parseFloat(ethPrice), true) : ''

  const token1USD =
    token1?.derivedETH && ethPrice ? formattedNum(parseFloat(token1.derivedETH) * parseFloat(ethPrice), true) : ''

  // rates
  const token0Rate = reserve0 && reserve1 ? formattedNum(reserve1 / reserve0) : '-'
  const token1Rate = reserve0 && reserve1 ? formattedNum(reserve0 / reserve1) : '-'

  // formatted symbols for overflow
  const formattedSymbol0 = token0?.symbol.length > 6 ? token0?.symbol.slice(0, 5) + '...' : token0?.symbol
  const formattedSymbol1 = token1?.symbol.length > 6 ? token1?.symbol.slice(0, 5) + '...' : token1?.symbol

  const below1080 = useMedia('(max-width: 1080px)')
  const below900 = useMedia('(max-width: 900px)')
  const below600 = useMedia('(max-width: 600px)')

  const [dismissed, markAsDismissed] = usePathDismissed(history.location.pathname)

  useEffect(() => {
    window.scrollTo({
      behavior: 'smooth',
      top: 0,
    })
  }, [])

  const [savedPairs, addPair] = useSavedPairs()

  const listedTokens = useListedTokens()

  return (
    <PageWrapper>
      <span />
      <Warning
        type={'pair'}
        show={!dismissed && listedTokens && !(listedTokens.includes(token0?.id) && listedTokens.includes(token1?.id))}
        setShow={markAsDismissed}
        address={pairAddress}
      />
      <ContentWrapperLarge>
        <RowBetween>
          <TYPE.body style={{ display: 'flex' }}>
            <BasicLink to="/pairs"><StyleLinkBasiv>{'Pairs '}</StyleLinkBasiv></BasicLink>
            <IconArrow>
              <svg viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L7 7L0.999999 13" stroke-width="2" />
              </svg>
            </IconArrow>
            <StyleLinkBasiv>{token0?.symbol}-{token1?.symbol}</StyleLinkBasiv>
          </TYPE.body>
          {!below600 && <Search small={true} />}
        </RowBetween>
        <WarningGrouping
          disabled={
            !dismissed && listedTokens && !(listedTokens.includes(token0?.id) && listedTokens.includes(token1?.id))
          }
        >
          <DashboardWrapper>
            <AutoColumn gap="40px" style={{ marginBottom: '1.5rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  width: '100%',
                }}
              >
                <RowFixed style={{ flexWrap: 'wrap', minWidth: '100px' }}>
                  <RowFixed>
                    {token0 && token1 && (
                      <DoubleTokenLogo a0={token0?.id || ''} a1={token1?.id || ''} size={30} margin={true} />
                    )}{' '}
                    <TYPE.main fontSize={below1080 ? '1.5rem' : '2rem'} style={{ margin: '0 1rem' }}>
                      {token0 && token1 ? (
                        <NamePair>
                          <HoverSpan onClick={() => history.push(`/token/${token0?.id}`)}>{token0.symbol}</HoverSpan>
                          <span>-</span>
                          <HoverSpan onClick={() => history.push(`/token/${token1?.id}`)}>
                            {token1.symbol}
                          </HoverSpan>{' '}
                          Pair
                        </NamePair>
                      ) : (
                          ''
                        )}
                    </TYPE.main>
                  </RowFixed>
                </RowFixed>
                <RowFixed
                  ml={below900 ? '0' : '2.5rem'}
                  mt={below1080 && '1rem'}
                >
                  {!!!savedPairs[pairAddress] && !below1080 ? (
                    <Hover onClick={() => addPair(pairAddress, token0.id, token1.id, token0.symbol, token1.symbol)}>
                      <StyledIconPlus>
                        <svg viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M13 6.625C13.2818 6.625 13.552 6.73694 13.7513 6.9362C13.9506 7.13546 14.0625 7.40571 14.0625 7.6875V11.9375H18.3125C18.5943 11.9375 18.8645 12.0494 19.0638 12.2487C19.2631 12.448 19.375 12.7182 19.375 13C19.375 13.2818 19.2631 13.552 19.0638 13.7513C18.8645 13.9506 18.5943 14.0625 18.3125 14.0625H14.0625V18.3125C14.0625 18.5943 13.9506 18.8645 13.7513 19.0638C13.552 19.2631 13.2818 19.375 13 19.375C12.7182 19.375 12.448 19.2631 12.2487 19.0638C12.0494 18.8645 11.9375 18.5943 11.9375 18.3125V14.0625H7.6875C7.40571 14.0625 7.13546 13.9506 6.9362 13.7513C6.73694 13.552 6.625 13.2818 6.625 13C6.625 12.7182 6.73694 12.448 6.9362 12.2487C7.13546 12.0494 7.40571 11.9375 7.6875 11.9375H11.9375V7.6875C11.9375 7.40571 12.0494 7.13546 12.2487 6.9362C12.448 6.73694 12.7182 6.625 13 6.625ZM0.25 13C0.25 11.3256 0.579788 9.66769 1.22054 8.12079C1.86128 6.57388 2.80044 5.16834 3.98439 3.98439C5.16834 2.80044 6.57388 1.86128 8.12079 1.22054C9.66769 0.579789 11.3256 0.25 13 0.25C14.6744 0.25 16.3323 0.579789 17.8792 1.22054C19.4261 1.86128 20.8317 2.80044 22.0156 3.98439C23.1996 5.16834 24.1387 6.57388 24.7795 8.12079C25.4202 9.66769 25.75 11.3256 25.75 13C25.75 16.3815 24.4067 19.6245 22.0156 22.0156C19.6245 24.4067 16.3815 25.75 13 25.75C9.61849 25.75 6.37548 24.4067 3.98439 22.0156C1.5933 19.6245 0.25 16.3815 0.25 13ZM13 2.375C10.1821 2.375 7.47956 3.49442 5.48699 5.48699C3.49442 7.47956 2.375 10.1821 2.375 13C2.375 15.8179 3.49442 18.5204 5.48699 20.513C7.47956 22.5056 10.1821 23.625 13 23.625C15.8179 23.625 18.5204 22.5056 20.513 20.513C22.5056 18.5204 23.625 15.8179 23.625 13C23.625 10.1821 22.5056 7.47956 20.513 5.48699C18.5204 3.49442 15.8179 2.375 13 2.375Z" />
                        </svg>
                      </StyledIconPlus>
                    </Hover>
                  ) : !below1080 ? (
                    <StyledIcon>
                      <Bookmark style={{ marginRight: '0.5rem', opacity: 0.4 }} />
                    </StyledIcon>
                  ) : (
                        <></>
                      )}

                  <Link external href={getPoolLink(token0?.id, token1?.id)}>
                    <ButtonAdd>+ Add Liquidity</ButtonAdd>
                  </Link>
                  <Link external href={getSwapLink(token0?.id, token1?.id)}>
                    <ButtonTrade>
                      Trade
                    </ButtonTrade>
                  </Link>
                </RowFixed>
              </div>
            </AutoColumn>
            <AutoRow
              gap="6px"
              style={{
                width: 'fit-content',
                marginTop: below900 ? '1rem' : '0',
                marginBottom: below900 ? '0' : '2rem',
                flexWrap: 'wrap',
              }}
            >
              <StyleFormExchange onClick={() => history.push(`/token/${token0?.id}`)}>
                <TokenLogo address={token0?.id} size={'18px'} />
                <StyleExchange>
                  {token0 && token1
                    ? `1 ${formattedSymbol0} = ${token0Rate} ${formattedSymbol1} ${parseFloat(token0?.derivedETH) ? '(' + token0USD + ')' : ''
                    }`
                    : '-'}
                </StyleExchange>
              </StyleFormExchange>
              <StyleFormExchange onClick={() => history.push(`/token/${token1?.id}`)}>
                <TokenLogo address={token1?.id} size={'18px'} />
                <StyleExchange>
                  {token0 && token1
                    ? `1 ${formattedSymbol1} = ${token1Rate} ${formattedSymbol0}  ${parseFloat(token1?.derivedETH) ? '(' + token1USD + ')' : ''
                    }`
                    : '-'}
                </StyleExchange>
              </StyleFormExchange>
            </AutoRow>
            <>
              {!below1080 && <TitlePair>Pair Stats</TitlePair>}
              <StyleInfo>
                <Item>
                  <div className="title">Total Liquidity {!usingTracked ? '(Untracked)' : ''}</div>
                  <div className="value">{liquidity}</div>
                  <TYPE.main>
                    <div className="percent">{liquidityChange}</div>
                  </TYPE.main>
                </Item>
                <Item className="range">
                  <div className="title">Volume (24hrs) {usingUtVolume && '(Untracked)'}</div>
                  <div className="value">{volume}</div>
                  <TYPE.main>
                    <div className="percent">{volumeChange}</div>
                  </TYPE.main>
                </Item>
                <Item className="range">
                  <div className="title">Fees (24hrs)</div>
                  <div className="value">{fees}</div>
                  <TYPE.main>
                    <div className="percent">{volumeChange}</div>
                  </TYPE.main>
                </Item>
                <Item className="range">
                  <div className="title">Pooled Tokens</div>
                  <div className="value">
                    <Hover onClick={() => history.push(`/token/${token0?.id}`)} fade={true}>
                      <AutoRow gap="4px">
                        <TokenLogo address={token0?.id} />
                        <TYPE.main fontSize={20} lineHeight={1} fontWeight={500}>
                          <RowFixed className="value-token">
                            {reserve0 ? formattedNum(reserve0) : ''}{' '}
                            <FormattedName text={token0?.symbol ?? ''} maxCharacters={8} margin={true} />
                          </RowFixed>
                        </TYPE.main>
                      </AutoRow>
                    </Hover>
                  </div>
                  <div className="value">
                    <Hover onClick={() => history.push(`/token/${token1?.id}`)} fade={true}>
                      <AutoRow gap="4px">
                        <TokenLogo address={token1?.id} />
                        <TYPE.main fontSize={20} lineHeight={1} fontWeight={500}>
                          <RowFixed className="value-token">
                            {reserve1 ? formattedNum(reserve1) : ''}{' '}
                            <FormattedName text={token1?.symbol ?? ''} maxCharacters={8} margin={true} />
                          </RowFixed>
                        </TYPE.main>
                      </AutoRow>
                    </Hover>
                  </div>
                </Item>
              </StyleInfo>
              <PanelWrapper style={{ marginTop: '1.5rem' }}>
                <Panel
                  style={{
                    gridColumn: below1080 ? '1' : '1/4',
                    gridRow: below1080 ? '' : '1/4',
                  }}
                >
                  <PairChart
                    address={pairAddress}
                    color={backgroundColor}
                    base0={reserve1 / reserve0}
                    base1={reserve0 / reserve1}
                  />
                </Panel>
              </PanelWrapper>
              <TYPE.main fontSize={'1.125rem'} style={{ marginTop: '3rem' }}>
                <TitlePair>Transactions</TitlePair>
              </TYPE.main>{' '}
              <Panel
                style={{
                  marginTop: '1.5rem',
                }}
              >
                {transactions ? <TxnList transactions={transactions} /> : <Loader />}
              </Panel>
              <RowBetween style={{ marginTop: '3rem' }}>
                <TitlePair>Pair Information</TitlePair>{' '}
              </RowBetween>
              <Panel
                rounded
                style={{
                  marginTop: '1.5rem',
                  border: 'none',
                  boxShadow: 'none',
                  marginLeft: '-20px'
                }}
                p={20}
              >
                <TokenDetailsLayout>
                  <Column>
                    <StyleTextBottom>Pair Name</StyleTextBottom>
                    <StyleTextBottom style={{ marginTop: '1rem' }}>
                      <RowFixed>
                        <FormattedName className="style-text" text={token0?.symbol ?? ''} maxCharacters={8} />
                        -
                        <FormattedName className="style-text" text={token1?.symbol ?? ''} maxCharacters={8} />
                      </RowFixed>
                    </StyleTextBottom>
                  </Column>
                  <Column>
                    <StyleTextBottom>Pair Address</StyleTextBottom>
                    <AutoRow align="flex-end">
                      <StyleTextBottom style={{ marginTop: '.5rem' }}>
                        {pairAddress.slice(0, 6) + '...' + pairAddress.slice(38, 42)}
                      </StyleTextBottom>
                      <CopyHelper toCopy={pairAddress} />
                    </AutoRow>
                  </Column>
                  <Column>
                    <StyleTextBottom>
                      <RowFixed>
                        <FormattedName className="style-text" text={token0?.symbol ?? ''} maxCharacters={8} />{' '}
                        <span style={{ marginLeft: '4px' }}>Address</span>
                      </RowFixed>
                    </StyleTextBottom>
                    <AutoRow align="flex-end">
                      <StyleTextBottom style={{ marginTop: '.5rem' }}>
                        {token0 && token0.id.slice(0, 6) + '...' + token0.id.slice(38, 42)}
                      </StyleTextBottom>
                      <CopyHelper toCopy={token0?.id} />
                    </AutoRow>
                  </Column>
                  <Column>
                    <StyleTextBottom>
                      <RowFixed>
                        <FormattedName className="style-text" text={token1?.symbol ?? ''} maxCharacters={8} />{' '}
                        <span style={{ marginLeft: '4px' }}>Address</span>
                      </RowFixed>
                    </StyleTextBottom>
                    <AutoRow align="flex-end">
                      <StyleTextBottom style={{ marginTop: '.5rem' }} fontSize={16}>
                        {token1 && token1.id.slice(0, 6) + '...' + token1.id.slice(38, 42)}
                      </StyleTextBottom>
                      <CopyHelper toCopy={token1?.id} />
                    </AutoRow>
                  </Column>
                  <Link color={backgroundColor} external href={'https://bscscan.com/address/' + pairAddress}>
                    <ButtonAdd>View on BscScan
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.6677 5.62206L18.5633 8.27359L15.9118 18.1692M4.62205 16.3226L18.5633 8.27359L4.62205 16.3226Z" stroke-width="2" />
                      </svg>
                    </ButtonAdd>
                  </Link>
                </TokenDetailsLayout>
              </Panel>
            </>
          </DashboardWrapper>
        </WarningGrouping>
      </ContentWrapperLarge>
    </PageWrapper>
  )
}

export default withRouter(PairPage)
