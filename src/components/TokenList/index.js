import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { Box, Flex, Text } from 'rebass'
import TokenLogo from '../TokenLogo'
import { CustomLink } from '../Link'
import Row from '../Row'
import { formattedNum, formattedPercent } from '../../utils'
import { useMedia } from 'react-use'
import { withRouter } from 'react-router-dom'
import { OVERVIEW_TOKEN_BLACKLIST } from '../../constants'
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
  grid-template-columns: 100px 1fr 1fr;
  grid-template-areas: 'name liq vol';
  padding: 0 1.125rem 0 2.25rem;

  > * {
    justify-content: flex-end;

    &:first-child {
      justify-content: flex-start;
      text-align: left;
      width: 100px;
    }
  }

  @media screen and (min-width: 680px) {
    display: grid;
    grid-gap: 1em;
    grid-template-columns: 180px 1fr 1fr 1fr;
    grid-template-areas: 'name symbol liq vol ';

    > * {
      justify-content: flex-end;
      width: 100%;

      &:first-child {
        justify-content: flex-start;
      }
    }
  }

  @media screen and (min-width: 1080px) {
    display: grid;
    grid-gap: 0.5em;
    grid-template-columns: 1.5fr 0.6fr 1fr 1fr 1fr 1fr;
    grid-template-areas: 'name symbol liq vol price change';
  }
`

const ListWrapper = styled.div`
  .header {
    background: ${({ theme }) => theme.backgroundHeader};
    height: fit-content;
    padding: 1rem 1.125rem 1rem 2.5rem;
  }
`

const ClickableText = styled(Text)`
  text-align: end;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
  user-select: none;
  color: ${({ theme }) => theme.text1};

  @media screen and (max-width: 640px) {
    font-size: 0.85rem;
  }
`

const DataText = styled(Flex)`
  align-items: center;
  text-align: right;
  color: ${({ theme }) => theme.colorHeader};
  font-size: 13px;
  .text-uppercase {
    color: ${({ theme }) => theme.colorHeader};
  }
`

const StyleDataLink = styled.div`
  color: ${({ theme }) => theme.private};
  font-weight: 500;
  font-size: 13px;
`

const StyleHeader = styled.div`
  font-weight: bold;
  font-size: 14px;
  color: ${({ theme }) => theme.activeTransaction};
  svg {
    width: 10px;
    height: 7px;
    path {
      fill: ${({ theme }) => theme.activeTransaction};
    }
  }
  .transform-svg {
    transform: rotate(180deg);
  }
`

const SORT_FIELD = {
  LIQ: 'totalLiquidityUSD',
  VOL: 'oneDayVolumeUSD',
  SYMBOL: 'symbol',
  NAME: 'name',
  PRICE: 'priceUSD',
  CHANGE: 'priceChangeUSD',
}

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
  background: ${({ theme }) => theme.backgroundSelect};
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
  option {
    background: ${({ theme }) => theme.backgroundOption};
    :hover {
      background-color: yellow !important;
    }
  }
  :focus {
    outline: none;
  }
`

const listNumber = (maxPage) => {
  let listNumberPaging = []
  for (let i = 0; i < maxPage; i++) {
    listNumberPaging.push(i)
  }
  return listNumberPaging
}

// @TODO rework into virtualized list
function TopTokenList({ tokens, itemMax = 10 }) {
  // page state
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const listNumberPaging = listNumber(maxPage)

  // sorting
  const [sortDirection, setSortDirection] = useState(true)
  const [sortedColumn, setSortedColumn] = useState(SORT_FIELD.LIQ)

  const below1080 = useMedia('(max-width: 1080px)')
  const below680 = useMedia('(max-width: 680px)')
  const below600 = useMedia('(max-width: 600px)')

  useEffect(() => {
    setMaxPage(1) // edit this to do modular
    setPage(1)
  }, [tokens])

  const formattedTokens = useMemo(() => {
    return (
      tokens &&
      Object.keys(tokens)
        .filter((key) => {
          return !OVERVIEW_TOKEN_BLACKLIST.includes(key)
        })
        .map((key) => tokens[key])
    )
  }, [tokens])

  useEffect(() => {
    if (tokens && formattedTokens) {
      let extraPages = 1
      if (formattedTokens.length % itemMax === 0) {
        extraPages = 0
      }
      setMaxPage(Math.floor(formattedTokens.length / itemMax) + extraPages)
    }
  }, [tokens, formattedTokens, itemMax])

  const filteredList = useMemo(() => {
    return (
      formattedTokens &&
      formattedTokens
        .sort((a, b) => {
          if (sortedColumn === SORT_FIELD.SYMBOL || sortedColumn === SORT_FIELD.NAME) {
            return a[sortedColumn] > b[sortedColumn] ? (sortDirection ? -1 : 1) * 1 : (sortDirection ? -1 : 1) * -1
          }
          return parseFloat(a[sortedColumn]) > parseFloat(b[sortedColumn])
            ? (sortDirection ? -1 : 1) * 1
            : (sortDirection ? -1 : 1) * -1
        })
        .slice(itemMax * (page - 1), page * itemMax)
    )
  }, [formattedTokens, itemMax, page, sortDirection, sortedColumn])

  const SortDesc = () => {
    return (
      <svg viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.65751 6.15367C4.69573 6.20919 4.74688 6.25458 4.80654 6.28594C4.86621 6.3173 4.9326 6.33368 5 6.33368C5.06741 6.33368 5.1338 6.3173 5.19347 6.28594C5.25313 6.25458 5.30428 6.20919 5.3425 6.15367L9.09251 0.737002C9.13591 0.674526 9.16137 0.601349 9.1661 0.525421C9.17084 0.449494 9.15468 0.37372 9.11937 0.306333C9.08407 0.238946 9.03097 0.182522 8.96585 0.143193C8.90073 0.103864 8.82608 0.0831326 8.75001 0.0832525H1.25C1.17411 0.083566 1.09973 0.104564 1.03487 0.143987C0.970014 0.18341 0.91713 0.239768 0.881908 0.307C0.846685 0.374231 0.830456 0.449792 0.834966 0.525557C0.839476 0.601322 0.864555 0.674424 0.907504 0.737002L4.65751 6.15367Z" />
      </svg>
    )
  }

  const SortEsc = () => {
    return (
      <svg className="transform-svg" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4.65751 6.15367C4.69573 6.20919 4.74688 6.25458 4.80654 6.28594C4.86621 6.3173 4.9326 6.33368 5 6.33368C5.06741 6.33368 5.1338 6.3173 5.19347 6.28594C5.25313 6.25458 5.30428 6.20919 5.3425 6.15367L9.09251 0.737002C9.13591 0.674526 9.16137 0.601349 9.1661 0.525421C9.17084 0.449494 9.15468 0.37372 9.11937 0.306333C9.08407 0.238946 9.03097 0.182522 8.96585 0.143193C8.90073 0.103864 8.82608 0.0831326 8.75001 0.0832525H1.25C1.17411 0.083566 1.09973 0.104564 1.03487 0.143987C0.970014 0.18341 0.91713 0.239768 0.881908 0.307C0.846685 0.374231 0.830456 0.449792 0.834966 0.525557C0.839476 0.601322 0.864555 0.674424 0.907504 0.737002L4.65751 6.15367Z" />
      </svg>
    )
  }

  const handleChangeSelect = (e) => {
    setPage(Number(e.target.value))
  }

  const ListItem = ({ item, index }) => {
    return (
      <DashGrid style={{ height: '48px' }} focus={true}>
        <DataText area="name" fontWeight="500">
          <Row>
            {!below680 && <div style={{ marginRight: '1rem', width: '10px' }}>{index}</div>}
            <TokenLogo address={item.id} />
            <CustomLink style={{ marginLeft: '16px', whiteSpace: 'nowrap' }} to={'/token/' + item.id}>
              <StyleDataLink>
                <FormattedName
                  text={below680 ? item.symbol : item.name}
                  maxCharacters={below600 ? 8 : 16}
                  adjustSize={true}
                  link={true}
                />
              </StyleDataLink>
            </CustomLink>
          </Row>
        </DataText>
        {!below680 && (
          <DataText area="symbol" color="text" fontWeight="500">
            <FormattedName className="text-uppercase" text={item.symbol.toUpperCase()} maxCharacters={5} />
          </DataText>
        )}
        <DataText area="liq">{formattedNum(item.totalLiquidityUSD, true)}</DataText>
        <DataText area="vol">{formattedNum(item.oneDayVolumeUSD, true)}</DataText>
        {!below1080 && (
          <DataText area="price" color="text" fontWeight="500">
            {formattedNum(item.priceUSD, true)}
          </DataText>
        )}
        {!below1080 && <DataText area="change">{formattedPercent(item.priceChangeUSD)}</DataText>}
      </DashGrid>
    )
  }

  return (
    <ListWrapper>
      <DashGrid className="header" center={true}>
        <Flex alignItems="center" justifyContent="flexStart">
          <ClickableText
            area="name"
            onClick={(e) => {
              setSortedColumn(SORT_FIELD.NAME)
              setSortDirection(sortedColumn !== SORT_FIELD.NAME ? true : !sortDirection)
            }}
          >
            <StyleHeader style={{ marginLeft: !below680 ? '1.1rem' : '0px' }}>{below680 ? 'Symbol' : 'Name'} {sortedColumn === SORT_FIELD.NAME ? (!sortDirection ? <SortEsc /> : <SortDesc />) : ''}</StyleHeader>
          </ClickableText>
        </Flex>
        {!below680 && (
          <Flex alignItems="center">
            <ClickableText
              area="symbol"
              onClick={(e) => {
                setSortedColumn(SORT_FIELD.SYMBOL)
                setSortDirection(sortedColumn !== SORT_FIELD.SYMBOL ? true : !sortDirection)
              }}
            >
              <StyleHeader>Symbol {sortedColumn === SORT_FIELD.SYMBOL ? (!sortDirection ? <SortEsc /> : <SortDesc />) : ''}</StyleHeader>
            </ClickableText>
          </Flex>
        )}

        <Flex alignItems="center">
          <ClickableText
            area="liq"
            onClick={(e) => {
              setSortedColumn(SORT_FIELD.LIQ)
              setSortDirection(sortedColumn !== SORT_FIELD.LIQ ? true : !sortDirection)
            }}
          >
            <StyleHeader>Liquidity {sortedColumn === SORT_FIELD.LIQ ? (!sortDirection ? <SortEsc /> : <SortDesc />) : ''}</StyleHeader>
          </ClickableText>
        </Flex>
        <Flex alignItems="center">
          <ClickableText
            area="vol"
            onClick={(e) => {
              setSortedColumn(SORT_FIELD.VOL)
              setSortDirection(sortedColumn !== SORT_FIELD.VOL ? true : !sortDirection)
            }}
          >
            <StyleHeader>
              Volume (24hrs)
              {sortedColumn === SORT_FIELD.VOL ? (!sortDirection ? <SortEsc /> : <SortDesc />) : ''}
            </StyleHeader>
          </ClickableText>
        </Flex>
        {!below1080 && (
          <Flex alignItems="center">
            <ClickableText
              area="price"
              onClick={(e) => {
                setSortedColumn(SORT_FIELD.PRICE)
                setSortDirection(sortedColumn !== SORT_FIELD.PRICE ? true : !sortDirection)
              }}
            >
              <StyleHeader>Price {sortedColumn === SORT_FIELD.PRICE ? (!sortDirection ? <SortEsc /> : <SortDesc />) : ''}</StyleHeader>
            </ClickableText>
          </Flex>
        )}
        {!below1080 && (
          <Flex alignItems="center">
            <ClickableText
              area="change"
              onClick={(e) => {
                setSortedColumn(SORT_FIELD.CHANGE)
                setSortDirection(sortedColumn !== SORT_FIELD.CHANGE ? true : !sortDirection)
              }}
            >
              <StyleHeader>
                Price Change (24hrs)
                {sortedColumn === SORT_FIELD.CHANGE ? (!sortDirection ? <SortEsc /> : <SortDesc />) : ''}
              </StyleHeader>
            </ClickableText>
          </Flex>
        )}
      </DashGrid>
      <List p={0}>
        {filteredList &&
          filteredList.map((item, index) => {
            return (
              <div key={index} className={index % 2 !== 0 ? 'background-item' : ''}>
                <ListItem key={index} index={(page - 1) * itemMax + index + 1} item={item} />
              </div>
            )
          })}
      </List>
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

export default withRouter(TopTokenList)
