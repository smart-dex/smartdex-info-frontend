import React from 'react'
import { Link as RebassLink } from 'rebass'
import { Link as RouterLink } from 'react-router-dom'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const WrappedLink = ({ external, children, ...rest }) => (
  <RebassLink
    target={external ? '_blank' : null}
    rel={external ? 'noopener noreferrer' : null}
    color="#0085FF"
    {...rest}
  >
    {children}
  </RebassLink>
)

WrappedLink.propTypes = {
  external: PropTypes.bool,
}

const Link = styled(WrappedLink)`
  color: ${({ color, theme }) => (color ? color : theme.buttonColor)};
  font-weight: 500;
  font-size: 14px;
`

export default Link

export const CustomLink = styled(RouterLink)`
  text-decoration: none;
  font-weight: 500;
  font-size: 13px;
  color: ${({ theme }) => theme.textHover};

  &:hover {
    cursor: pointer;
    text-decoration: none;
    underline: none;
  }
`

export const BasicLink = styled(RouterLink)`
  text-decoration: none;
  color: inherit;
  &:hover {
    cursor: pointer;
    text-decoration: none;
    underline: none;
  }
`
