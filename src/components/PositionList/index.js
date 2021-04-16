import React, { useState, useEffect } from 'react'
import { useMedia } from 'react-use'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { Box, Flex, Text } from 'rebass'
import styled from 'styled-components'
import Link, { CustomLink } from '../Link'
import DoubleTokenLogo from '../DoubleLogo'
import { withRouter } from 'react-router-dom'
import { formattedNum, getPoolLink } from '../../utils'
import { AutoColumn } from '../Column'
import { useEthPrice } from '../../contexts/GlobalData'
import { RowFixed } from '../Row'
import { ButtonLight } from '../ButtonStyled'
import { TYPE } from '../../Theme'
import FormattedName from '../FormattedName'

dayjs.extend(utc)

const PageButtons = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2em;
  margin-bottom: 0.5em;
`

const List = styled(Box)`
  -webkit-overflow-scrolling: touch;
  .background-item {
    background: ${({ theme }) => theme.backgroundItem};
  }
`

const DashGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: 5px 0.5fr 1fr 1fr;
  grid-template-areas: 'number name pancakeswap return';
  align-items: flex-start;
  padding: 20px 1.5rem;

  > * {
    justify-content: flex-end;
    width: 100%;

    :first-child {
      justify-content: flex-start;
      text-align: left;
      width: 20px;
    }
  }

  @media screen and (min-width: 1200px) {
    grid-template-columns: 35px 2.5fr 1fr 1fr;
    grid-template-areas: 'number name pancakeswap return';
  }

  @media screen and (max-width: 740px) {
    grid-template-columns: 2.5fr 1fr 1fr;
    grid-template-areas: 'name pancakeswap return';
  }

  @media screen and (max-width: 500px) {
    grid-template-columns: 2.5fr 1fr;
    grid-template-areas: 'name pancakeswap';
  }
`

const ListWrapper = styled.div`
  .header {
    background: ${({ theme }) => theme.backgroundHeader};
    height: fit-content;
    padding: 1rem 1.5rem 1rem 1.5rem;
  }
`

const ClickableText = styled(Text)`
  font-weight: bold;
  font-size: 14px;
  color: ${({ theme }) => theme.textMenu};
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }

  text-align: end;
  user-select: none;

  svg {
    fill: ${({ theme }) => theme.textMenu};
  }
  .svg-rotate {
    transform: rotate(180deg);
  }
`

const DataText = styled(Flex)`
  align-items: center;
  text-align: center;
  color: ${({ theme }) => theme.text1};
  & > * {
    font-size: 1em;
    text-align: -webkit-right;
  }

  @media screen and (max-width: 600px) {
    font-size: 13px;
  }
`

const NoRecent = styled.div`
  font-weight: 500;
  font-size: 14px;
  line-height: 25px;
  text-align: center;
  letter-spacing: -0.04em;
  padding-top: 32px;
  padding-bottom: 8px;
  color: ${({ theme }) => theme.textMenu};
`
const TableHeader = styled.div`
  font-weight: bold;
  font-size: 14px;
  color: ${({ theme }) => theme.textMenu};
`

const TextPaging = styled.span`
  font-weight: 600;
  font-size: 13px;
  line-height: 100%;
  padding-left: 4px;
`
const PagingMiddle = styled.div`
  font-weight: 600;
  font-size: 13px;
  line-height: 16px;
  padding: 0 16px;
  color: ${({ theme }) => theme.textMenu};
`
const TextPagingNext = styled(TextPaging)`
  padding-left: 0px;
  padding-right: 6px;
`
const SelectStyle = styled.select`
  width: 65px;
  height: 39px;
  padding: 10px;
  background: #5f5e761a;
  border: 1px solid transparent;
  border-radius: 5px;
  color: ${({ theme }) => theme.textSelectPaging};
  margin-right: 4px;
  font-weight: 600;
  font-size: 13px;
  -webkit-appearance: none;
  background-image: url(${({ theme }) => theme.selectArrow});
  background-repeat: no-repeat;
  background-position-x: 70%;
  background-position-y: 16px;
  cursor: pointer;
  :focus {
    outline: none;
  }
  option {
    :hover {
      background-color: yellow !important;
    }
  }
`
const Arrow = styled.div`
  user-select: none;
  width: 45px;
  height: 16px;
  background: ${({ disableButton }) => (disableButton ? 'rgba(95, 94, 118, 0.05)' : 'rgba(95, 94, 118, 0.1)')};
  border-radius: 5px;
  padding: 12px 15px;
  :hover {
    cursor: ${({ disableButton }) => (disableButton ? 'not-allowed' : 'pointer')};
    background: ${({ disableButton, theme }) => (disableButton ? 'rgba(95, 94, 118, 0.05)' : theme.backgroundPaging)};
    svg {
      fill: ${({ disableButton, theme }) => (disableButton ? theme.textPagingDisable : theme.textHover)};
    }
    span {
      color: ${({ disableButton, theme }) => (disableButton ? theme.textPagingDisable : theme.textHover)};
    }
  }
  svg {
    fill: ${({ theme, disableButton }) => (disableButton ? theme.textPagingDisable : theme.textPaging)};
  }
  span {
    color: ${({ theme, disableButton }) => (disableButton ? theme.textPagingDisable : theme.textPaging)};
  }
`

const ArrowNext = styled(Arrow)`
  svg {
    transform: rotate(180deg);
  }
`
const SORT_FIELD = {
  VALUE: 'VALUE',
  pancakeswap_RETURN: 'pancakeswap_RETURN',
}

const listNumber = (maxPage) => {
  let listNumberPaging = []
  for (let i = 0; i < maxPage; i++) {
    listNumberPaging.push(i)
  }
  return listNumberPaging
}

function PositionList({ positions }) {
  const below500 = useMedia('(max-width: 500px)')
  const below740 = useMedia('(max-width: 740px)')

  // pagination
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const ITEMS_PER_PAGE = 10

  // sorting
  const [sortDirection, setSortDirection] = useState(true)
  const [sortedColumn, setSortedColumn] = useState(SORT_FIELD.VALUE)
  const listNumberPaging = listNumber(maxPage)

  useEffect(() => {
    setMaxPage(1) // edit this to do modular
    setPage(1)
  }, [positions])

  useEffect(() => {
    if (positions) {
      let extraPages = 1
      if (positions.length % ITEMS_PER_PAGE === 0) {
        extraPages = 0
      }
      setMaxPage(Math.floor(positions.length / ITEMS_PER_PAGE) + extraPages || 1)
    }
  }, [positions])

  const [ethPrice] = useEthPrice()

  const ListItem = ({ position, index }) => {
    const poolOwnership = position.liquidityTokenBalance / position.pair.totalSupply
    const valueUSD = poolOwnership * position.pair.reserveUSD

    return (
      <DashGrid style={{ opacity: poolOwnership > 0 ? 1 : 0.6 }} focus={true}>
        {!below740 && <DataText area="number">{index}</DataText>}
        <DataText area="name" justifyContent="flex-start" alignItems="flex-start">
          <AutoColumn gap="8px" justify="flex-start" align="flex-start">
            <DoubleTokenLogo size={16} a0={position.pair.token0.id} a1={position.pair.token1.id} margin={!below740} />
          </AutoColumn>
          <AutoColumn gap="8px" justify="flex-start" style={{ marginLeft: '20px', textAlign: '-webkit-left' }}>
            <CustomLink to={'/pair/' + position.pair.id}>
              <TYPE.main style={{ whiteSpace: 'nowrap' }} to={'/pair/'}>
                <FormattedName
                  text={position.pair.token0.symbol + '-' + position.pair.token1.symbol}
                  maxCharacters={below740 ? 10 : 18}
                />
              </TYPE.main>
            </CustomLink>

            <RowFixed gap="8px" justify="flex-start">
              <Link
                external
                href={getPoolLink(position.pair.token0.id, position.pair.token1.id)}
                style={{ marginRight: '.5rem' }}
              >
                <ButtonLight style={{ padding: '4px 6px', borderRadius: '4px' }}>Add</ButtonLight>
              </Link>
              {poolOwnership > 0 && (
                <Link external href={getPoolLink(position.pair.token0.id, position.pair.token1.id, true)}>
                  <ButtonLight style={{ padding: '4px 6px', borderRadius: '4px' }}>Remove</ButtonLight>
                </Link>
              )}
            </RowFixed>
          </AutoColumn>
        </DataText>
        <DataText area="pancakeswap">
          <AutoColumn gap="12px" justify="flex-end">
            <TYPE.main>{formattedNum(valueUSD, true, true)}</TYPE.main>
            <AutoColumn gap="4px" justify="flex-end">
              <RowFixed>
                <TYPE.small fontWeight={400}>
                  {formattedNum(poolOwnership * parseFloat(position.pair.reserve0))}{' '}
                </TYPE.small>
                <FormattedName
                  text={position.pair.token0.symbol}
                  maxCharacters={below740 ? 10 : 18}
                  margin={true}
                  fontSize={'11px'}
                />
              </RowFixed>
              <RowFixed>
                <TYPE.small fontWeight={400}>
                  {formattedNum(poolOwnership * parseFloat(position.pair.reserve1))}{' '}
                </TYPE.small>
                <FormattedName
                  text={position.pair.token1.symbol}
                  maxCharacters={below740 ? 10 : 18}
                  margin={true}
                  fontSize={'11px'}
                />
              </RowFixed>
            </AutoColumn>
          </AutoColumn>
        </DataText>
        {!below500 && (
          <DataText area="return">
            <AutoColumn gap="12px" justify="flex-end">
              <TYPE.main color={'green'}>
                <RowFixed>{formattedNum(position?.fees.sum, true, true)}</RowFixed>
              </TYPE.main>
              <AutoColumn gap="4px" justify="flex-end">
                <RowFixed>
                  <TYPE.small fontWeight={400}>
                    {parseFloat(position.pair.token0.derivedETH)
                      ? formattedNum(
                        position?.fees.sum / (parseFloat(position.pair.token0.derivedETH) * ethPrice) / 2,
                        false,
                        true
                      )
                      : 0}{' '}
                  </TYPE.small>
                  <FormattedName
                    text={position.pair.token0.symbol}
                    maxCharacters={below740 ? 10 : 18}
                    margin={true}
                    fontSize={'11px'}
                  />
                </RowFixed>
                <RowFixed>
                  <TYPE.small fontWeight={400}>
                    {parseFloat(position.pair.token1.derivedETH)
                      ? formattedNum(
                        position?.fees.sum / (parseFloat(position.pair.token1.derivedETH) * ethPrice) / 2,
                        false,
                        true
                      )
                      : 0}{' '}
                  </TYPE.small>
                  <FormattedName
                    text={position.pair.token1.symbol}
                    maxCharacters={below740 ? 10 : 18}
                    margin={true}
                    fontSize={'11px'}
                  />
                </RowFixed>
              </AutoColumn>
            </AutoColumn>
          </DataText>
        )}
      </DashGrid>
    )
  }

  const handleChangeSelect = (e) => {
    setPage(Number(e.target.value))
  }

  const positionsSorted =
    positions &&
    positions

      .sort((p0, p1) => {
        if (sortedColumn === SORT_FIELD.PRINCIPAL) {
          return p0?.principal?.usd > p1?.principal?.usd ? (sortDirection ? -1 : 1) : sortDirection ? 1 : -1
        }
        if (sortedColumn === SORT_FIELD.HODL) {
          return p0?.hodl?.sum > p1?.hodl?.sum ? (sortDirection ? -1 : 1) : sortDirection ? 1 : -1
        }
        if (sortedColumn === SORT_FIELD.pancakeswap_RETURN) {
          return p0?.pancakeswap?.return > p1?.pancakeswap?.return ? (sortDirection ? -1 : 1) : sortDirection ? 1 : -1
        }
        if (sortedColumn === SORT_FIELD.VALUE) {
          const bal0 = (p0.liquidityTokenBalance / p0.pair.totalSupply) * p0.pair.reserveUSD
          const bal1 = (p1.liquidityTokenBalance / p1.pair.totalSupply) * p1.pair.reserveUSD
          return bal0 > bal1 ? (sortDirection ? -1 : 1) : sortDirection ? 1 : -1
        }
        return 1
      })
      .slice(ITEMS_PER_PAGE * (page - 1), page * ITEMS_PER_PAGE)
      .map((position, index) => {
        return (
          <div key={index} className={index % 2 !== 0 ? 'background-item' : ''}>
            <ListItem key={index} index={(page - 1) * 10 + index + 1} position={position} />
          </div>
        )
      })

  return (
    <ListWrapper>
      <DashGrid className="header" center={true}>
        {!below740 && (
          <Flex alignItems="flex-start" justifyContent="flexStart">
            <TableHeader area="number">#</TableHeader>
          </Flex>
        )}
        <Flex alignItems="flex-start" justifyContent="flex-start">
          <TableHeader area="number">Name</TableHeader>
        </Flex>
        <Flex alignItems="center" justifyContent="flexEnd">
          <ClickableText
            area="pancakeswap"
            onClick={(e) => {
              setSortedColumn(SORT_FIELD.VALUE)
              setSortDirection(sortedColumn !== SORT_FIELD.VALUE ? true : !sortDirection)
            }}
          >
            <span style={{ paddingRight: '8px' }}>{below740 ? 'Value' : 'Liquidity'}</span>
            {sortedColumn === SORT_FIELD.VALUE ? (
              !sortDirection ? (
                <svg
                  width="10"
                  height="7"
                  viewBox="0 0 10 7"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="svg-rotate"
                >
                  <path d="M4.65726 6.15376C4.69549 6.20928 4.74663 6.25467 4.8063 6.28603C4.86596 6.31739 4.93236 6.33377 4.99976 6.33377C5.06716 6.33377 5.13356 6.31739 5.19322 6.28603C5.25289 6.25467 5.30404 6.20928 5.34226 6.15376L9.09226 0.737094C9.13567 0.674617 9.16112 0.60144 9.16586 0.525513C9.1706 0.449585 9.15443 0.373812 9.11913 0.306424C9.08383 0.239037 9.03073 0.182614 8.96561 0.143284C8.90049 0.103955 8.82584 0.0832242 8.74976 0.083344H1.24976C1.17386 0.0836575 1.09948 0.104655 1.03463 0.144079C0.96977 0.183502 0.916886 0.23986 0.881664 0.307091C0.846441 0.374322 0.830212 0.449884 0.834722 0.525649C0.839232 0.601414 0.86431 0.674516 0.90726 0.737094L4.65726 6.15376Z" />
                </svg>
              ) : (
                <svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.65726 6.15376C4.69549 6.20928 4.74663 6.25467 4.8063 6.28603C4.86596 6.31739 4.93236 6.33377 4.99976 6.33377C5.06716 6.33377 5.13356 6.31739 5.19322 6.28603C5.25289 6.25467 5.30404 6.20928 5.34226 6.15376L9.09226 0.737094C9.13567 0.674617 9.16112 0.60144 9.16586 0.525513C9.1706 0.449585 9.15443 0.373812 9.11913 0.306424C9.08383 0.239037 9.03073 0.182614 8.96561 0.143284C8.90049 0.103955 8.82584 0.0832242 8.74976 0.083344H1.24976C1.17386 0.0836575 1.09948 0.104655 1.03463 0.144079C0.96977 0.183502 0.916886 0.23986 0.881664 0.307091C0.846441 0.374322 0.830212 0.449884 0.834722 0.525649C0.839232 0.601414 0.86431 0.674516 0.90726 0.737094L4.65726 6.15376Z" />
                </svg>
              )
            ) : (
              ''
            )}
          </ClickableText>
        </Flex>
        {!below500 && (
          <Flex alignItems="center" justifyContent="flexEnd">
            <ClickableText
              area="return"
              onClick={() => {
                setSortedColumn(SORT_FIELD.pancakeswap_RETURN)
                setSortDirection(sortedColumn !== SORT_FIELD.pancakeswap_RETURN ? true : !sortDirection)
              }}
            >
              {below740 ? 'Fees' : 'Total Fees Earned'}{' '}
              {sortedColumn === SORT_FIELD.pancakeswap_RETURN ? (!sortDirection ? (
                <svg
                  width="10"
                  height="7"
                  viewBox="0 0 10 7"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="svg-rotate"
                >
                  <path d="M4.65726 6.15376C4.69549 6.20928 4.74663 6.25467 4.8063 6.28603C4.86596 6.31739 4.93236 6.33377 4.99976 6.33377C5.06716 6.33377 5.13356 6.31739 5.19322 6.28603C5.25289 6.25467 5.30404 6.20928 5.34226 6.15376L9.09226 0.737094C9.13567 0.674617 9.16112 0.60144 9.16586 0.525513C9.1706 0.449585 9.15443 0.373812 9.11913 0.306424C9.08383 0.239037 9.03073 0.182614 8.96561 0.143284C8.90049 0.103955 8.82584 0.0832242 8.74976 0.083344H1.24976C1.17386 0.0836575 1.09948 0.104655 1.03463 0.144079C0.96977 0.183502 0.916886 0.23986 0.881664 0.307091C0.846441 0.374322 0.830212 0.449884 0.834722 0.525649C0.839232 0.601414 0.86431 0.674516 0.90726 0.737094L4.65726 6.15376Z" />
                </svg>
              ) : (
                <svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.65726 6.15376C4.69549 6.20928 4.74663 6.25467 4.8063 6.28603C4.86596 6.31739 4.93236 6.33377 4.99976 6.33377C5.06716 6.33377 5.13356 6.31739 5.19322 6.28603C5.25289 6.25467 5.30404 6.20928 5.34226 6.15376L9.09226 0.737094C9.13567 0.674617 9.16112 0.60144 9.16586 0.525513C9.1706 0.449585 9.15443 0.373812 9.11913 0.306424C9.08383 0.239037 9.03073 0.182614 8.96561 0.143284C8.90049 0.103955 8.82584 0.0832242 8.74976 0.083344H1.24976C1.17386 0.0836575 1.09948 0.104655 1.03463 0.144079C0.96977 0.183502 0.916886 0.23986 0.881664 0.307091C0.846441 0.374322 0.830212 0.449884 0.834722 0.525649C0.839232 0.601414 0.86431 0.674516 0.90726 0.737094L4.65726 6.15376Z" />
                </svg>
              )) : ''}
            </ClickableText>
          </Flex>
        )}
      </DashGrid>
      <List p={0}>{positionsSorted && positionsSorted.length > 0 ? positionsSorted : <NoRecent>No recent positions found.</NoRecent>}</List>
      <PageButtons>
        <div onClick={() => setPage(page === 1 ? page : page - 1)}>
          <Arrow disableButton={page === 1 ? true : false}>
            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0 5C0 5.2652 0.10536 5.5196 0.292892 5.7071L4.29294 9.70714C4.68344 10.0976 5.31664 10.0976 5.70715 9.70714C6.09765 9.31663 6.09765 8.68343 5.70715 8.29292L2.41422 5L5.70715 1.70708C6.09765 1.31655 6.09765 0.68338 5.70715 0.292847C5.31664 -0.0976766 4.68344 -0.0976766 4.29294 0.292847L0.292892 4.29289C0.10536 4.48039 0 4.73479 0 5Z"
              />
            </svg>

            <TextPaging disableButton={page === 1 ? true : false}> Prev</TextPaging>
          </Arrow>
        </div>
        <PagingMiddle>
          <SelectStyle onChange={handleChangeSelect} value={page}>
            {listNumberPaging && listNumberPaging.map((item) => <option>{item + 1}</option>)}
          </SelectStyle>
          {'  of ' + maxPage}
        </PagingMiddle>
        <div onClick={() => setPage(page === maxPage ? page : page + 1)}>
          <ArrowNext disableButton={page === maxPage ? true : false}>
            <TextPagingNext disableButton={page === maxPage ? true : false}> Next</TextPagingNext>
            <svg width="6" height="10" viewBox="0 0 6 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M0 5C0 5.2652 0.10536 5.5196 0.292892 5.7071L4.29294 9.70714C4.68344 10.0976 5.31664 10.0976 5.70715 9.70714C6.09765 9.31663 6.09765 8.68343 5.70715 8.29292L2.41422 5L5.70715 1.70708C6.09765 1.31655 6.09765 0.68338 5.70715 0.292847C5.31664 -0.0976766 4.68344 -0.0976766 4.29294 0.292847L0.292892 4.29289C0.10536 4.48039 0 4.73479 0 5Z"
              />
            </svg>
          </ArrowNext>
        </div>
      </PageButtons>
    </ListWrapper>
  )
}

export default withRouter(PositionList)
