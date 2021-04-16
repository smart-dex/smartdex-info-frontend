import React, { useState, useMemo, useEffect } from 'react'
import styled from 'styled-components'
import { useUserTransactions, useUserPositions, useMiningPositions } from '../contexts/User'
import TxnList from '../components/TxnList'
import Panel from '../components/Panel'
import { formattedNum } from '../utils'
import Row, { AutoRow, RowFixed, RowBetween } from '../components/Row'
import { AutoColumn } from '../components/Column'
import UserChart from '../components/UserChart'
import PairReturnsChart from '../components/PairReturnsChart'
import PositionList from '../components/PositionList'
import MiningPositionList from '../components/MiningPositionList'
import { TYPE } from '../Theme'
import { ButtonDropdown } from '../components/ButtonStyled'
import { PageWrapper, ContentWrapper, StyledIcon } from '../components'
import DoubleTokenLogo from '../components/DoubleLogo'
import Link from '../components/Link'
import { FEE_WARNING_TOKENS } from '../constants'
import { useMedia } from 'react-use'
import Search from '../components/Search'

const Header = styled.div``

const DashboardWrapper = styled.div`
  width: 100%;
`

const DropdownWrapper = styled.div`
  position: relative;
  margin-bottom: 1rem;
  border-radius: 10px;
`

const Flyout = styled.div`
  position: absolute;
  top: 63px;
  left: -1px;
  width: 100%;
  background-color: ${({ theme }) => theme.backAllPosition};
  z-index: 999;
  border-radius: 10px;
  padding-top: 4px;
  border-top: none;
`

const MenuRow = styled(Row)`
  width: 100%;
  padding: 12px 0;
  padding-left: 12px;

  :hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.bg2};
  }
`

const PanelWrapper = styled.div`
  grid-template-columns: 1fr;
  grid-template-rows: max-content;
  gap: 6px;
  display: inline-grid;
  width: 100%;
  align-items: start;
`

const Warning = styled.div`
  background-color: ${({ theme }) => theme.bg2};
  color: ${({ theme }) => theme.text1};
  padding: 1rem;
  font-weight: 600;
  border-radius: 10px;
  margin-bottom: 1rem;
  width: calc(100% - 2rem);
`

const AccountTitle = styled.span`
  font-weight: 500;
  font-size: 14px;
  line-height: 25px;
  color: ${({ theme }) => theme.textMenu};
`
const NonValue = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 25px;
  color: ${({ theme }) => theme.textMenu};
`
const TokenHeader = styled.div`
  font-weight: 500;
  font-size: 24px;
  line-height: 29px;
  color: ${({ theme }) => theme.textMenu};
`

const ViewScan = styled.div`
  font-weight: 500;
  font-size: 13px;
  line-height: 16px;
  text-decoration-line: underline;
  color: ${({ theme }) => theme.changeDark};
`

const TextAccount = styled.div`
  font-weight: 500;
  font-size: 13px;
  line-height: 16px;
  color: ${({ theme }) => theme.textMenu} !important;
  padding-left: 16px;
`

const PanelStyle = styled(Panel)``
const TitleTableStyle = styled.div`
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;
  letter-spacing: -0.04em;
  color: ${({ theme }) => theme.textMenu};
`

const NoStake = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 25px;
  letter-spacing: -0.04em;
  color: ${({ theme }) => theme.textMenu};
`

const LearnMore = styled.div`
  font-weight: bold;
  font-size: 14px;
  line-height: 25px;
  letter-spacing: -0.04em;
  text-decoration-line: underline;
  color: ${({ theme }) => theme.textHover};
  padding-top: 8px;
`

const StyleMiningPool = styled.div`
  border: 1px solid ${({ theme }) => theme.borderItemInfo};
  background: ${({ theme }) => theme.backgroundItemInfo};
  border-radius: 20px;
  box-shadow: 5px 5px 20px ${({ theme }) => theme.shadowItemInfo};
  padding: 19px 21px 27px 21px;
`

const StyleWalletStats = styled.div`
  border: 1px solid ${({ theme }) => theme.borderItemInfo};
  background: ${({ theme }) => theme.backgroundItemInfo};
  border-radius: 20px;
  box-shadow: 5px 5px 20px ${({ theme }) => theme.shadowItemInfo};
  padding: 20px 21px;
  @media screen and (max-width: 800px) {
    .style-mb {
      display: block;
      > div {
        margin: 10px 20px !Important;
      }
    }
  }
`

const StyleChart = styled.div`
  border: 1px solid ${({ theme }) => theme.borderItemInfo};
  background: ${({ theme }) => theme.backgroundItemInfo};
  border-radius: 20px;
  box-shadow: 5px 5px 20px ${({ theme }) => theme.shadowItemInfo};
  padding: 20px 21px;
`

const IconArrow = styled.span`
  margin: 0px 10px;
  svg {
    width: 8px;
    height: 12px;
    path {
      stroke: ${({ theme }) => theme.colorHeader};
    }
  }
`

const StylePosition = styled.div`
  background: ${({ theme }) => theme.backAllPosition};
  border-radius: 10px;
  button {
    padding: 15px 20px;
    color: red !important;
  }
`

function AccountPage({ account }) {
  // get data for this account
  const transactions = useUserTransactions(account)
  const positions = useUserPositions(account)
  const miningPositions = useMiningPositions(account)

  // get data for user stats
  const transactionCount = transactions?.swaps?.length + transactions?.burns?.length + transactions?.mints?.length

  // get derived totals
  let totalSwappedUSD = useMemo(() => {
    return transactions?.swaps
      ? transactions?.swaps.reduce((total, swap) => {
        return total + parseFloat(swap.amountUSD)
      }, 0)
      : 0
  }, [transactions])

  // if any position has token from fee warning list, show warning
  const [showWarning, setShowWarning] = useState(false)
  useEffect(() => {
    if (positions) {
      for (let i = 0; i < positions.length; i++) {
        if (
          FEE_WARNING_TOKENS.includes(positions[i].pair.token0.id) ||
          FEE_WARNING_TOKENS.includes(positions[i].pair.token1.id)
        ) {
          setShowWarning(true)
        }
      }
    }
  }, [positions])

  // settings for list view and dropdowns
  const hideLPContent = positions && positions.length === 0
  const [showDropdown, setShowDropdown] = useState(false)
  const [activePosition, setActivePosition] = useState()

  const dynamicPositions = activePosition ? [activePosition] : positions

  const aggregateFees = dynamicPositions?.reduce(function (total, position) {
    return total + position.fees.sum
  }, 0)

  const positionValue = useMemo(() => {
    return dynamicPositions
      ? dynamicPositions.reduce((total, position) => {
        return (
          total +
          (parseFloat(position?.liquidityTokenBalance) / parseFloat(position?.pair?.totalSupply)) *
          position?.pair?.reserveUSD
        )
      }, 0)
      : null
  }, [dynamicPositions])

  useEffect(() => {
    window.scrollTo({
      behavior: 'smooth',
      top: 0,
    })
  }, [])

  const below600 = useMedia('(max-width: 600px)')

  // adding/removing account from saved accounts
  // const [savedAccounts, addAccount, removeAccount] = useSavedAccounts()
  // const isBookmarked = savedAccounts.includes(account)
  // const handleBookmarkClick = useCallback(() => {
  //   ;(isBookmarked ? removeAccount : addAccount)(account)
  // }, [account, isBookmarked, addAccount, removeAccount])

  return (
    <PageWrapper>
      <ContentWrapper>
        <RowBetween>
          <TYPE.body>
            <AccountTitle to="/accounts">{'Accounts '}</AccountTitle>
            <IconArrow>
              <svg viewBox="0 0 9 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1L7 7L0.999999 13" stroke-width="2" />
              </svg>
            </IconArrow>
            <Link lineHeight={'145.23%'} href={'https://bscscan.com/address/' + account} target="_blank">
              {' '}
              {account?.slice(0, 42)}{' '}
            </Link>
          </TYPE.body>
          {!below600 && <Search small={true} />}
        </RowBetween>
        <Header>
          <RowBetween>
            <span>
              <TokenHeader>{account?.slice(0, 6) + '...' + account?.slice(38, 42)}</TokenHeader>
              <Link lineHeight={'145.23%'} href={'https://bscscan.com/address/' + account} target="_blank">
                <ViewScan fontSize={14}>View on BscScan</ViewScan>
              </Link>
            </span>
          </RowBetween>
        </Header>
        <DashboardWrapper>
          {showWarning && <Warning>Fees cannot currently be calculated for pairs that include AMPL.</Warning>}
          {!hideLPContent && (
            <DropdownWrapper>
              <StylePosition>
                <ButtonDropdown className="aaaaaaaaaaaaaaaaaa" width="100%" onClick={() => setShowDropdown(!showDropdown)} open={showDropdown}>
                  {!activePosition && (
                    <RowFixed>
                      <StyledIcon>
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M0 9.2H2.6076C3.06024 9.2 3.45644 8.89596 3.57355 8.45874L5.301 2.00961C5.57274 0.99511 7.02469 1.03186 7.24475 2.05882L10.1684 15.7026C10.377 16.6759 11.7245 16.7801 12.0802 15.8505L14.3791 9.84262C14.5272 9.45559 14.8987 9.2 15.3131 9.2H18"
                            stroke-width="1.5"
                          />
                        </svg>
                      </StyledIcon>
                      <TextAccount ml={'10px'}>All Positions</TextAccount>
                    </RowFixed>
                  )}
                  {activePosition && (
                    <RowFixed>
                      <DoubleTokenLogo a0={activePosition.pair.token0.id} a1={activePosition.pair.token1.id} size={16} />
                      <TYPE.body ml={'16px'}>
                        {activePosition.pair.token0.symbol}-{activePosition.pair.token1.symbol} Position
                      </TYPE.body>
                    </RowFixed>
                  )}
                </ButtonDropdown>
              </StylePosition>
              {showDropdown && (
                <Flyout>
                  <AutoColumn gap="0px">
                    {positions?.map((p, i) => {
                      if (p.pair.token1.symbol === 'WETH') {
                        p.pair.token1.symbol = 'ETH'
                      }
                      if (p.pair.token0.symbol === 'WETH') {
                        p.pair.token0.symbol = 'ETH'
                      }
                      return (
                        p.pair.id !== activePosition?.pair.id && (
                          <MenuRow
                            onClick={() => {
                              setActivePosition(p)
                              setShowDropdown(false)
                            }}
                            key={i}
                          >
                            <DoubleTokenLogo a0={p.pair.token0.id} a1={p.pair.token1.id} size={16} />
                            <TYPE.body ml={'16px'}>
                              {p.pair.token0.symbol}-{p.pair.token1.symbol} Position
                            </TYPE.body>
                          </MenuRow>
                        )
                      )
                    })}
                    {activePosition && (
                      <MenuRow
                        onClick={() => {
                          setActivePosition()
                          setShowDropdown(false)
                        }}
                      >
                        <RowFixed>
                          <StyledIcon>
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 18 18"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M0 9.2H2.6076C3.06024 9.2 3.45644 8.89596 3.57355 8.45874L5.301 2.00961C5.57274 0.99511 7.02469 1.03186 7.24475 2.05882L10.1684 15.7026C10.377 16.6759 11.7245 16.7801 12.0802 15.8505L14.3791 9.84262C14.5272 9.45559 14.8987 9.2 15.3131 9.2H18"
                                stroke="#5F5E76"
                                stroke-width="1.5"
                              />
                            </svg>
                          </StyledIcon>
                          <TYPE.body ml={'10px'}>All Positions</TYPE.body>
                        </RowFixed>
                      </MenuRow>
                    )}
                  </AutoColumn>
                </Flyout>
              )}
            </DropdownWrapper>
          )}
          {!hideLPContent && (
            <PanelStyle style={{ height: '100%', marginBottom: '1rem' }}>
              <StyleWalletStats>
                <AutoRow gap="20px" className="style-mb">
                  <AutoColumn gap="10px">
                    <RowBetween>
                      <AccountTitle>Liquidity (Including Fees)</AccountTitle>
                      <div />
                    </RowBetween>
                    <RowFixed align="flex-end">
                      <AccountTitle>
                        {positionValue
                          ? formattedNum(positionValue, true)
                          : positionValue === 0
                            ? formattedNum(0, true)
                            : '-'}
                      </AccountTitle>
                    </RowFixed>
                  </AutoColumn>
                  <AutoColumn gap="10px">
                    <RowBetween>
                      <AccountTitle>Fees Earned (Cumulative)</AccountTitle>
                      <div />
                    </RowBetween>
                    <RowFixed align="flex-end">
                      <AccountTitle color={aggregateFees && 'green'}>
                        {aggregateFees ? formattedNum(aggregateFees, true, true) : '-'}
                      </AccountTitle>
                    </RowFixed>
                  </AutoColumn>
                </AutoRow>
              </StyleWalletStats>
            </PanelStyle>
          )}
          {!hideLPContent && (
            <StyleChart>
              <PanelWrapper>
                <PanelStyle style={{ gridColumn: '1' }}>
                  {activePosition ? (
                    <PairReturnsChart account={account} position={activePosition} />
                  ) : (
                    <UserChart account={account} position={activePosition} />
                  )}
                </PanelStyle>
              </PanelWrapper>
            </StyleChart>
          )}
          <TitleTableStyle style={{ marginTop: '35px' }}>Positions</TitleTableStyle>{' '}
          <PanelStyle
            style={{
              marginTop: '15px',
            }}
          >
            <PositionList positions={positions} />
          </PanelStyle>
          <TitleTableStyle style={{ marginTop: '35px' }}>Liquidity Mining Pools</TitleTableStyle>
          <PanelStyle
            style={{
              marginTop: '15px',
            }}
          >
            {miningPositions && <MiningPositionList miningPositions={miningPositions} />}
            {!miningPositions && (
              <AutoColumn gap="8px" justify="flex-start">
                <StyleMiningPool>
                  <NoStake>No Staked Liquidity.</NoStake>
                  <AutoRow gap="8px" justify="flex-start">
                    <LearnMore>Learn More</LearnMore>{' '}
                  </AutoRow>{' '}
                </StyleMiningPool>
              </AutoColumn>
            )}
          </PanelStyle>
          <TitleTableStyle style={{ marginTop: '35px' }}>Transactions</TitleTableStyle>{' '}
          <PanelStyle
            style={{
              marginTop: '15px',
            }}
          >
            <TxnList transactions={transactions} />
          </PanelStyle>
          <TitleTableStyle style={{ marginTop: '3rem' }}>Wallet Stats</TitleTableStyle>{' '}
          <PanelStyle
            style={{
              marginTop: '15px',
            }}
          >
            <StyleWalletStats>
              <AutoRow gap="20px" className="style-mb">
                <AutoColumn gap="8px">
                  <NonValue>{totalSwappedUSD ? formattedNum(totalSwappedUSD, true) : '-'}</NonValue>
                  <AccountTitle>Total Value Swapped</AccountTitle>
                </AutoColumn>
                <AutoColumn gap="8px">
                  <NonValue>{totalSwappedUSD ? formattedNum(totalSwappedUSD * 0.002, true) : '-'}</NonValue>
                  <AccountTitle>Total Fees Paid</AccountTitle>
                </AutoColumn>
                <AutoColumn gap="8px">
                  <NonValue>{transactionCount ? transactionCount : '-'}</NonValue>
                  <AccountTitle>Total Transactions</AccountTitle>
                </AutoColumn>
              </AutoRow>
            </StyleWalletStats>
          </PanelStyle>
        </DashboardWrapper>
      </ContentWrapper>
    </PageWrapper >
  )
}

export default AccountPage
