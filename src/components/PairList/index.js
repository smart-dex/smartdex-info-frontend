import React, { useState, useEffect } from 'react'
import { useMedia } from 'react-use'
import dayjs from 'dayjs'
import LocalLoader from '../LocalLoader'
import utc from 'dayjs/plugin/utc'
import { Box, Flex, Text } from 'rebass'
import styled from 'styled-components'

import { CustomLink } from '../Link'
import { Divider } from '../../components'
import { withRouter } from 'react-router-dom'
import { formattedNum, formattedPercent } from '../../utils'
import DoubleTokenLogo from '../DoubleLogo'
import FormattedName from '../FormattedName'
import QuestionHelper from '../QuestionHelper'
import { TYPE } from '../../Theme'

dayjs.extend(utc)

const PageButtons = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 2em;
  margin-bottom: 0.5em;
`

const Arrow = styled.div`
  color: ${({ theme }) => theme.primary1};
  opacity: ${(props) => (props.faded ? 0.3 : 1)};
  padding: 0 20px;
  user-select: none;
  :hover {
    cursor: pointer;
  }
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

    :first-child {
      justify-content: flex-start;
      text-align: left;
      width: 20px;
    }
  }

  @media screen and (min-width: 740px) {
    grid-template-columns: 1.5fr 1fr 1fr};
    grid-template-areas: ' name liq vol pool ';
  }

  @media screen and (min-width: 1080px) {
    grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr 1fr;
    grid-template-areas: ' name liq vol volWeek fees apy';
  }

  @media screen and (min-width: 1200px) {
    grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr 1fr;
    grid-template-areas: ' name liq vol volWeek fees apy';
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
  color: ${({ theme }) => theme.titleTable};
  font-weight: bold;
  font-size: 14px;
  &:hover {
    cursor: pointer;
    opacity: 0.6;
  }
  text-align: end;
  user-select: none;
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
  LIQ: 0,
  VOL: 1,
  VOL_7DAYS: 3,
  FEES: 4,
  APY: 5,
}

const FIELD_TO_VALUE = {
  [SORT_FIELD.LIQ]: 'trackedReserveUSD', // sort with tracked volume only
  [SORT_FIELD.VOL]: 'oneDayVolumeUSD',
  [SORT_FIELD.VOL_7DAYS]: 'oneWeekVolumeUSD',
  [SORT_FIELD.FEES]: 'oneDayVolumeUSD',
}

function PairList({ pairs, color, disbaleLinks, maxItems = 10 }) {
  const below600 = useMedia('(max-width: 600px)')
  const below740 = useMedia('(max-width: 740px)')
  const below1080 = useMedia('(max-width: 1080px)')

  // pagination
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const ITEMS_PER_PAGE = maxItems

  // sorting
  const [sortDirection, setSortDirection] = useState(true)
  const [sortedColumn, setSortedColumn] = useState(SORT_FIELD.LIQ)

  useEffect(() => {
    setMaxPage(1) // edit this to do modular
    setPage(1)
  }, [pairs])

  useEffect(() => {
    if (pairs) {
      let extraPages = 1
      if (Object.keys(pairs).length % ITEMS_PER_PAGE === 0) {
        extraPages = 0
      }
      setMaxPage(Math.floor(Object.keys(pairs).length / ITEMS_PER_PAGE) + extraPages)
    }
  }, [ITEMS_PER_PAGE, pairs])

  const ListItem = ({ pairAddress, index }) => {
    const pairData = pairs[pairAddress]

    if (pairData && pairData.token0 && pairData.token1) {
      const liquidity = formattedNum(pairData.reserveUSD, true)
      const volume = formattedNum(pairData.oneDayVolumeUSD, true)
      const apy = formattedPercent((pairData.oneDayVolumeUSD * 0.002 * 365 * 100) / pairData.reserveUSD)

      return (
        <DashGrid style={{ height: '48px' }} disbaleLinks={disbaleLinks} focus={true}>
          <DataText area="name" fontWeight="500">
            {!below600 && <div style={{ marginRight: '20px', width: '10px' }}>{index}</div>}
            <DoubleTokenLogo
              size={below600 ? 16 : 20}
              a0={pairData.token0.id}
              a1={pairData.token1.id}
              margin={!below740}
            />
            <CustomLink style={{ marginLeft: '20px', whiteSpace: 'nowrap' }} to={'/pair/' + pairAddress} color={color}>
              <StyleDataLink>
                <FormattedName
                  text={pairData.token0.symbol + '-' + pairData.token1.symbol}
                  maxCharacters={below600 ? 8 : 16}
                  adjustSize={true}
                  link={true}
                />
              </StyleDataLink>
            </CustomLink>
          </DataText>
          <DataText area="liq">{liquidity}</DataText>
          <DataText area="vol">{volume}</DataText>
          {!below1080 && <DataText area="volWeek">{formattedNum(pairData.oneWeekVolumeUSD, true)}</DataText>}
          {!below1080 && <DataText area="fees">{formattedNum(pairData.oneDayVolumeUSD * 0.002, true)}</DataText>}
          {!below1080 && <DataText area="apy">{apy}</DataText>}
        </DashGrid>
      )
    } else {
      return ''
    }
  }

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

  const pairList =
    pairs &&
    Object.keys(pairs)
      .sort((addressA, addressB) => {
        const pairA = pairs[addressA]
        const pairB = pairs[addressB]
        if (sortedColumn === SORT_FIELD.APY) {
          const apy0 = parseFloat(pairA.oneDayVolumeUSD * 0.002 * 356 * 100) / parseFloat(pairA.reserveUSD)
          const apy1 = parseFloat(pairB.oneDayVolumeUSD * 0.002 * 356 * 100) / parseFloat(pairB.reserveUSD)
          return apy0 > apy1 ? (sortDirection ? -1 : 1) * 1 : (sortDirection ? -1 : 1) * -1
        }
        return parseFloat(pairA[FIELD_TO_VALUE[sortedColumn]]) > parseFloat(pairB[FIELD_TO_VALUE[sortedColumn]])
          ? (sortDirection ? -1 : 1) * 1
          : (sortDirection ? -1 : 1) * -1
      })
      .slice(ITEMS_PER_PAGE * (page - 1), page * ITEMS_PER_PAGE)
      .map((pairAddress, index) => {
        return (
          pairAddress && (
            <div key={index} className={index % 2 !== 0 ? 'background-item' : ''}>
              <ListItem key={index} index={(page - 1) * ITEMS_PER_PAGE + index + 1} pairAddress={pairAddress} />
              <Divider />
            </div>
          )
        )
      })

  return (
    <ListWrapper>
      <DashGrid
        center={true}
        disbaleLinks={disbaleLinks}
        className="header"
      >
        <Flex alignItems="center" justifyContent="flexStart">
          <TYPE.main area="name"><StyleHeader>Name</StyleHeader></TYPE.main>
        </Flex>
        <Flex alignItems="center" justifyContent="flexEnd">
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
          <Flex alignItems="center" justifyContent="flexEnd">
            <ClickableText
              area="volWeek"
              onClick={(e) => {
                setSortedColumn(SORT_FIELD.VOL_7DAYS)
                setSortDirection(sortedColumn !== SORT_FIELD.VOL_7DAYS ? true : !sortDirection)
              }}
            >
              <StyleHeader>Volume (7d) {sortedColumn === SORT_FIELD.VOL_7DAYS ? (!sortDirection ? <SortEsc /> : <SortDesc />) : ''}</StyleHeader>
            </ClickableText>
          </Flex>
        )}
        {!below1080 && (
          <Flex alignItems="center" justifyContent="flexEnd">
            <ClickableText
              area="fees"
              onClick={(e) => {
                setSortedColumn(SORT_FIELD.FEES)
                setSortDirection(sortedColumn !== SORT_FIELD.FEES ? true : !sortDirection)
              }}
            >
              <StyleHeader>Fees (24hr) {sortedColumn === SORT_FIELD.FEES ? (!sortDirection ? <SortEsc /> : <SortDesc />) : ''}</StyleHeader>
            </ClickableText>
          </Flex>
        )}
        {!below1080 && (
          <Flex alignItems="center" justifyContent="flexEnd">
            <ClickableText
              area="apy"
              onClick={(e) => {
                setSortedColumn(SORT_FIELD.APY)
                setSortDirection(sortedColumn !== SORT_FIELD.APY ? true : !sortDirection)
              }}
            >
              <StyleHeader>1y Fees / Liquidity {sortedColumn === SORT_FIELD.APY ? (!sortDirection ? <SortEsc /> : <SortDesc />) : ''}</StyleHeader>
            </ClickableText>
            <QuestionHelper text={'Based on 24hr volume annualized'} />
          </Flex>
        )}
      </DashGrid>
      <Divider />
      <List p={0}>{!pairList ? <LocalLoader /> : pairList}</List>
      <PageButtons>
        <div
          onClick={(e) => {
            setPage(page === 1 ? page : page - 1)
          }}
        >
          <Arrow faded={page === 1 ? true : false}>←</Arrow>
        </div>
        <TYPE.body>{'Page ' + page + ' of ' + maxPage}</TYPE.body>
        <div
          onClick={(e) => {
            setPage(page === maxPage ? page : page + 1)
          }}
        >
          <Arrow faded={page === maxPage ? true : false}>→</Arrow>
        </div>
      </PageButtons>
    </ListWrapper>
  )
}

export default withRouter(PairList)
