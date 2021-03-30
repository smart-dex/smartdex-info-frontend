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
  font-size: 28px;
  color: ${({ theme }) => theme.colorMenu};
  padding: 22px;
  @media screen and (max-width: 800px) {
    padding: 22px 22px 22px 0px;
  }
`

export default function Title() {
  const history = useHistory()

  return (
    <TitleWrapper onClick={() => history.push('/')}>
      <Flex alignItems="center">
        <RowFixed>
          <UniIcon id="link" onClick={() => history.push('/')}>
            <TitleStyle>SmartDEX</TitleStyle>
          </UniIcon>
        </RowFixed>
      </Flex>
    </TitleWrapper>
  )
}
