import React, { useState } from 'react'
import 'feather-icons'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { ButtonLight, ButtonFaded } from '../ButtonStyled'
import { AutoRow, RowBetween } from '../Row'
import { isAddress } from '../../utils'
import { useSavedAccounts } from '../../contexts/LocalStorage'
import { AutoColumn } from '../Column'
import { TYPE } from '../../Theme'
import { Hover, StyledIcon } from '..'
import Panel from '../Panel'
import { Flex } from 'rebass'
import { useMedia } from 'react-use'

import { X } from 'react-feather'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  width: 100%;
  border-radius: 12px;
`

const Input = styled.input`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  white-space: nowrap;
  background: none;
  border: none;
  outline: none;
  padding: 15px 38px;
  border-radius: 10px;
  color: ${({ theme }) => theme.text1};
  background-color: ${({ theme }) => theme.backgroundInput};
  font-size: 16px;
  margin-right: 1rem;
  border: 1px solid ${({ theme }) => theme.bg3};

  ::placeholder {
    color: ${({ theme }) => theme.text3};
    font-size: 14px;
  }

  @media screen and (max-width: 640px) {
    ::placeholder {
      font-size: 1rem;
    }
  }
`

const AccountLink = styled.span`
  display: flex;
  cursor: pointer;
  color: ${({ theme }) => theme.textHover};
  font-size: 14px;
  font-weight: 500;
`

const DashGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 1fr;
  grid-template-areas: 'account';
  padding: 0 4px;

  > * {
    justify-content: flex-end;
  }
`
const Description = styled.div`
  font-weight: 500;
  font-size: 11px;
  color: ${({ theme }) => theme.colorMenu};
  opacity: 0.7;
  padding-top: 8px;
`
const Title = styled.div`
  font-weight: 500;
  font-size: 13px;
  color: ${({ theme }) => theme.colorMenu};
`

const SaveText = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => theme.textHover};
`

const BorderBottom = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.lineSearchAccount};
`

const NoSave = styled.div`
  font-weight: 600;
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => theme.textNoSave};
`

const BackgroundForm = styled.div`
  .backgroundSaved {
    background-color: ${({ theme }) => theme.bgPanel};
    border-radius: 20px;
    border: 1px solid ${({ theme }) => theme.borderInput};
    box-shadow: 5px 5px 20px ${({ theme }) => theme.boxShadow};
    padding: 25px 50px;
  }
`

const StyleClose = styled.div`
  margin-right: 10px;
  svg {
    stroke: ${({ theme }) => theme.colorMenu};
  }
`

function AccountSearch({ history, small }) {
  const [accountValue, setAccountValue] = useState()
  const [savedAccounts, addAccount, removeAccount] = useSavedAccounts()
  const below600 = useMedia('(max-width: 600px)')

  function handleAccountSearch() {
    if (isAddress(accountValue)) {
      history.push('/account/' + accountValue)
      if (!savedAccounts.includes(accountValue)) {
        addAccount(accountValue)
      }
    }
  }

  return (
    <AutoColumn gap={'1rem'}>
      {!small && (
        <>
          <AutoRow>
            <Wrapper>
              <Input
                placeholder="0x..."
                onChange={(e) => {
                  setAccountValue(e.target.value)
                }}
              />
            </Wrapper>
            <ButtonLight onClick={handleAccountSearch}>Load Account Details</ButtonLight>
          </AutoRow>
        </>
      )}

      <AutoColumn gap={'12px'} style={{ marginTop: '16px' }}>
        {!small && (
          <BackgroundForm>
            <Panel className="backgroundSaved">
              <BorderBottom>
                <DashGrid center={true} style={{ height: 'fit-content', padding: '0 0 1rem 0' }}>
                  <SaveText area="account">Saved Accounts</SaveText>
                </DashGrid>
              </BorderBottom>
              {savedAccounts?.length > 0 ? (
                savedAccounts.map((account) => {
                  return (
                    <DashGrid key={account} center={true} style={{ height: 'fit-content', padding: '1rem 0 0 0' }}>
                      <Flex
                        area="account"
                        justifyContent="space-between"
                        onClick={() => history.push('/account/' + account)}
                      >
                        {below600 ? <AccountLink>{account?.slice(0, 6) + '...' + account?.slice(38, 42)}</AccountLink> : <AccountLink>{account?.slice(0, 42)}</AccountLink>}
                        <Hover
                          onClick={(e) => {
                            e.stopPropagation()
                            removeAccount(account)
                          }}
                        >
                          <StyleClose>
                            <StyledIcon>
                              <X size={16} />
                            </StyledIcon>
                          </StyleClose>
                        </Hover>
                      </Flex>
                    </DashGrid>
                  )
                })
              ) : (
                  <NoSave style={{ marginTop: '1rem' }}>No saved accounts</NoSave>
                )}
            </Panel>
          </BackgroundForm>
        )}

        {small && (
          <>
            <Title>{'Accounts'}</Title>
            {savedAccounts?.length > 0 ? (
              savedAccounts.map((account) => {
                return (
                  <RowBetween key={account}>
                    <ButtonFaded onClick={() => history.push('/account/' + account)}>
                      {small ? (
                        <TYPE.header>{account?.slice(0, 6) + '...' + account?.slice(38, 42)}</TYPE.header>
                      ) : (
                          <AccountLink>{account?.slice(0, 42)}</AccountLink>
                        )}
                    </ButtonFaded>
                    <Hover onClick={() => removeAccount(account)}>
                      <StyleClose>
                        <StyledIcon>
                          <X size={16} />
                        </StyledIcon>
                      </StyleClose>
                    </Hover>
                  </RowBetween>
                )
              })
            ) : (
                <Description>No pinned wallets</Description>
              )}
          </>
        )}
      </AutoColumn>
    </AutoColumn>
  )
}

export default withRouter(AccountSearch)
