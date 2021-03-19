import React from 'react'
import 'feather-icons'
import styled from 'styled-components'
import { RowFixed } from '../Row'
import { AutoColumn } from '../Column'
import { Hover } from '..'
import Link from '../Link'
import { useMedia } from 'react-use'

const WarningWrapper = styled.div`
  border-radius: 20px;
  border: 1px solid #f82d3a;
  background: ${({ theme }) => theme.backgroundError};
  padding: 30px 24px 28px 26px;
  color: #f82d3a;
  display: ${({ show }) => !show && 'none'};
  margin: 0 2rem 2rem 2rem;
  position: relative;

  @media screen and (max-width: 800px) {
    width: 80% !important;
    margin-left: 5%;
  }
`

const StyleHeader = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  color: ${({ theme }) => theme.colorError};
`

const StyleText = styled.div`
  margin-top: 10px;
  font-weight: normal;
  font-size: 14px;
  line-height: 143%;
  color: ${({ theme }) => theme.colorError};
`

const StyleLink = styled.div`
  font-weight: 600;
  font-size: 14px;
  text-decoration-line: underline;
  line-height: 25px;
  color: ${({ theme }) => theme.colorPercentPlus};
`

const ButtonUnderstand = styled.button`
  margin-top: 20px;
  font-weight: 600;
  font-size: 16px;
  color: ${({ theme }) => theme.white};
  padding: 18px 22px;
  height: 56px;
  background: ${({ theme }) => theme.colorError};
  box-shadow: 0px 4px 10px rgba(255, 105, 112, 0.24);
  border: 1px solid ${({ theme }) => theme.colorError};
  border-radius: 10px;
  &:hover {
    background: ${({ theme }) => theme.white};
    color: ${({ theme }) => theme.colorError};
  }
`

export default function Warning({ type, show, setShow, address }) {
  const below800 = useMedia('(max-width: 800px)')

  const textContent = below800 ? (
    <div>
      <StyleText>
        Anyone can create and name any BEP20 token on BSC, including creating fake versions of existing tokens and
        tokens that claim to represent projects that do not have a token.
      </StyleText>
      <StyleText>
        Similar to BscScan, this site automatically tracks analytics for all BEP20 tokens independent of token
        integrity. Please do your own research before interacting with any BEP20 token.
      </StyleText>
    </div>
  ) : (
      <StyleText>
        Anyone can create and name any BEP20 token on BSC, including creating fake versions of existing tokens and tokens
        that claim to represent projects that do not have a token. Similar to BscScan, this site automatically tracks
        analytics for all BEP20 tokens independent of token integrity. Please do your own research before interacting with
        any BEP20 token.
      </StyleText>
    )

  return (
    <WarningWrapper show={show}>
      <AutoColumn gap="4px">
        <RowFixed>
          <StyleHeader>Token Safety Alert</StyleHeader>
        </RowFixed>
        {textContent}
        {below800 ? (
          <div>
            <Hover style={{ marginTop: '10px' }}>
              <Link
                href={'https://bscscan.com/address/' + address}
                target="_blank"
              >
                <StyleLink>View {type === 'token' ? 'token' : 'pair'} contract on BscScan</StyleLink>
              </Link>
            </Hover>
            <ButtonUnderstand onClick={() => setShow(false)}>
              I understand
            </ButtonUnderstand>
          </div>
        ) : (
            <div style={{ marginTop: '12px' }}>
              <Hover>
                <Link
                  href={'https://bscscan.com/address/' + address}
                  target="_blank"
                >
                  <StyleLink>View {type === 'token' ? 'token' : 'pair'} contract on BscScan</StyleLink>
                </Link>
              </Hover>
              <ButtonUnderstand onClick={() => setShow(false)}>
                I understand
              </ButtonUnderstand>
            </div>
          )}
      </AutoColumn>
    </WarningWrapper>
  )
}
