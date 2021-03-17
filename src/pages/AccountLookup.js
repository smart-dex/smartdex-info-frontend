import React, { useEffect } from 'react'
import 'feather-icons'
import { withRouter } from 'react-router-dom'
import { PageWrapper, FullWrapper } from '../components'
import Panel from '../components/Panel'
import LPList from '../components/LPList'
import styled from 'styled-components'
import AccountSearch from '../components/AccountSearch'
import { useTopLps } from '../contexts/GlobalData'
import LocalLoader from '../components/LocalLoader'
import { RowBetween } from '../components/Row'
import { useMedia } from 'react-use'
import Search from '../components/Search'

const AccountWrapper = styled.div`
  @media screen and (max-width: 600px) {
    width: 100%;
  }
`

const TitleStyle = styled.div`
  font-weight: 500;
  font-size: 24px;
  line-height: 29px;
  letter-spacing: -0.04em;
  color: ${({ theme }) => theme.textMenu};
`

const TitleTable = styled(TitleStyle)`
  font-size: 18px;
  line-height: 22px;
  padding-top: 45px;
`

const PanelStyle = styled(Panel)`
  border: none;
  box-shadow: none;
  background: none;
  padding: 0 0 25px 0;
`

function AccountLookup() {
  // scroll to top
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const topLps = useTopLps()

  const below600 = useMedia('(max-width: 600px)')

  return (
    <PageWrapper>
      <FullWrapper>
        <RowBetween>
          <TitleStyle>Wallet analytics</TitleStyle>
          {!below600 && <Search small={true} />}
        </RowBetween>
        <AccountWrapper>
          <AccountSearch />
        </AccountWrapper>
        <TitleTable>Top Liquidity Positions</TitleTable>
        <PanelStyle>{topLps && topLps.length > 0 ? <LPList lps={topLps} maxItems={8} /> : <LocalLoader />}</PanelStyle>
      </FullWrapper>
    </PageWrapper>
  )
}

export default withRouter(AccountLookup)
