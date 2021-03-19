import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import { formatTime, formattedNum, urls } from '../../utils'
import { useMedia } from 'react-use'
import { useCurrentCurrency } from '../../contexts/Application'
import { RowFixed, RowBetween } from '../Row'

import LocalLoader from '../LocalLoader'
import { Box, Flex, Text } from 'rebass'
import Link from '../Link'
import { Divider, EmptyCard } from '..'
import DropdownSelect from '../DropdownSelect'
import FormattedName from '../FormattedName'
import { TYPE } from '../../Theme'
import { updateNameData } from '../../utils/data'

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
  grid-template-areas: 'txn value time';
  padding-right: 1.5rem;

  > * {
    justify-content: flex-end;
    width: 100%;

    &:first-child {
      justify-content: flex-start;
      text-align: left;
      width: 100px;
    }
  }

  @media screen and (min-width: 500px) {
    > * {
      &:first-child {
        width: 180px;
      }
    }
  }

  @media screen and (min-width: 780px) {
    grid-template-columns: 1.2fr 1fr 1fr 1fr 1fr;
    grid-template-areas: 'txn value amountToken amountOther time';

    > * {
      &:first-child {
        width: 230px;
      }
    }
  }

  @media screen and (min-width: 1080px) {
    grid-template-columns: 1.2fr 1fr 1fr 1fr 1fr 1fr;
    grid-template-areas: 'txn value amountToken amountOther account time';
  }
`

const ClickableText = styled(Text)`
  color: ${({ theme }) => theme.text1};
  user-select: none;
  text-align: end;

  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }

  @media screen and (max-width: 640px) {
    font-size: 14px;
  }
`

const DataText = styled(Flex)`
  align-items: center;
  text-align: right;
  color: ${({ theme }) => theme.colorHeader};
  font-size: 13px;
  font-weight: 500;
`

const SortText = styled.button`
  cursor: pointer;
  font-weight: ${({ active, theme }) => (active ? 500 : 400)};
  margin-right: .75rem;
  border: none;
  background-color: transparent;
  font-size: 14px;
  padding: 0px;
  color: ${({ active, theme }) => (active ? theme.activeTransaction : theme.noActiveTransaction)};
  outline: none;

  @media screen and (max-width: 600px) {
    font-size: 14px;
  }
`

const HeaderLeftTransaction = styled.div`
  .active {
    color: ${({ theme }) => theme.activeTransaction};
    font-weight: bold;
  }
  .no-active {
    color: ${({ theme }) => theme.noActiveTransaction};
    font-weight: 500;
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

const ListWrapper = styled.div`
  .header {
    background: ${({ theme }) => theme.backgroundHeader};
    height: fit-content;
    padding: 1rem 1.5rem 1rem 0;
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
  color: ${({ theme }) => theme.textMenu};
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
    background: ${({ theme }) => theme.backgroundSelect};
    :hover {
      background-color: yellow !important;
    }
  }
  :focus {
    outline: none;
  }
`

const SORT_FIELD = {
  VALUE: 'amountUSD',
  AMOUNT0: 'token0Amount',
  AMOUNT1: 'token1Amount',
  TIMESTAMP: 'timestamp',
}

const TXN_TYPE = {
  ALL: 'All',
  SWAP: 'Swaps',
  ADD: 'Adds',
  REMOVE: 'Removes',
}

const ITEMS_PER_PAGE = 10

function getTransactionType(event, symbol0, symbol1) {
  const formattedS0 = symbol0?.length > 8 ? symbol0.slice(0, 7) + '...' : symbol0
  const formattedS1 = symbol1?.length > 8 ? symbol1.slice(0, 7) + '...' : symbol1
  switch (event) {
    case TXN_TYPE.ADD:
      return 'Add ' + formattedS0 + ' and ' + formattedS1
    case TXN_TYPE.REMOVE:
      return 'Remove ' + formattedS0 + ' and ' + formattedS1
    case TXN_TYPE.SWAP:
      return 'Swap ' + formattedS0 + ' for ' + formattedS1
    default:
      return ''
  }
}

const listNumber = (maxPage) => {
  let listNumberPaging = []
  for (let i = 0; i < maxPage; i++) {
    listNumberPaging.push(i)
  }
  return listNumberPaging
}

// @TODO rework into virtualized list
function TxnList({ transactions, symbol0Override, symbol1Override, color }) {
  // page state
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const listNumberPaging = listNumber(maxPage)

  // sorting
  const [sortDirection, setSortDirection] = useState(true)
  const [sortedColumn, setSortedColumn] = useState(SORT_FIELD.TIMESTAMP)
  const [filteredItems, setFilteredItems] = useState()
  const [txFilter, setTxFilter] = useState(TXN_TYPE.ALL)

  const [currency] = useCurrentCurrency()

  useEffect(() => {
    setMaxPage(1) // edit this to do modular
    setPage(1)
  }, [transactions])

  // parse the txns and format for UI
  useEffect(() => {
    if (transactions && transactions.mints && transactions.burns && transactions.swaps) {
      let newTxns = []
      if (transactions.mints.length > 0) {
        transactions.mints.map((mint) => {
          let newTxn = {}
          newTxn.hash = mint.transaction.id
          newTxn.timestamp = mint.transaction.timestamp
          newTxn.type = TXN_TYPE.ADD
          newTxn.token0Amount = mint.amount0
          newTxn.token1Amount = mint.amount1
          newTxn.account = mint.to
          newTxn.token0Symbol = updateNameData(mint.pair).token0.symbol
          newTxn.token1Symbol = updateNameData(mint.pair).token1.symbol
          newTxn.amountUSD = mint.amountUSD
          return newTxns.push(newTxn)
        })
      }
      if (transactions.burns.length > 0) {
        transactions.burns.map((burn) => {
          let newTxn = {}
          newTxn.hash = burn.transaction.id
          newTxn.timestamp = burn.transaction.timestamp
          newTxn.type = TXN_TYPE.REMOVE
          newTxn.token0Amount = burn.amount0
          newTxn.token1Amount = burn.amount1
          newTxn.account = burn.sender
          newTxn.token0Symbol = updateNameData(burn.pair).token0.symbol
          newTxn.token1Symbol = updateNameData(burn.pair).token1.symbol
          newTxn.amountUSD = burn.amountUSD
          return newTxns.push(newTxn)
        })
      }
      if (transactions.swaps.length > 0) {
        transactions.swaps.map((swap) => {
          const netToken0 = swap.amount0In - swap.amount0Out
          const netToken1 = swap.amount1In - swap.amount1Out

          let newTxn = {}

          if (netToken0 < 0) {
            newTxn.token0Symbol = updateNameData(swap.pair).token0.symbol
            newTxn.token1Symbol = updateNameData(swap.pair).token1.symbol
            newTxn.token0Amount = Math.abs(netToken0)
            newTxn.token1Amount = Math.abs(netToken1)
          } else if (netToken1 < 0) {
            newTxn.token0Symbol = updateNameData(swap.pair).token1.symbol
            newTxn.token1Symbol = updateNameData(swap.pair).token0.symbol
            newTxn.token0Amount = Math.abs(netToken1)
            newTxn.token1Amount = Math.abs(netToken0)
          }

          newTxn.hash = swap.transaction.id
          newTxn.timestamp = swap.transaction.timestamp
          newTxn.type = TXN_TYPE.SWAP

          newTxn.amountUSD = swap.amountUSD
          newTxn.account = swap.to
          return newTxns.push(newTxn)
        })
      }

      const filtered = newTxns.filter((item) => {
        if (txFilter !== TXN_TYPE.ALL) {
          return item.type === txFilter
        }
        return true
      })
      setFilteredItems(filtered)
      let extraPages = 1
      if (filtered.length % ITEMS_PER_PAGE === 0) {
        extraPages = 0
      }
      if (filtered.length === 0) {
        setMaxPage(1)
      } else {
        setMaxPage(Math.floor(filtered.length / ITEMS_PER_PAGE) + extraPages)
      }
    }
  }, [transactions, txFilter])

  useEffect(() => {
    setPage(1)
  }, [txFilter])

  const filteredList =
    filteredItems &&
    filteredItems
      .sort((a, b) => {
        return parseFloat(a[sortedColumn]) > parseFloat(b[sortedColumn])
          ? (sortDirection ? -1 : 1) * 1
          : (sortDirection ? -1 : 1) * -1
      })
      .slice(ITEMS_PER_PAGE * (page - 1), page * ITEMS_PER_PAGE)

  const below1080 = useMedia('(max-width: 1080px)')
  const below780 = useMedia('(max-width: 780px)')

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

  const ListItem = ({ item }) => {
    return (
      <DashGrid style={{ height: '48px' }}>
        <DataText area="txn" fontWeight="500">
          <Link external href={urls.showTransaction(item.hash)}>
            <StyleDataLink style={{ paddingLeft: '1.5rem' }}>
              {getTransactionType(item.type, item.token1Symbol, item.token0Symbol)}
            </StyleDataLink>
          </Link>
        </DataText>
        <DataText area="value">
          {currency === 'ETH' ? 'Ξ ' + formattedNum(item.valueETH) : formattedNum(item.amountUSD, true)}
        </DataText>
        {!below780 && (
          <>
            <DataText area="amountOther">
              {formattedNum(item.token1Amount) + ' '}{' '}
              <FormattedName text={item.token1Symbol} maxCharacters={5} margin={true} />
            </DataText>
            <DataText area="amountToken">
              {formattedNum(item.token0Amount) + ' '}{' '}
              <FormattedName text={item.token0Symbol} maxCharacters={5} margin={true} />
            </DataText>
          </>
        )}
        {!below1080 && (
          <DataText area="account">
            <Link external href={'https://bscscan.com/address/' + item.account}>
              <StyleDataLink>{item.account && item.account.slice(0, 6) + '...' + item.account.slice(38, 42)}</StyleDataLink>
            </Link>
          </DataText>
        )}
        <DataText area="time">{formatTime(item.timestamp)}</DataText>
      </DashGrid>
    )
  }

  return (
    <ListWrapper>
      <DashGrid className="header" center={true}>
        {below780 ? (
          <RowBetween area="txn">
            <DropdownSelect options={TXN_TYPE} active={txFilter} setActive={setTxFilter} color={color} />
          </RowBetween>
        ) : (
            <RowFixed area="txn" gap="10px" pl={4}>
              <HeaderLeftTransaction style={{ paddingLeft: '1.5rem' }}>
                <SortText
                  onClick={() => {
                    setTxFilter(TXN_TYPE.ALL)
                  }}
                  active={txFilter === TXN_TYPE.ALL}
                  className={txFilter === TXN_TYPE.ALL ? 'active' : 'no-active'}
                >
                  All
                </SortText>
                <SortText
                  onClick={() => {
                    setTxFilter(TXN_TYPE.SWAP)
                  }}
                  active={txFilter === TXN_TYPE.SWAP}
                  className={txFilter === TXN_TYPE.SWAP ? 'active' : 'no-active'}
                >
                  Swaps
                </SortText>
                <SortText
                  onClick={() => {
                    setTxFilter(TXN_TYPE.ADD)
                  }}
                  active={txFilter === TXN_TYPE.ADD}
                  className={txFilter === TXN_TYPE.ADD ? 'active' : 'no-active'}
                >
                  Adds
                </SortText>
                <SortText
                  onClick={() => {
                    setTxFilter(TXN_TYPE.REMOVE)
                  }}
                  active={txFilter === TXN_TYPE.REMOVE}
                  className={txFilter === TXN_TYPE.REMOVE ? 'active' : 'not-active'}
                >
                  Removes
                </SortText>
              </HeaderLeftTransaction>
            </RowFixed>
          )}

        <Flex alignItems="center" justifyContent="flexStart">
          <ClickableText
            color="textDim"
            area="value"
            onClick={(e) => {
              setSortedColumn(SORT_FIELD.VALUE)
              setSortDirection(sortedColumn !== SORT_FIELD.VALUE ? true : !sortDirection)
            }}
          >
            <StyleHeader>Total Value {sortedColumn === SORT_FIELD.VALUE ? (!sortDirection ? <SortEsc /> : <SortDesc />) : ''}</StyleHeader>
          </ClickableText>
        </Flex>
        {!below780 && (
          <Flex alignItems="center">
            <ClickableText
              area="amountToken"
              color="textDim"
              onClick={() => {
                setSortedColumn(SORT_FIELD.AMOUNT0)
                setSortDirection(sortedColumn !== SORT_FIELD.AMOUNT0 ? true : !sortDirection)
              }}
            >
              <StyleHeader>
                {symbol0Override ? symbol0Override + ' Amount' : 'Token Amount'}{' '}
                {sortedColumn === SORT_FIELD.AMOUNT0 ? (sortDirection ? <SortEsc /> : <SortDesc />) : ''}
              </StyleHeader>
            </ClickableText>
          </Flex>
        )}
        <>
          {!below780 && (
            <Flex alignItems="center">
              <ClickableText
                area="amountOther"
                color="textDim"
                onClick={() => {
                  setSortedColumn(SORT_FIELD.AMOUNT1)
                  setSortDirection(sortedColumn !== SORT_FIELD.AMOUNT1 ? true : !sortDirection)
                }}
              >
                <StyleHeader>
                  {symbol1Override ? symbol1Override + ' Amount' : 'Token Amount'}{' '}
                  {sortedColumn === SORT_FIELD.AMOUNT1 ? (sortDirection ? <SortEsc /> : <SortDesc />) : ''}
                </StyleHeader>
              </ClickableText>
            </Flex>
          )}
          {!below1080 && (
            <Flex alignItems="center">
              <TYPE.body area="account"><StyleHeader>Account</StyleHeader></TYPE.body>
            </Flex>
          )}
          <Flex alignItems="center">
            <ClickableText
              area="time"
              color="textDim"
              onClick={() => {
                setSortedColumn(SORT_FIELD.TIMESTAMP)
                setSortDirection(sortedColumn !== SORT_FIELD.TIMESTAMP ? true : !sortDirection)
              }}
            >
              <StyleHeader>Time {sortedColumn === SORT_FIELD.TIMESTAMP ? (!sortDirection ? <SortEsc /> : <SortDesc />) : ''}</StyleHeader>
            </ClickableText>
          </Flex>
        </>
      </DashGrid>
      <Divider />
      <List p={0}>
        {!filteredList ? (
          <LocalLoader />
        ) : filteredList.length === 0 ? (
          <EmptyCard>No recent transactions found.</EmptyCard>
        ) : (
              filteredList.map((item, index) => {
                return (
                  <div key={index} className={index % 2 !== 0 ? 'background-item' : ''}>
                    <ListItem key={index} index={index + 1} item={item} />
                    <Divider />
                  </div>
                )
              })
            )}
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

export default TxnList
