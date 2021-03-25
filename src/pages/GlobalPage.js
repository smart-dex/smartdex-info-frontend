import React, { useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { Box } from 'rebass'
import styled from 'styled-components'

import { AutoRow, RowBetween } from '../components/Row'
import { AutoColumn } from '../components/Column'
import PairList from '../components/PairList'
import TopTokenList from '../components/TokenList'
import TxnList from '../components/TxnList'
import GlobalChart from '../components/GlobalChart'
import Search from '../components/Search'
import GlobalStats from '../components/GlobalStats'

import { useGlobalData, useGlobalTransactions } from '../contexts/GlobalData'
import { useAllPairData } from '../contexts/PairData'
import { useMedia } from 'react-use'
import Panel from '../components/Panel'
import { useAllTokenData } from '../contexts/TokenData'
import { formattedNum, formattedPercent } from '../utils'
import { TYPE } from '../Theme'
import { CustomLink } from '../components/Link'

import { PageWrapper, ContentWrapper } from '../components'

const ListOptions = styled(AutoRow)`
  height: 40px;
  width: 100%;
  font-size: 1.25rem;
  font-weight: 600;

  @media screen and (max-width: 640px) {
    font-size: 1rem;
  }
`

const GridRow = styled.div`
  margin-top: 50px;
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  column-gap: 6px;
  align-items: start;
  justify-content: space-between;
  .liquidity {
    background: ${({ theme }) => theme.backgroundChart};
    height: 100%;
    min-height: 350px;
    border-radius: 35px;
    width: calc(100% - 20px);
    border: 1px solid ${({ theme }) => theme.borderChart};
  }
  .volume {
    background: ${({ theme }) => theme.backgroundChart};
    border-radius: 35px;
    width: calc(100% - 20px);
    margin-left: 20px;
    border: 1px solid ${({ theme }) => theme.borderChart};
  }
  table {
    padding-left: 30px;
  }
`

function GlobalPage() {
  // get data for lists and totals
  const allPairs = useAllPairData()
  const allTokens = useAllTokenData()
  const transactions = useGlobalTransactions()
  const { totalLiquidityUSD, oneDayVolumeUSD, volumeChangeUSD, liquidityChangeUSD } = useGlobalData()

  // breakpoints
  const below800 = useMedia('(max-width: 800px)')

  // scrolling refs

  useEffect(() => {
    document.querySelector('body').scrollTo({
      behavior: 'smooth',
      top: 0,
    })
  }, [])

  const HeaderOverview = styled.div`
    background: ${({ theme }) => theme.backgroundTitleOver};
    display: grid;
    grid - auto - rows: auto;
    grid - row - gap: ${({ gap }) => (gap === 'sm' && '8px') || (gap === 'md' && '12px') || (gap === 'lg' && '24px') || gap};
    justify - items: ${({ justify }) => justify && justify};
    padding-top: 30px;
  `

  const StyleSearch = styled.div`
    input {
      border-radius: 50px;
      font-size: 16px;
      ::placeholder {
        font-weight: normal;
        font-size: 16px;
        line-height: 26px;
        color: ${({ theme }) => theme.placeholder};
      }
    }
  `

  const StyleTitle = styled.div`
    color: ${({ theme }) => theme.titleHeader};
    font-size: 24px;
    font-weight: 500;
  `

  const StyleLinkAll = styled.div`
    color: ${({ theme }) => theme.private};
    font-weight: bold;
    font-size: 14px;
    line-height: 17px;
  `

  const StyleNameTable = styled.div`
    color: ${({ theme }) => theme.private};
    font-weight: bold;
    font-size: 18px;
  `

  const StyledBoxMobile = styled.div`
    border: 1px solid ${({ theme }) => theme.borderItemInfo};
    padding: 1.25rem;
    margin: 20px 0;
    background: ${({ theme }) => theme.backgroundItemInfo};
    border-radius: 20px;
  `

  const StyleText = styled.div`
    font-weight: 500;
    font-size: 14px;
    color: ${({ theme }) => theme.description};
  `

  const StyleValue = styled.div`
    font-weight: bold;
    font-size: 18px;
    color: ${({ theme }) => theme.description};
  `

  return (
    <PageWrapper style={{ paddingTop: '0px' }}>
      <HeaderOverview gap="24px" style={{ paddingBottom: below800 ? '0' : '24px' }}>
        <ContentWrapper>
          <StyleTitle>{below800 ? 'Analytics' : 'SmartDEX Analytics'}</StyleTitle>
          <StyleSearch><Search /></StyleSearch>
          <GlobalStats />
        </ContentWrapper>
      </HeaderOverview>
      <ContentWrapper>
        <div>
          {below800 && ( // mobile card
            <StyledBoxMobile>
              <Panel>
                <Box>
                  <AutoColumn gap="36px">
                    <AutoColumn gap="20px">
                      <RowBetween>
                        <StyleText>Volume (24hrs)</StyleText>
                        <br />
                        <br />
                      </RowBetween>
                      <RowBetween align="flex-end">
                        <StyleValue>
                          {formattedNum(oneDayVolumeUSD, true)}
                        </StyleValue>
                        <TYPE.main fontSize={12}>{formattedPercent(volumeChangeUSD)}</TYPE.main>
                      </RowBetween>
                    </AutoColumn>
                    <AutoColumn gap="20px">
                      <RowBetween>
                        <StyleText>Total Liquidity</StyleText>
                        <br />
                        <br />
                      </RowBetween>
                      <RowBetween align="flex-end">
                        <StyleValue>
                          {formattedNum(totalLiquidityUSD, true)}
                        </StyleValue>
                        <TYPE.main fontSize={12}>{formattedPercent(liquidityChangeUSD)}</TYPE.main>
                      </RowBetween>
                    </AutoColumn>
                  </AutoColumn>
                </Box>
              </Panel>
            </StyledBoxMobile>
          )}
          {!below800 && (
            <GridRow>
              <Panel className="liquidity">
                <GlobalChart display="liquidity" />
              </Panel>
              <Panel className="volume" style={{ height: '100%' }}>
                <GlobalChart display="volume" />
              </Panel>
            </GridRow>
          )}
          {below800 && (
            <StyledBoxMobile style={{ marginTop: '6px' }} gap="24px">
              <Panel style={{ height: '100%', minHeight: '300px' }}>
                <GlobalChart display="liquidity" />
              </Panel>
            </StyledBoxMobile>
          )}
          <ListOptions gap="10px" style={{ marginTop: '2rem', marginBottom: '.5rem' }}>
            <RowBetween>
              <TYPE.main fontSize={'1.125rem'}><StyleNameTable>Top Tokens</StyleNameTable></TYPE.main>
              <CustomLink to={'/tokens'}><StyleLinkAll>See All</StyleLinkAll></CustomLink>
            </RowBetween>
          </ListOptions>
          <Panel style={{ marginTop: '15px', padding: '0' }}>
            <TopTokenList tokens={allTokens} />
          </Panel>
          <ListOptions gap="10px" style={{ marginTop: '2rem', marginBottom: '.5rem' }}>
            <RowBetween>
              <TYPE.main fontSize={'1rem'}><StyleNameTable>Top Pairs</StyleNameTable></TYPE.main>
              <CustomLink to={'/pairs'}><StyleLinkAll>See All</StyleLinkAll></CustomLink>
            </RowBetween>
          </ListOptions>
          <Panel style={{ marginTop: '6px', padding: '1.125rem 0 ' }}>
            <PairList pairs={allPairs} />
          </Panel>

          <span>
            <TYPE.main fontSize={'1.125rem'} style={{ marginTop: '2rem' }}>
              <StyleNameTable>Transactions</StyleNameTable>
            </TYPE.main>
          </span>
          <Panel style={{ margin: '1rem 0' }}>
            <TxnList transactions={transactions} />
          </Panel>
        </div>
      </ContentWrapper>
    </PageWrapper>
  )
}

export default withRouter(GlobalPage)
