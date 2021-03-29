import React, { useState } from 'react'
import 'feather-icons'
import { withRouter } from 'react-router-dom'
import { Text } from 'rebass'
import styled from 'styled-components'
import Link from '../components/Link'
import Panel from '../components/Panel'
import TokenLogo from '../components/TokenLogo'
import PairList from '../components/PairList'
import Loader from '../components/LocalLoader'
import { AutoRow, RowBetween, RowFixed } from '../components/Row'
import Column from '../components/Column'
import TxnList from '../components/TxnList'
import TokenChart from '../components/TokenChart'
import { BasicLink } from '../components/Link'
import Search from '../components/Search'
import { formattedNum, formattedPercent, getPoolLink, getSwapLink, localNumber } from '../utils'
import { useTokenData, useTokenTransactions, useTokenPairs } from '../contexts/TokenData'
import { TYPE } from '../Theme'
import { useColor } from '../hooks'
import CopyHelper from '../components/Copy'
import { useMedia } from 'react-use'
import { useDataForList } from '../contexts/PairData'
import { useEffect } from 'react'
import Warning from '../components/Warning'
import { usePathDismissed, useSavedTokens } from '../contexts/LocalStorage'
import { Hover, PageWrapper, ContentWrapper, StyledIcon } from '../components'
import { PlusCircle, Bookmark } from 'react-feather'
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
  align-items: start;
  width: calc(100% - 60px);
  @media screen and (max-width: 1024px) {
    grid-template-columns: 1fr;
    padding: 20px;
    width: calc(100% - 40px);
    align-items: stretch;
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
  grid-template-columns: auto 0.2fr auto 0.2fr auto 1fr;
  column-gap: 30px;
  align-items: start;

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

const NamePair = styled.div`
  font-weight: 500;
  font-size: 24px;
  color: ${({ theme }) => theme.colorHeader};
  display: flex;
  div {
    font-weight: 500;
    font-size: 24px;
    color: ${({ theme }) => theme.colorHeader};
  }
`

const ValueTitle = styled.div`
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;
  color: ${({ theme }) => theme.colorHeader};
  display: flex;
  span {
    font-weight: 500;
    font-size: 12px;
    margin-left: 1rem;
  }
`

const ButtonAdd = styled.button`
  font-style: normal;
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.private};
  outline: none;
  
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
  outline: none;

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

const StyleInfo = styled.div`
  margin-top: 1.5rem;
  width: 100%;
  display: flex;

  .range {
    margin-left: 13px;
  }
  @media screen and (max-width: 1080px) {
    display: block;
    .range {
      margin-left: 0;
      margin-top: 13px;
    }
  }
`

const Item = styled.div`
  width: calc(33% - 10px);
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
    font-size: 24px;
    line-height: 29px;
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
  @media screen and (max-width: 1080px) {
    width: auto;
    height: auto;
    padding: 15px;
  }
`

const TitlePair = styled.div`
  font-weight: 500;
  font-size: 18px;
  color: ${({ theme }) => theme.colorHeader};
`

const ItemBottom = styled.div`
  border-radius: 20px;
  background: ${({ theme }) => theme.bgPanel};
  box-shadow: 5px 5px 20px ${({ theme }) => theme.boxShadow};
  .border-form {
    border: 1px solid ${({ theme }) => theme.borderInput};
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

function TokenPage({ address, history }) {
  const {
    id,
    name,
    symbol,
    priceUSD,
    oneDayVolumeUSD,
    totalLiquidityUSD,
    volumeChangeUSD,
    oneDayVolumeUT,
    volumeChangeUT,
    priceChangeUSD,
    liquidityChangeUSD,
    oneDayTxns,
    txnChange,
  } = useTokenData(address)

  useEffect(() => {
    document.querySelector('body').scrollTo(0, 0)
  }, [])

  // detect color from token
  const backgroundColor = useColor(id, symbol)

  const allPairs = useTokenPairs(address)

  // pairs to show in pair list
  const fetchedPairsList = useDataForList(allPairs)

  // all transactions with this token
  const transactions = useTokenTransactions(address)

  // price
  const price = priceUSD ? formattedNum(priceUSD, true) : ''
  const priceChange = priceChangeUSD ? formattedPercent(priceChangeUSD) : ''

  // volume
  const volume =
    oneDayVolumeUSD || oneDayVolumeUSD === 0
      ? formattedNum(oneDayVolumeUSD === 0 ? oneDayVolumeUT : oneDayVolumeUSD, true)
      : oneDayVolumeUSD === 0
        ? '$0'
        : '-'

  // mark if using untracked volume
  const [usingUtVolume, setUsingUtVolume] = useState(false)
  useEffect(() => {
    setUsingUtVolume(oneDayVolumeUSD === 0 ? true : false)
  }, [oneDayVolumeUSD])

  const volumeChange = formattedPercent(!usingUtVolume ? volumeChangeUSD : volumeChangeUT)

  // liquidity
  const liquidity = totalLiquidityUSD ? formattedNum(totalLiquidityUSD, true) : totalLiquidityUSD === 0 ? '$0' : '-'
  const liquidityChange = formattedPercent(liquidityChangeUSD)

  // transactions
  const txnChangeFormatted = formattedPercent(txnChange)

  const below1080 = useMedia('(max-width: 1080px)')
  const below800 = useMedia('(max-width: 800px)')
  const below600 = useMedia('(max-width: 600px)')
  const below500 = useMedia('(max-width: 500px)')

  // format for long symbol
  const LENGTH = below1080 ? 10 : 16
  const formattedSymbol = symbol?.length > LENGTH ? symbol.slice(0, LENGTH) + '...' : symbol

  const [dismissed, markAsDismissed] = usePathDismissed(history.location.pathname)
  const [savedTokens, addToken] = useSavedTokens()
  const listedTokens = useListedTokens()

  useEffect(() => {
    window.scrollTo({
      behavior: 'smooth',
      top: 0,
    })
  }, [])

  return (
    <PageWrapper>
      <Warning
        type={'token'}
        show={!dismissed && listedTokens && !listedTokens.includes(address)}
        setShow={markAsDismissed}
        address={address}
      />
      <ContentWrapper>
        <RowBetween style={{ flexWrap: 'wrap', alingItems: 'start' }}>
          <AutoRow align="flex-end" style={{ width: 'fit-content' }}>
            <TYPE.body style={{ display: 'flex' }}>
              <BasicLink to="/tokens"><StyleLinkBasiv>{'Tokens '}</StyleLinkBasiv></BasicLink>
              <IconArrow>
                <svg viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1 1L7 7L0.999999 13" stroke-width="2" />
                </svg>
              </IconArrow>
              <StyleLinkBasiv>
                {symbol}
                {'  '}
              </StyleLinkBasiv>
            </TYPE.body>
            <Link
              style={{ width: 'fit-content' }}
              color={'#0085FF'}
              external
              href={'https://bscscan.com/address/' + address}
            >
              <Text style={{ marginLeft: '.15rem' }} fontSize={'14px'} fontWeight={400}>
                ({address.slice(0, 8) + '...' + address.slice(36, 42)})
              </Text>
            </Link>
          </AutoRow>
          {!below600 && <Search small={true} />}
        </RowBetween>

        <WarningGrouping disabled={!dismissed && listedTokens && !listedTokens.includes(address)}>
          <DashboardWrapper style={{ marginTop: below1080 ? '0' : '1rem' }}>
            <RowBetween
              style={{
                flexWrap: 'wrap',
                marginBottom: '2rem',
                alignItems: 'flex-start',
              }}
            >
              <RowFixed style={{ flexWrap: 'wrap' }}>
                <RowFixed style={{ alignItems: 'baseline' }}>
                  <TokenLogo address={address} size="30px" style={{ alignSelf: 'center' }} />
                  <TYPE.main fontSize={below1080 ? '1.5rem' : '2rem'} fontWeight={500} style={{ margin: '0 1rem' }}>
                    <RowFixed gap="6px">
                      <NamePair>
                        <FormattedName text={name ? name + ' ' : ''} maxCharacters={16} style={{ marginRight: '6px' }} />{' '}
                        {formattedSymbol ? `(${formattedSymbol})` : ''}
                      </NamePair>
                    </RowFixed>
                  </TYPE.main>{' '}
                  {!below1080 && (
                    <>
                      <ValueTitle style={{ marginRight: '1rem' }}>
                        {price}
                        <span>{priceChange}</span>
                      </ValueTitle>
                    </>
                  )}
                </RowFixed>
              </RowFixed>
              <span>
                <RowFixed ml={below500 ? '0' : '2.5rem'} mt={below500 ? '1rem' : '0'}>
                  {!!!savedTokens[address] && !below800 ? (
                    <Hover onClick={() => addToken(address, symbol)}>
                      <StyledIcon>
                        <PlusCircle style={{ marginRight: '0.5rem' }} />
                      </StyledIcon>
                    </Hover>
                  ) : !below1080 ? (
                    <StyledIcon>
                      <Bookmark style={{ marginRight: '0.5rem', opacity: 0.4 }} />
                    </StyledIcon>
                  ) : (
                        <></>
                      )}
                  <Link href={getPoolLink(address)} target="_blank">
                    <ButtonAdd>+ Add Liquidity</ButtonAdd>
                  </Link>
                  <Link href={getSwapLink(address)} target="_blank">
                    <ButtonTrade>
                      Trade
                    </ButtonTrade>
                  </Link>
                </RowFixed>
              </span>
            </RowBetween>

            <>
              <StyleInfo>
                {below1080 && price && (
                  <Item className="range">
                    <div className="title">Price</div>
                    <div className="value">{price}</div>
                    <TYPE.main>
                      <div className="percent">{priceChange}</div>
                    </TYPE.main>
                  </Item>
                )}
                <Item className={below1080 && price ? "range" : ""}>
                  <div className="title">Total Liquidity</div>
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
                  <div className="title">Transactions (24hrs)</div>
                  <div className="value">{oneDayTxns ? localNumber(oneDayTxns) : oneDayTxns === 0 ? 0 : '-'}</div>
                  <TYPE.main>
                    <div className="percent">{txnChangeFormatted}</div>
                  </TYPE.main>
                </Item>
              </StyleInfo>
              <PanelWrapper style={{ marginTop: '1.5rem' }}>
                <Panel
                  style={{
                    gridColumn: below1080 ? '1' : '1/4',
                    gridRow: below1080 ? '' : '1/4',
                  }}
                >
                  <TokenChart address={address} color={backgroundColor} base={priceUSD} />
                </Panel>
              </PanelWrapper>
            </>

            <span>
              <TYPE.main fontSize={'1.125rem'} style={{ marginTop: '3rem' }}>
                <TitlePair>Top Pairs</TitlePair>
              </TYPE.main>
            </span>
            <Panel
              rounded
              style={{
                padding: '1.125rem 0 ',
              }}
            >
              {address && fetchedPairsList ? (
                <PairList color={backgroundColor} address={address} pairs={fetchedPairsList} />
              ) : (
                  <Loader />
                )}
            </Panel>
            <RowBetween mt={40} mb={'1rem'}>
              <TitlePair>Transactions</TitlePair> <div />
            </RowBetween>
            <Panel rounded>
              {transactions ? <TxnList color={backgroundColor} transactions={transactions} /> : <Loader />}
            </Panel>
            <>
              <RowBetween style={{ marginTop: '3rem' }}>
                <TitlePair>Token Information</TitlePair>{' '}
              </RowBetween>
              <ItemBottom className="item-bottom">
                <Panel
                  rounded
                  style={{
                    marginTop: '1.5rem',
                  }}
                  p={20}
                  className="border-form"
                >
                  <TokenDetailsLayout>
                    <Column>
                      <StyleTextBottom>Symbol</StyleTextBottom>
                      <StyleTextBottom style={{ marginTop: '.5rem' }} fontSize={24} fontWeight="500">
                        <FormattedName className="style-text" text={symbol} maxCharacters={12} />
                      </StyleTextBottom>
                    </Column>
                    <Column />
                    <Column>
                      <StyleTextBottom>Name</StyleTextBottom>
                      <StyleTextBottom style={{ marginTop: '.5rem' }} fontSize={24} fontWeight="500">
                        <FormattedName className="style-text" text={name} maxCharacters={16} />
                      </StyleTextBottom>
                    </Column>
                    <Column />
                    <Column>
                      <StyleTextBottom>Address</StyleTextBottom>
                      <AutoRow align="flex-end">
                        <StyleTextBottom style={{ marginTop: '.5rem' }} fontSize={24} fontWeight="500">
                          {address.slice(0, 8) + '...' + address.slice(36, 42)}
                        </StyleTextBottom>
                        <CopyHelper toCopy={address} />
                      </AutoRow>
                    </Column>
                    <Link external href={'https://bscscan.com/address/' + address}>
                      <ButtonAdd>View on BscScan
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8.6677 5.62206L18.5633 8.27359L15.9118 18.1692M4.62205 16.3226L18.5633 8.27359L4.62205 16.3226Z" stroke-width="2" />
                        </svg>
                      </ButtonAdd>
                    </Link>
                  </TokenDetailsLayout>
                </Panel>
              </ItemBottom>
            </>
          </DashboardWrapper>
        </WarningGrouping>
      </ContentWrapper>
    </PageWrapper>
  )
}

export default withRouter(TokenPage)
