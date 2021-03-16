import React from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { RowBetween, RowFixed } from '../Row'
import { AutoColumn } from '../Column'
import { TYPE } from '../../Theme'
import { useSavedTokens, useSavedPairs } from '../../contexts/LocalStorage'
import { Hover } from '..'
import TokenLogo from '../TokenLogo'
import AccountSearch from '../AccountSearch'
import { X } from 'react-feather'
import { ButtonFaded } from '../ButtonStyled'
import FormattedName from '../FormattedName'

const RightColumn = styled.div`
  overflow: auto;
  margin-left: 34px;
  padding-left: 16px;
  border-left: 1px solid ${({ theme }) => theme.border};
  :hover {
    cursor: pointer;
  }
`
const ScrollableDiv = styled(AutoColumn)`
  overflow: auto;
  margin-top: 32px;
`

const StyledIcon = styled.div`
  color: ${({ theme }) => theme.text2};
`
const Title = styled.div`
  font-weight: 500;
  font-size: 14px;
  color: ${({ theme }) => theme.textMenu};
`

const Description = styled.div`
  font-weight: 500;
  font-size: 11px;
  color: ${({ theme }) => theme.description};
  opacity: 0.5;
  padding-top: 8px;
`
function PinnedData({ history, open, isDark }) {
  const [savedPairs, , removePair] = useSavedPairs()
  const [savedTokens, , removeToken] = useSavedTokens()

  return !open ? (
    <RightColumn></RightColumn>
  ) : (
    <RightColumn gap="1rem">
      <AccountSearch small={true} />
      <AutoColumn gap="40px" style={{ marginTop: '2rem' }}>
        <AutoColumn gap={'12px'}>
          <Title>Pinned Pairs</Title>
          {Object.keys(savedPairs).filter((key) => {
            return !!savedPairs[key]
          }).length > 0 ? (
            Object.keys(savedPairs)
              .filter((address) => {
                return !!savedPairs[address]
              })
              .map((address) => {
                const pair = savedPairs[address]
                return (
                  <RowBetween key={pair.address}>
                    <ButtonFaded onClick={() => history.push('/pair/' + address)}>
                      <RowFixed>
                        <TYPE.header>
                          <FormattedName
                            text={pair.token0Symbol + '/' + pair.token1Symbol}
                            maxCharacters={12}
                            fontSize={'12px'}
                          />
                        </TYPE.header>
                      </RowFixed>
                    </ButtonFaded>
                    <Hover onClick={() => removePair(pair.address)}>
                      <StyledIcon>
                        <X size={16} />
                      </StyledIcon>
                    </Hover>
                  </RowBetween>
                )
              })
          ) : (
            <Description>Pinned pairs will appear here.</Description>
          )}
        </AutoColumn>
        <ScrollableDiv gap={'12px'}>
          <Title>Pinned Tokens</Title>
          {Object.keys(savedTokens).filter((key) => {
            return !!savedTokens[key]
          }).length > 0 ? (
            Object.keys(savedTokens)
              .filter((address) => {
                return !!savedTokens[address]
              })
              .map((address) => {
                const token = savedTokens[address]
                return (
                  <RowBetween key={address}>
                    <ButtonFaded onClick={() => history.push('/token/' + address)}>
                      <RowFixed>
                        <TokenLogo address={address} size={'14px'} />
                        <TYPE.header ml={'6px'}>
                          <FormattedName text={token.symbol} maxCharacters={12} fontSize={'12px'} />
                        </TYPE.header>
                      </RowFixed>
                    </ButtonFaded>
                    <Hover onClick={() => removeToken(address)}>
                      <StyledIcon>
                        <X size={16} />
                      </StyledIcon>
                    </Hover>
                  </RowBetween>
                )
              })
          ) : (
            <Description>Pinned tokens will appear here.</Description>
          )}
        </ScrollableDiv>
      </AutoColumn>
    </RightColumn>
  )
}

export default withRouter(PinnedData)
