import React from 'react'
import styled from 'styled-components'
import { useCopyClipboard } from '../../hooks'
import { CheckCircle } from 'react-feather'
import { StyledIcon } from '..'

const CopyIcon = styled.div`
  color: #aeaeae;
  flex-shrink: 0;
  margin-right: 1rem;
  margin-left: 0.5rem;
  text-decoration: none;
  :hover,
  :active,
  :focus {
    text-decoration: none;
    opacity: 0.8;
    cursor: pointer;
  }
`
const TransactionStatusText = styled.span`
  margin-left: 0.25rem;
  ${({ theme }) => theme.flexRowNoWrap};
  align-items: center;
  color: black;
  .copy {
    svg {
      path {
        fill: ${({ theme }) => theme.colorHeader};
      }
    }
  }
`

export default function CopyHelper({ toCopy }) {
  const [isCopied, setCopied] = useCopyClipboard()

  return (
    <CopyIcon onClick={() => setCopied(toCopy)}>
      {isCopied ? (
        <TransactionStatusText>
          <StyledIcon>
            <CheckCircle size={'18'} />
          </StyledIcon>
        </TransactionStatusText>
      ) : (
          <TransactionStatusText>
            <StyledIcon className="copy">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M0.333008 11.6667C0.333008 12.1971 0.543722 12.7058 0.918794 13.0809C1.29387 13.4559 1.80257 13.6667 2.33301 13.6667H4.33301V12.3333H2.33301C2.1562 12.3333 1.98663 12.2631 1.8616 12.1381C1.73658 12.013 1.66634 11.8435 1.66634 11.6667V2.33333C1.66634 2.15652 1.73658 1.98695 1.8616 1.86192C1.98663 1.7369 2.1562 1.66666 2.33301 1.66666H11.6663C11.8432 1.66666 12.0127 1.7369 12.1377 1.86192C12.2628 1.98695 12.333 2.15652 12.333 2.33333V4.33333H6.33301C5.80257 4.33333 5.29387 4.54404 4.91879 4.91911C4.54372 5.29419 4.33301 5.8029 4.33301 6.33333V15.6667C4.33301 16.1971 4.54372 16.7058 4.91879 17.0809C5.29387 17.4559 5.80257 17.6667 6.33301 17.6667H15.6663C16.1968 17.6667 16.7055 17.4559 17.0806 17.0809C17.4556 16.7058 17.6663 16.1971 17.6663 15.6667V6.33333C17.6663 5.8029 17.4556 5.29419 17.0806 4.91911C16.7055 4.54404 16.1968 4.33333 15.6663 4.33333H13.6663V2.33333C13.6663 1.8029 13.4556 1.29419 13.0806 0.919115C12.7055 0.544042 12.1968 0.333328 11.6663 0.333328H2.33301C1.80257 0.333328 1.29387 0.544042 0.918794 0.919115C0.543722 1.29419 0.333008 1.8029 0.333008 2.33333V11.6667ZM5.66634 6.33333C5.66634 6.15652 5.73658 5.98695 5.8616 5.86192C5.98663 5.7369 6.1562 5.66666 6.33301 5.66666H15.6663C15.8432 5.66666 16.0127 5.7369 16.1377 5.86192C16.2628 5.98695 16.333 6.15652 16.333 6.33333V15.6667C16.333 15.8435 16.2628 16.013 16.1377 16.1381C16.0127 16.2631 15.8432 16.3333 15.6663 16.3333H6.33301C6.1562 16.3333 5.98663 16.2631 5.8616 16.1381C5.73658 16.013 5.66634 15.8435 5.66634 15.6667V6.33333Z" />
              </svg>
            </StyledIcon>
          </TransactionStatusText>
        )}
    </CopyIcon>
  )
}
