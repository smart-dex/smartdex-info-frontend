import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { Flex } from 'rebass'
import Link from '../Link'
import { RowFixed } from '../Row'

const TitleWrapper = styled.div`
  text-decoration: none;

  &:hover {
    cursor: pointer;
  }

  z-index: 10;
`

const UniIcon = styled(Link)``

const TitleStyle = styled.div`
  font-weight: 800;
  font-size: 26px;
  color: ${({ theme }) => theme.titleHeader};
  padding: 22px;
`

export default function Title() {
  const history = useHistory()

  return (
    <TitleWrapper onClick={() => history.push('/')}>
      <Flex alignItems="center">
        <RowFixed>
          <UniIcon id="link" onClick={() => history.push('/')}>
            <TitleStyle>PancakeSwap</TitleStyle>
          </UniIcon>
        </RowFixed>
      </Flex>
    </TitleWrapper>
  )
}
